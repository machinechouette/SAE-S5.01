"""Client MQTT : lien entre l'ESP32 et le backend, via le broker Mosquitto.

TODO :
- se connecter au broker et se reconnecter automatiquement en cas de coupure
- s'abonner à TOPIC_POIDS et transmettre chaque mesure au moteur de jeu et au frontend
- publier sur TOPIC_FEEDBACK pour piloter les LED et le buzzer (succès, erreur, module réparé)
- définir le format des messages avec l'IoT et l'architecture distribuée
- le client paho tourne dans son propre thread : repasser proprement dans la boucle asyncio
- prévoir la liaison série USB de secours derrière la même interface
"""


class ClientMQTT:
    def connecter(self) -> None:
        raise NotImplementedError

    def deconnecter(self) -> None:
        raise NotImplementedError

    def publier_feedback(self, type_feedback: str) -> None:
        raise NotImplementedError

    def _sur_message(self, topic: str, contenu: bytes) -> None:
        # TODO : décoder le message et le transformer en événement pour le moteur de jeu
        raise NotImplementedError
