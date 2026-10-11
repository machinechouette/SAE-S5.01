"""Accès à la base SQLite, vu depuis le backend.

Le schéma est à définir avec le garant base de données ; ce fichier ne fixe que
ce dont le moteur de jeu a besoin.

TODO :
- lire la solution d'un module
- lire les indices d'un module (léger / précis / réponse)
- lire les textes du scénario (fragments du message, fins)
- sauvegarder et relire l'état de la partie en cours
- enregistrer la partie terminée dans l'historique
"""


class Depot:
    def solution_module(self, numero_module: int) -> dict:
        raise NotImplementedError

    def indices_module(self, numero_module: int) -> list[str]:
        raise NotImplementedError

    def texte(self, cle: str) -> str:
        raise NotImplementedError

    def sauvegarder_partie(self, etat_partie: dict) -> None:
        raise NotImplementedError

    def charger_partie(self) -> dict | None:
        raise NotImplementedError

    def archiver_partie(self, etat_partie: dict) -> None:
        raise NotImplementedError
