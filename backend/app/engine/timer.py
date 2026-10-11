"""Chrono de la « mise à jour forcée » (20 minutes).

TODO :
- démarrer au lancement de la partie, s'arrêter quand le mot de passe est validé
- pousser régulièrement le temps restant au frontend (barre de progression)
- prévenir le moteur de jeu quand le temps est écoulé
- calculer le temps restant à partir de l'heure de départ, pas en décrémentant un compteur
"""


class Chrono:
    def demarrer(self) -> None:
        raise NotImplementedError

    def arreter(self) -> None:
        raise NotImplementedError

    def temps_restant(self) -> float:
        raise NotImplementedError
