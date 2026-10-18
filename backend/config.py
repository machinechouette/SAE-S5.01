"""Backend settings.

TODO: read from environment variables / the database instead of hard-coded values.
"""

TIMER_SECONDS = 20 * 60
MAX_ANSWERS = 2
PASSWORD = "HOPPER"

# Vertical slice: only module 2 is playable for now
ACTIVE_MODULES = ("module_2",)

# Module 2 - provisional values, to adjust after weighing the beads
TARGET_WEIGHT_G = 12.0
WEIGHT_TOLERANCE_G = 1.0
STABLE_SECONDS = 2.0

# TODO: provisional texts, to be replaced by the ones stored in the database
HINT_TEXTS = {
    n: [f"Light hint for module {n}", f"Precise hint for module {n}", f"Answer for module {n}"]
    for n in range(1, 5)
}

MQTT_HOST = "localhost"
MQTT_PORT = 1883
TOPIC_WEIGHT = "cyberdeck/module2/poids"
TOPIC_FEEDBACK = "cyberdeck/feedback"

DB_PATH = "cyberdeck.sqlite3"
