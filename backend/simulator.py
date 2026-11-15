"""Arduino MKR WiFi 1010 simulator: test the whole game without the hardware.

Publishes on MQTT what the board will publish (scale, button, joystick) and prints
the feedback sent back by the backend (LEDs, LED bar).

Run (with Mosquitto and the backend started): python simulator.py

Commands:
  p <grams>    put a weight on the scale (e.g. p 12), streamed every 0.5 s like the real scale
  p <grams> i  same weight but unstable (the scale is still moving)
  ok           put the target weight of module 2 (config.TARGET_WEIGHT_G)
  v            empty the scale (0 g)
  b            press the push button
  j <dir>      move the joystick: haut, bas, gauche, droite
  q            quit

TODO: agree with Reda on the button / joystick topics and payloads (proposal below).
"""

import json
import threading
import time

import paho.mqtt.client as mqtt

import config

TOPIC_BUTTON = "cyberdeck/bouton"  # {"appui": true}
TOPIC_JOYSTICK = "cyberdeck/joystick"  # {"direction": "haut" | "bas" | "gauche" | "droite"}
DIRECTIONS = ("haut", "bas", "gauche", "droite")
STREAM_PERIOD_S = 0.5

scale = {"grams": 0.0, "stable": True}


def on_connect(client, userdata, flags, reason_code, properties):
    if reason_code.is_failure:
        print(f"[mqtt] connexion refusée : {reason_code}")
        return
    print(f"[mqtt] connecté à {config.MQTT_HOST}:{config.MQTT_PORT}")
    client.subscribe(config.TOPIC_FEEDBACK)


def on_message(client, userdata, msg):
    # Stands for the LEDs and the LED bar of the board
    try:
        data = json.loads(msg.payload)
        action = data.get("action")
    except (ValueError, AttributeError):
        print(f"\n[leds] message inconnu : {msg.payload!r}\n> ", end="", flush=True)
        return
    if action == "succes":
        text = "LED verte ON (module réparé)"
    elif action == "defaite":
        text = "LED rouge ON (défaite)"
    elif action == "jauge":
        n = data.get("valeur", 0)
        text = f"jauge [{'#' * n}{'.' * (5 - n)}] {n}/5"
    else:
        text = str(data)
    print(f"\n[leds] {text}\n> ", end="", flush=True)


def stream_scale(client: mqtt.Client, stop: threading.Event):
    # The real scale (HX711) sends its reading continuously, not only when it changes
    while not stop.is_set():
        payload = {"poids": scale["grams"], "stable": scale["stable"]}
        client.publish(config.TOPIC_WEIGHT, json.dumps(payload))
        stop.wait(STREAM_PERIOD_S)


def handle(command: str, client: mqtt.Client) -> bool:
    """Runs one command, returns False to quit."""
    parts = command.split()
    if not parts:
        return True
    name, args = parts[0].lower(), parts[1:]

    if name == "q":
        return False
    if name == "p" and args:
        try:
            scale["grams"] = float(args[0].replace(",", "."))
        except ValueError:
            print("poids invalide, ex : p 12.5")
            return True
        scale["stable"] = not (len(args) > 1 and args[1] == "i")
        print(f"balance : {scale['grams']} g ({'stable' if scale['stable'] else 'instable'})")
    elif name == "ok":
        scale["grams"], scale["stable"] = config.TARGET_WEIGHT_G, True
        print(f"balance : {scale['grams']} g (poids cible), à tenir {config.STABLE_SECONDS} s")
    elif name == "v":
        scale["grams"], scale["stable"] = 0.0, True
        print("balance : vide")
    elif name == "b":
        client.publish(TOPIC_BUTTON, json.dumps({"appui": True}))
        print("bouton : appui")
    elif name == "j" and args and args[0] in DIRECTIONS:
        client.publish(TOPIC_JOYSTICK, json.dumps({"direction": args[0]}))
        print(f"joystick : {args[0]}")
    else:
        print(__doc__.split("Commands:")[1].split("TODO")[0].rstrip())
    return True


def main():
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, "SimulateurArduino")
    client.on_connect = on_connect
    client.on_message = on_message
    try:
        client.connect(config.MQTT_HOST, config.MQTT_PORT, 60)
    except OSError as e:
        print(f"Impossible de joindre Mosquitto sur {config.MQTT_HOST}:{config.MQTT_PORT} ({e})")
        print("Lance d'abord le broker, ex : mosquitto -v")
        return
    client.loop_start()

    stop = threading.Event()
    threading.Thread(target=stream_scale, args=(client, stop), daemon=True).start()

    print("Simulateur Arduino prêt. Tape une commande (h pour l'aide).")
    try:
        while True:
            try:
                command = input("> ")
            except EOFError:
                break
            if not handle(command, client):
                break
    except KeyboardInterrupt:
        pass
    finally:
        stop.set()
        time.sleep(0.1)
        client.loop_stop()
        client.disconnect()
        print("Simulateur arrêté.")


if __name__ == "__main__":
    main()
