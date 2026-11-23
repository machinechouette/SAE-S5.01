#!/bin/bash
set -euo pipefail

if [ "$EUID" -eq 0 ]; then
    echo "Lance ce script sans sudo : ./pi/setup.sh"
    exit 1
fi

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CURRENT_USER="$USER"

echo "[1/6] Installation des paquets système..."
sudo apt update
sudo apt install -y mosquitto mosquitto-clients python3 python3-venv curl ca-certificates

echo "[2/6] Vérification de Node.js (version 22 LTS requise pour Vite 8)..."
NODE_MAJOR="$(node -v 2>/dev/null | sed 's/^v//' | cut -d. -f1 || echo 0)"
if [ "${NODE_MAJOR:-0}" -lt 22 ]; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt install -y nodejs
fi

echo "[3/6] Configuration de Mosquitto (connexions externes sur le port 1883)..."
sudo cp "$PROJECT_DIR/pi/mosquitto-cyberdeck.conf" /etc/mosquitto/conf.d/cyberdeck.conf
sudo systemctl enable mosquitto
sudo systemctl restart mosquitto

echo "[4/6] Installation du backend Python..."
VENV="$PROJECT_DIR/backend/.venv"
[ -x "$VENV/bin/python" ] || python3 -m venv "$VENV"
"$VENV/bin/python" -m pip install --upgrade pip
"$VENV/bin/python" -m pip install -r "$PROJECT_DIR/backend/requirements.txt"

echo "[5/6] Compilation du frontend (build de production)..."
(
    cd "$PROJECT_DIR/frontend"
    npm ci
    NODE_OPTIONS="--max-old-space-size=512" npm run build
)

echo "[6/6] Activation du service backend et du mode kiosque..."
sed -e "s|__USER__|$CURRENT_USER|g" -e "s|__PROJECT_DIR__|$PROJECT_DIR|g" \
    "$PROJECT_DIR/pi/cyberdeck-backend.service" \
    | sudo tee /etc/systemd/system/cyberdeck-backend.service >/dev/null

sudo systemctl daemon-reload
sudo systemctl enable --now cyberdeck-backend

chmod +x "$PROJECT_DIR/pi/start-kiosk.sh"
mkdir -p "$HOME/.config/autostart"
sed "s|__PROJECT_DIR__|$PROJECT_DIR|g" \
    "$PROJECT_DIR/pi/cyberdeck-kiosk.desktop" \
    > "$HOME/.config/autostart/cyberdeck-kiosk.desktop"

echo "Installation terminée. Vérifie le backend avec : sudo systemctl status cyberdeck-backend"