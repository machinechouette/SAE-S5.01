Semaine du 5/10/2026 au 11/10/2026 :

 - Réflexion sur l'architecture du backend à partir du GDD et de son schéma d'architecture (FastAPI, MQTT, WebSocket, SQLite).
 - Découpage du backend en composants : API REST, canal WebSocket, moteur de jeu (machine à états), client MQTT, détection des clés USB.
 - Création des squelettes de code du backend, commentés avec ce qu'il reste à faire dans chaque fichier.
 - Mise en ligne de ces squelettes sur ma branche abdellah.

Semaine du 12/10/2026 au 18/10/2026 :

 - Analyse du plan de projet (contrats API / MQTT / WebSocket, calendrier jusqu'au 4 décembre) pour préparer la réunion de lundi.
 - Implémentation du moteur de jeu : machine à états, chrono basé sur une heure de fin avec défaite automatique, validation du poids du module 2 (tolérance + stabilité 2 s), mot de passe final, indices à 3 niveaux limités à 2 réponses.
 - Première API REST FastAPI jouable sans matériel, et 17 tests unitaires du moteur avec pytest.

Semaine du 19/10/2026 au 25/10/2026 :

 - Discussion en équipe sur le matériel nécessaire au projet.
 - Remise en question et révision de l'architecture de notre programme.
 - Définition des prochaines étapes et des objectifs à atteindre pendant les vacances.

Semaine du 26/10/2026 au 01/11/2026 :

 - Intégration du backend avec le frontend : alignement du moteur de jeu sur les écrans de Tiago (phases ACCUEIL → HUB → modules → CHOIX, passage à 5 modules).
 - WebSocket temps réel : l'état de la partie et le chrono sont envoyés à l'écran après chaque action et chaque seconde.
 - Côté frontend : proxy Vite vers l'API, hook useGame pour se connecter au backend, bouton LANCER relié à l'API.

Semaine du 09/11/2026 au 15/11/2026 :

 - Création d'un simulateur de l'Arduino (balance, bouton, joystick, LEDs) pour tester sans le matériel.
 - Envoi du poids en direct au frontend par WebSocket pour l'écran du module 2.
 - Retour vers les LEDs (succès, défaite, jauge) depuis le moteur de jeu via MQTT.
 - Démarrage du backend même sans Mosquitto, pour pouvoir travailler sans le broker.

Semaine du 16/11/2026 au 22/11/2026 :

 - Installation de Mosquitto et test de toute la chaîne MQTT avec le simulateur : poids envoyé par la « carte » → backend → écran en direct, puis retour vers les LEDs (succès, jauge). Deux problèmes relevés à corriger : le backend ne se reconnecte pas si Mosquitto démarre après lui, et le poids n'a pas le même nom en MQTT (poids) et dans l'API REST (grams).
 - Création de lanceurs en un double-clic pour toute l'équipe : start.bat (Windows) et start.command (macOS). Ils vérifient Python et Node, installent les dépendances si besoin, démarrent Mosquitto avant le backend, puis ouvrent le backend, le frontend et le simulateur dans des fenêtres séparées et le jeu dans le navigateur.
 - Tests d'intégration des écrans de Tiago dans Chrome, partie complète de l'accueil jusqu'au choix éthique.
 - Backend du module 1 (Contrôles) : nouvelle route qui valide la séquence de la manette Xbox lue par l'écran (API Gamepad) et répare le module. Cela a débloqué la partie, qui restait bloquée sur le module 1 depuis l'activation des 5 modules.
 - Backend du module 3 (Données) : détection des clés USB branchées (Raspberry Pi, macOS et Windows), identifiées par leur nom de volume, avec lecture des fichiers .txt seulement et des limites de taille. La clé est envoyée en direct à l'écran par le WebSocket, et le message déchiffré est validé sans tenir compte des majuscules, espaces, ponctuation et accents.
 - Dossier fake_usb pour simuler des clés USB sans matériel.
 - Modules 1, 2 et 3 jouables de bout en bout (frontend et backend), testés dans le navigateur.
 - Analyse de l'avancement par rapport au MVP du GDD et répartition des tâches de la semaine prochaine pour chaque membre (écrans de fin, base de données SQLite, programme de la carte et LEDs, Raspberry Pi en mode kiosque).
 - Incohérences relevées dans le GDD à trancher en équipe : le module 4 attend un mot de passe dans le code mais un code à 6 chiffres dans le GDD, et le module 5 n'est pas défini.
