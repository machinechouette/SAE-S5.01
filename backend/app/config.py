"""Paramètres du backend.

TODO :
- lire ces valeurs depuis des variables d'environnement (hôte du broker, chemin de la base)
- voir avec la base de données si la durée du chrono doit être paramétrable en base (GDD 6)
"""

DUREE_CHRONO_SECONDES = 20 * 60
REPONSES_MAX_PAR_PARTIE = 2
MOT_DE_PASSE_FINAL = "HOPPER"  # TODO : à stocker en base plutôt qu'en dur

MQTT_HOTE = "localhost"
MQTT_PORT = 1883
TOPIC_POIDS = "cyberdeck/module2/poids"
TOPIC_FEEDBACK = "cyberdeck/feedback"

CHEMIN_BASE = "cyberdeck.sqlite3"
