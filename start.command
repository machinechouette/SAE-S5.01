#!/bin/bash
# Cyberdeck launcher for macOS: double-click to start Mosquitto, backend, frontend and the Arduino simulator.
# First time only: right-click > Open, then confirm (macOS blocks downloaded scripts).

cd "$(dirname "$0")" || exit 1
ROOT="$PWD"

fail() { echo "[x] $1"; read -r -p "Press Enter to close..."; exit 1; }

# Homebrew is not on the PATH of a double-clicked script on some Macs
for brew_bin in /opt/homebrew/bin /usr/local/bin; do
    [ -d "$brew_bin" ] && PATH="$brew_bin:$PATH"
done

command -v python3 >/dev/null || fail "Python 3 not found. Install it: brew install python"
command -v npm >/dev/null || fail "Node.js not found. Install it: brew install node"

echo "[1/5] Backend dependencies..."
# A virtual environment: Homebrew's Python refuses a global pip install
VENV="$ROOT/backend/.venv"
[ -x "$VENV/bin/python" ] || python3 -m venv "$VENV" || fail "Could not create backend/.venv"
PY="$VENV/bin/python"
"$PY" -c "import fastapi, uvicorn, paho.mqtt" 2>/dev/null \
    || "$PY" -m pip install -r "$ROOT/backend/requirements.txt" || fail "pip install failed"

echo "[2/5] Frontend dependencies..."
if [ ! -d "$ROOT/frontend/node_modules" ]; then
    (cd "$ROOT/frontend" && npm install) || fail "npm install failed"
fi

# Opens a new Terminal window with a title, running a command from a folder
open_window() {
    # Title and command are passed as arguments, so nothing has to be escaped for AppleScript
    osascript -e 'on run argv' \
        -e 'tell application "Terminal" to set custom title of (do script (item 2 of argv)) to (item 1 of argv)' \
        -e 'end run' "$1" "cd '$2' && $3" >/dev/null
}

# Mosquitto must be up before the backend, otherwise the backend does not connect to MQTT
echo "[3/5] Mosquitto..."
SIMULATOR=1
if ! nc -z localhost 1883 2>/dev/null; then
    MOSQUITTO="$(command -v mosquitto || ls "$(brew --prefix 2>/dev/null)/sbin/mosquitto" 2>/dev/null)"
    if [ -n "$MOSQUITTO" ]; then
        open_window "Mosquitto" "$ROOT" "'$MOSQUITTO' -v"
        sleep 2
    else
        echo "    Mosquitto is not installed: the game runs without the simulator."
        echo "    To install it: brew install mosquitto"
        SIMULATOR=0
    fi
fi

echo "[4/5] Backend and frontend..."
open_window "Backend (FastAPI)" "$ROOT/backend" "'$PY' -m uvicorn main:app --port 8000"
open_window "Frontend (Vite)" "$ROOT/frontend" "npm run dev -- --port 5173 --strictPort"

echo "[5/5] Arduino simulator..."
[ "$SIMULATOR" = 1 ] && open_window "Arduino simulator" "$ROOT/backend" "'$PY' simulator.py"

sleep 5
open http://localhost:5173

echo
echo "Cyberdeck is running: http://localhost:5173  (API: http://localhost:8000/docs)"
echo "Close the Terminal windows to stop it."
