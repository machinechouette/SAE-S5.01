"""Backend settings.

TODO: read from environment variables / the database instead of hard-coded values.
"""

TIMER_SECONDS = 20 * 60
MAX_ANSWERS = 2
PASSWORD = "HOPPER"

# Modules 1 to 3 can be solved end to end; 4 and 5 still have no screen
ACTIVE_MODULES = ("MODULE_1", "MODULE_2", "MODULE_3", "MODULE_4", "MODULE_5")

# Module 2 - provisional values, to adjust after weighing the beads
TARGET_WEIGHT_G = 12.0
WEIGHT_TOLERANCE_G = 1.0
STABLE_SECONDS = 2.0

# Module 3 - provisional answer, to replace once the coded message is written with the team
DECODED_MESSAGE = "SOUS LE CLAVIER"
USB_SCAN_SECONDS = 1.0
USB_MAX_FILES = 20
USB_MAX_FILE_BYTES = 64 * 1024
# Folder whose subfolders act as plugged USB keys (testing without a real key); ignored if missing
FAKE_USB_DIR = "fake_usb"

# TODO: provisional texts, to be replaced by the ones stored in the database
HINT_TEXTS = {
    n: [f"Light hint for module {n}", f"Precise hint for module {n}", f"Answer for module {n}"]
    for n in range(1, 6)
}

MQTT_HOST = "localhost"
MQTT_PORT = 1883
TOPIC_WEIGHT = "cyberdeck/module2/poids"
TOPIC_FEEDBACK = "cyberdeck/feedback"

DB_PATH = "cyberdeck.sqlite3"
