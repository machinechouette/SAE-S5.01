"""Physical inputs: MQTT link with the ESP32 and USB key detection.

TODO (MQTT, with the distributed architecture owner):
- connect to Mosquitto, reconnect automatically
- subscribe to config.TOPIC_WEIGHT and call game.on_weight(grams, stable)
- publish on config.TOPIC_FEEDBACK to drive the LEDs and the buzzer
- paho runs in its own thread: hand events back to the asyncio loop

"""
import asyncio
import json
import os
import sys

import paho.mqtt.client as mqtt
import config

class MqttClient:
    def __init__(self, callback_weight):
        self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1, "BackendFastAPI")
        self.callback_weight = callback_weight
        
        self.client.on_connect = self._on_connect
        self.client.on_message = self._on_message

    def _on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print("MQTT connecté à Mosquitto !")
            # On s'abonne au canal défini dans config.py
            self.client.subscribe(config.TOPIC_WEIGHT)
        else:
            print(f"Erreur MQTT (code {rc})")

    def _on_message(self, client, userdata, msg):
        if msg.topic == config.TOPIC_WEIGHT:
            try:
                data = json.loads(msg.payload.decode('utf-8'))
                grams = float(data.get("poids", 0.0))
                stable = data.get("stable", True)
                
                # IMPORTANT : Paho tourne dans un thread séparé.
                # On utilise call_soon_threadsafe pour transmettre l'événement à la boucle asyncio de FastAPI en toute sécurité.
                if hasattr(self, 'loop') and self.loop.is_running():
                    self.loop.call_soon_threadsafe(self.callback_weight, grams, stable)

            except Exception as e:
                print(f"Erreur parsing MQTT : {e}")

    def connect(self) -> None:
        # On capture la boucle asyncio principale au moment du démarrage
        self.loop = asyncio.get_running_loop()
        
        # connect_async: the backend starts even if Mosquitto is not running yet, paho retries in the background
        self.client.connect_async(config.MQTT_HOST, config.MQTT_PORT, 60)

        # Utilisation de loop_start() (arrière-plan) au lieu de loop_forever() pour ne pas bloquer le fonctionnement de FastAPI.
        self.client.loop_start()

    def disconnect(self) -> None:
        self.client.loop_stop()
        self.client.disconnect()

    def publish_feedback(self, kind: str, value: int | None = None) -> None:
        # Publie l'ordre sur le canal cyberdeck/feedback (pour piloter les LEDs)
        message = {"action": kind}
        if value is not None:
            message["valeur"] = value
        self.client.publish(config.TOPIC_FEEDBACK, json.dumps(message))


class UsbWatcher:
    """Module 3: finds the plugged USB keys and reads their .txt files (read-only).

    Polled every second by main.py instead of pyudev, so it works the same on the
    Raspberry Pi (/media), macOS (/Volumes) and Windows (removable drive letters).
    Keys are identified by their volume label, never by the port.
    """

    def scan(self) -> list[dict]:
        """Plugged keys, as [{"label": ..., "fichiers": [{"nom": ..., "contenu": ...}]}]."""
        keys = [self._read(label, root) for label, root in self._mount_points()]
        return sorted(keys, key=lambda k: k["label"])

    def _mount_points(self) -> list[tuple[str, str]]:
        found = []
        if os.path.isdir(config.FAKE_USB_DIR):
            for name in os.listdir(config.FAKE_USB_DIR):
                path = os.path.join(config.FAKE_USB_DIR, name)
                if os.path.isdir(path):
                    found.append((name, path))
        if sys.platform == "win32":
            found += self._windows_drives()
        elif sys.platform == "darwin":
            for name in os.listdir("/Volumes"):
                path = os.path.join("/Volumes", name)
                if os.path.realpath(path) != "/":  # skip the system disk
                    found.append((name, path))
        else:
            # Raspberry Pi OS mounts keys on /media/<user>/<label>
            with open("/proc/mounts", encoding="utf-8") as mounts:
                for line in mounts:
                    path = line.split()[1].replace("\040", " ")
                    if path.startswith(("/media/", "/run/media/")):
                        found.append((os.path.basename(path), path))
        return found

    def _windows_drives(self) -> list[tuple[str, str]]:
        import ctypes

        kernel32 = ctypes.windll.kernel32
        kernel32.SetErrorMode(1)  # no "insert a disk" popup on empty card readers
        drives = []
        bitmask = kernel32.GetLogicalDrives()
        for i in range(26):
            root = f"{chr(65 + i)}:\\"
            if not bitmask & (1 << i) or kernel32.GetDriveTypeW(root) != 2:  # 2 = removable
                continue
            label = ctypes.create_unicode_buffer(261)
            if kernel32.GetVolumeInformationW(root, label, 261, None, None, None, None, 0):
                drives.append((label.value or root[:2], root))
        return drives

    def _read(self, label: str, root: str) -> dict:
        files = []
        try:
            names = sorted(os.listdir(root))
        except OSError:
            names = []
        for name in names:
            path = os.path.join(root, name)
            if not name.lower().endswith(".txt") or name.startswith(".") or not os.path.isfile(path):
                continue
            try:
                with open(path, "rb") as f:
                    content = f.read(config.USB_MAX_FILE_BYTES)
            except OSError:
                continue
            files.append({"nom": name, "contenu": content.decode("utf-8", errors="replace")})
            if len(files) >= config.USB_MAX_FILES:
                break
        return {"label": label, "fichiers": files}
