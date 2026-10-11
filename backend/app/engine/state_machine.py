"""Machine à états du jeu : cœur du backend.

À chaque événement (action REST, message MQTT, clé USB, fin du chrono), elle vérifie la
solution, met à jour l'état de la partie et renvoie ce qu'il faut notifier au frontend.

TODO :
- définir la table des transitions autorisées et refuser les autres
- garder l'état de la partie : modules réparés, fragments du message révélés,
  indices de mot de passe obtenus, indices et réponses utilisés
- fin du chrono dans n'importe quel module -> FIN_DEFAITE
- après chaque fin -> GRACE_HOPPER
- sauvegarder l'état en base pour pouvoir reprendre après un redémarrage du backend
- rester indépendant de FastAPI et de MQTT pour être testable unitairement
"""

from app.engine.states import Etat


class MoteurDeJeu:
    def __init__(self) -> None:
        self.etat = Etat.ACCUEIL

    def demarrer(self) -> None:
        # TODO : ACCUEIL -> MODULE_1 et lancement du chrono
        raise NotImplementedError

    def traiter_evenement(self, evenement: dict) -> dict:
        # TODO : valider l'événement selon le module en cours (voir modules.py)
        # et renvoyer le résultat (succès / erreur, fragment révélé, indice de mot de passe)
        raise NotImplementedError

    def module_repare(self) -> None:
        # TODO : passer au module suivant
        raise NotImplementedError

    def temps_ecoule(self) -> None:
        # TODO : passer en FIN_DEFAITE
        raise NotImplementedError

    def choisir(self, accepter: bool) -> None:
        # TODO : CHOIX_ETHIQUE -> FIN_FERMEE (accepter) ou FIN_LIBRE (refuser)
        raise NotImplementedError

    def reinitialiser(self) -> None:
        # TODO : retour à ACCUEIL, état de la partie vidé (écran administrateur)
        raise NotImplementedError
