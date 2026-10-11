# Backend - Cyberdeck

Squelette du backend (Python / FastAPI), d'après le GDD (sections 4.1 et 4.2).
Rien n'est encore implémenté : chaque fichier décrit en commentaire ce qu'il reste à faire.

## Rôle dans l'architecture

```
ESP32 --Wi-Fi/MQTT--> Mosquitto <--> Backend <--> SQLite
                                        ^  ^
                       REST + WebSocket |  | événements USB
                                Frontend    Détection clés USB
```

## Organisation

| Dossier | Contenu |
|---------|---------|
| `app/main.py` | Point d'entrée FastAPI, démarrage des composants |
| `app/config.py` | Paramètres (chrono, topics MQTT, chemin de la base) |
| `app/api/` | API REST et canal WebSocket vers le frontend |
| `app/engine/` | Moteur de jeu : machine à états, chrono, indices, validation des modules |
| `app/messaging/` | Client MQTT (ESP32 <-> backend) |
| `app/usb/` | Détection des clés USB (module 3) |
| `app/db/` | Accès à SQLite (interface à définir avec le garant base de données) |
| `tests/` | Tests unitaires du moteur de jeu |

## Lancer (plus tard)

```
pip install -r requirements.txt
uvicorn app.main:app --reload
pytest
```
