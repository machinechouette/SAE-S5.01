"""Backend entry point: REST API and WebSocket for the frontend.

Run: uvicorn main:app --reload, then open http://localhost:8000/docs

TODO:
- connect the USB watcher at startup (see hardware.py)
- listen to the button and joystick topics (format to agree with Reda, see simulator.py)
- push the USB events on the WebSocket too
- admin PIN on the /api/admin routes
"""

import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel

from engine import GameEngine, InvalidTransition, NoAnswersLeft, Phase

from hardware import MqttClient

game = GameEngine()
screens: set[WebSocket] = set()

def on_mqtt_weight(grams: float, stable: bool):
    # On insère l'action dans la boucle asynchrone pour mettre à jour le jeu et déclencher le broadcast WebSocket
    asyncio.create_task(handle_weight(grams, stable))

mqtt_client = MqttClient(on_mqtt_weight)


async def send_all(message: dict):
    for ws in list(screens):
        try:
            await ws.send_json(message)
        except Exception:
            screens.discard(ws)


async def broadcast():
    """Send the full game state to every connected screen."""
    await send_all({"event": "state", "data": game.full_state()})


def notify_hardware(phase_before: Phase, repaired_before: int):
    """Drive the LEDs after a change: green on repair, red on defeat, gauge = repaired modules."""
    repaired = len(game.repaired)
    if repaired > repaired_before:
        mqtt_client.publish_feedback("succes")
    if repaired != repaired_before:
        mqtt_client.publish_feedback("jauge", repaired)
    if game.phase == Phase.END_DEFEAT and phase_before != Phase.END_DEFEAT:
        mqtt_client.publish_feedback("defaite")


async def watch_timer():
    # Every second: check for defeat and refresh the timer on the screens
    while True:
        if game.check_time():
            mqtt_client.publish_feedback("defaite")
        await broadcast()
        await asyncio.sleep(1)


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(watch_timer())
    mqtt_client.connect()
    yield
    task.cancel()
    mqtt_client.disconnect()


app = FastAPI(title="Cyberdeck - Backend", lifespan=lifespan)


class Weight(BaseModel):
    grams: float
    stable: bool = True


class Password(BaseModel):
    value: str


class Choice(BaseModel):
    accept: bool


async def run(action):
    phase_before, repaired_before = game.phase, len(game.repaired)
    try:
        action()
    except InvalidTransition as e:
        raise HTTPException(409, str(e))
    notify_hardware(phase_before, repaired_before)
    await broadcast()
    return game.full_state()


async def handle_weight(grams: float, stable: bool):
    # Live reading for the module 2 screen (the target is not sent: the player has to find it)
    await send_all({"event": "weight", "data": {"grams": grams, "stable": stable}})
    return await run(lambda: game.on_weight(grams, stable))


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
    # Software-only mode and testing without the Arduino; MQTT goes through handle_weight too
    return await handle_weight(body.grams, body.stable)


@app.post("/api/game/controls")
async def controls():
    # Module 1: sent by the frontend once the whole color sequence is reproduced on the controller
    return await run(game.on_controls_success)


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
