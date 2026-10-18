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


class MqttClient:
    def connect(self) -> None:
        raise NotImplementedError

    def publish_feedback(self, kind: str) -> None:
        raise NotImplementedError


class UsbWatcher:
    def start(self) -> None:
        raise NotImplementedError

    def files(self, label: str) -> list[str]:
        raise NotImplementedError
