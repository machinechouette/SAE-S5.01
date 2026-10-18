"""Backend entry point: REST API and WebSocket for the frontend.

Run: uvicorn main:app --reload, then open http://localhost:8000/docs

TODO:
- connect the MQTT client and the USB watcher at startup (see hardware.py)
- WebSocket: push full_state() and live weight to the screen after every change
- Pydantic models for the API contract agreed with the frontend
- admin PIN on the /api/admin routes
"""

import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, WebSocket
from pydantic import BaseModel

from engine import GameEngine, InvalidTransition, NoAnswersLeft

game = GameEngine()


async def watch_timer():
    while True:
        game.check_time()
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


def run(action):
    try:
        action()
    except InvalidTransition as e:
        raise HTTPException(409, str(e))
    return game.full_state()


@app.post("/api/game/start")
def start():
    return run(game.start)


@app.get("/api/game/state")
def state():
    return game.full_state()


@app.post("/api/game/weight")
def weight(body: Weight):
    # Software-only mode and testing without the ESP32; MQTT will call game.on_weight too
    return run(lambda: game.on_weight(body.grams, body.stable))


@app.post("/api/game/password")
def password(body: Password):
    return run(lambda: game.on_password(body.value))


@app.post("/api/game/hint")
def hint():
    try:
        return game.ask_hint()
    except InvalidTransition as e:
        raise HTTPException(409, str(e))
    except NoAnswersLeft:
        raise HTTPException(403, "no answers left")


@app.post("/api/game/choice")
def choice(body: Choice):
    return run(lambda: game.choose(body.accept))


@app.post("/api/game/hopper")
def hopper():
    return run(game.go_to_hopper)


@app.post("/api/admin/reset")
def reset():
    return run(game.reset)


@app.websocket("/ws")
async def live(ws: WebSocket):
    # TODO: keep the list of connected screens and broadcast state / weight / usb events
    await ws.accept()
    await ws.send_json({"event": "state", "data": game.full_state()})
    await ws.close()
