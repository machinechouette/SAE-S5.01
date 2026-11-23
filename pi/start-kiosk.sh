#!/bin/bash
URL="http://localhost:8000"

# Attendre que le serveur réponde (max 60 s) avant d'ouvrir le navigateur
for _ in $(seq 1 60); do
    if curl -sf "$URL" >/dev/null 2>&1; then
        break
    fi
    sleep 1
done

BROWSER="$(command -v chromium || command -v chromium-browser)"
if [ -z "$BROWSER" ]; then
    echo "Chromium introuvable." >&2
    exit 1
fi

exec "$BROWSER" \
    --kiosk \
    --noerrdialogs \
    --disable-infobars \
    --no-first-run \
    --disable-session-crashed-bubble \
    --check-for-update-interval=31536000 \
    "$URL"