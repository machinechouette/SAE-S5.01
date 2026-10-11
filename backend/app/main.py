"""Point d'entrée du backend (FastAPI).

TODO :
- au démarrage (lifespan) : ouvrir la base, connecter le client MQTT, lancer la détection USB
- à l'arrêt : fermer proprement ces composants
- brancher les événements MQTT / USB sur le moteur de jeu, puis notifier le frontend en WebSocket
- configurer CORS pour le frontend en développement (Vite)
"""

from fastapi import FastAPI

from app.api import routes, websocket

app = FastAPI(title="Cyberdeck - Backend")
app.include_router(routes.router)
app.include_router(websocket.router)
