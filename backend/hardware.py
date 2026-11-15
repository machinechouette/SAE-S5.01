"""Physical inputs: MQTT link with the ESP32 and USB key detection.

TODO (MQTT, with the distributed architecture owner):
- connect to Mosquitto, reconnect automatically
- subscribe to config.TOPIC_WEIGHT and call game.on_weight(grams, stable)
- publish on config.TOPIC_FEEDBACK to drive the LEDs and the buzzer
- paho runs in its own thread: hand events back to the asyncio loop

TODO (USB, module 3):
- detect key insertion / removal (pyudev), read-only, .txt files only
- identify the right key by its volume label, never by the port
"""
import json
import asyncio
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
    def start(self) -> None:
        raise NotImplementedError

    def files(self, label: str) -> list[str]:
        raise NotImplementedError
