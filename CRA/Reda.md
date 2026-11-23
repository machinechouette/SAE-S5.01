Semaine du 5/10/2026 au 11/10/2026 :
 - Analyse des moyens de communication entre le microcontrôleur ESP32 et le serveur. Comparaison entre une API REST classique, l'utilisation d'un Message Broker (comme MQTT) et WebSockets pour gérer les flux de données.
 - Confrontation des idées de gameplay (le Cyberdeck, la balance, les capteurs) avec la réalité technique pour s'assurer que les concepts du GDD sont techniquement viables pour le jalon du Prototype (MVP), sans que la charge de travail côté backend ne devienne ingérable.

Semaine du 12/10/2026 au 18/10/2026 :
 - Analyse du protocole MQTT (Mosquitto) retenu dans la stack technologique du projet : système de requêtes par événements sur des topics dédiés

Semaine du 19/10/2026 au 25/10/2026 :
 - Mise en place locale du broker MQTT Mosquitto et validation des premiers échanges de messages à l'aide de MQTT Explorer.
 Clonage du dépôt GitHub du projet et prise en main de l'architecture.

Semaine du 2/11/2026 au 8/11/2026 :
 - Installation des dépendances Python listées dans requirements.txt (FastAPI, Uvicorn, Paho-MQTT) et résolution des    blocages d'environnement sur macOS (configuration du PATH pour uvicorn), ainsi que mise à niveau vers CallbackAPIVersion pour paho-mqtt 2.0.   

Semaine du 09/11/2026 au 15/11/2026 :
 - Implémentation de la classe MqttClient dans backend/hardware.py (connexion au broker Mosquitto, abonnement au topic cyberdeck/module2/poids, parsing JSON et pont thread-safe vers la boucle asyncio) et intégration dans le cycle de vie de backend/main.py.   
 - Tests de bout en bout validant la chaîne complète jusqu'au moteur de jeu pour la réparation du Module 2 (maintien du poids cible stable pendant 2 secondes), suivis de l'intégration.   
 - Prise en main du script de lancement multi-services et du simulateur matériel Arduino MKR WiFi 1010 avec le frontend React/Vite.   
 - Validation de la boucle complète en temps réel (frontend ↔ WebSocket /ws de FastAPI ↔ Mosquitto ↔ simulateur Arduino) sur le scénario du Module 2. 

Semaine du 16/11/2026 au 22/11/2026 :  
 - Préparation des fichiers de déploiement pour le Raspberry Pi 3 dans un dossier pi/ : service systemd pour le backend (cyberdeck-backend.service), ouverture de Mosquitto aux connexions externes sur le port 1883 (mosquitto-cyberdeck.conf), script d'installation automatisé (setup.sh installant Node.js 22 LTS pour la compatibilité avec Vite 8) et lancement automatique de Chromium en mode kiosque (start-kiosk.sh, cyberdeck-kiosk.desktop).   
 - Adaptation de backend/main.py pour servir directement le build statique de production du frontend (frontend/dist) sur le port 8000 — en cohérence avec les routes relatives /api et /ws — afin de supprimer le serveur de développement Vite sur le Raspberry Pi 3, puis validation locale du fonctionnement sur le port 8000.
