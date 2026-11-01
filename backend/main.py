"""Backend entry point: REST API and WebSocket for the frontend.

Run: uvicorn main:app --reload, then open http://localhost:8000/docs

TODO:
- connect the MQTT client and the USB watcher at startup (see hardware.py)
- push the live weight and USB events on the WebSocket too
- admin PIN on the /api/admin routes
"""

import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel

from engine import GameEngine, InvalidTransition, NoAnswersLeft

game = GameEngine()
screens: set[WebSocket] = set()


async def broadcast():
    """Send the full game state to every connected screen."""
    message = {"event": "state", "data": game.full_state()}
    for ws in list(screens):
        try:
            await ws.send_json(message)
        except Exception:
            screens.discard(ws)


async def watch_timer():
    # Every second: check for defeat and refresh the timer on the screens
    while True:
        game.check_time()
        await broadcast()
        await asyncio.sleep(1)


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(watch_timer())
    yield
    task.cancel()


app = FastAPI(title="Cyberdeck - Backend", lifespan=lifespan)


class Weight(BaseModel):
    grams: float
    stable: bool = True


class Password(BaseModel):
    value: str


class Choice(BaseModel):
    accept: bool


async def run(action):
    try:
        action()
    except InvalidTransition as e:
        raise HTTPException(409, str(e))
    await broadcast()
    return game.full_state()


@app.post("/api/game/start")
async def start():
    return await run(game.start)


@app.get("/api/game/state")
def state():
    return game.full_state()


@app.post("/api/game/module")
async def open_module():
    return await run(game.open_module)


@app.post("/api/game/weight")
async def weight(body: Weight):
    # Software-only mode and testing without the ESP32; MQTT will call game.on_weight too
    return await run(lambda: game.on_weight(body.grams, body.stable))


@app.post("/api/game/password")
async def password(body: Password):
    return await run(lambda: game.on_password(body.value))


@app.post("/api/game/hint")
async def hint():
    try:
        result = game.ask_hint()
    except InvalidTransition as e:
        raise HTTPException(409, str(e))
    except NoAnswersLeft:
        raise HTTPException(403, "no answers left")
    await broadcast()
    return result


@app.post("/api/game/choice")
async def choice(body: Choice):
    return await run(lambda: game.choose(body.accept))


@app.post("/api/game/hopper")
async def hopper():
    return await run(game.go_to_hopper)


@app.post("/api/admin/reset")
async def reset():
    return await run(game.reset)


@app.websocket("/ws")
async def live(ws: WebSocket):
    await ws.accept()
    screens.add(ws)
    await ws.send_json({"event": "state", "data": game.full_state()})
    try:
        while True:
            await ws.receive_text()  # screens only listen, this just detects the disconnect
    except WebSocketDisconnect:
        screens.discard(ws)
