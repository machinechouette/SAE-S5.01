# Backend - Cyberdeck

Python / FastAPI backend, based on the GDD (sections 4.1 and 4.2).

| File | Content |
|------|---------|
| `main.py` | REST API + WebSocket, timer watch every second |
| `engine.py` | Game engine: phases, timer (`ends_at`), module 2 weight check, password, hints |
| `config.py` | Settings (timer, target weight, tolerance, MQTT topics) |
| `hardware.py` | MQTT client and USB watcher (to do) |
| `test_engine.py` | Engine unit tests |

## Status

- Playable now (vertical slice): start → module 2 (weight held within tolerance for 2 s) → ethical choice → endings → Hopper screen; defeat when the 20 minutes run out.
- Hints: light → precise → answer, 2 answers per game.
- To do: modules 1 and 3, MQTT, WebSocket broadcast, database.

## Run

```
pip install -r requirements.txt
uvicorn main:app --reload     # API docs: http://localhost:8000/docs
pytest
```

Without the ESP32, send weights with `POST /api/game/weight` `{"grams": 12.0, "stable": true}`.
