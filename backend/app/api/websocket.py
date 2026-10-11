"""Canal WebSocket : pousse en temps réel vers l'écran les événements physiques et le chrono.

TODO :
- garder la liste des clients connectés (écran du deck, écran miroir éventuel)
- diffuser : poids mesuré en direct, clé USB insérée / retirée, changement d'état, temps restant
- définir le format des messages avec le frontend (type + données)
- gérer les déconnexions sans faire planter la diffusion
"""

from fastapi import APIRouter, WebSocket

router = APIRouter()


class GestionnaireConnexions:
    async def connecter(self, ws: WebSocket) -> None:
        # TODO : accepter la connexion et envoyer l'état courant de la partie
        raise NotImplementedError

    def deconnecter(self, ws: WebSocket) -> None:
        raise NotImplementedError

    async def diffuser(self, message: dict) -> None:
        # TODO : envoyer le message à tous les clients connectés
        raise NotImplementedError


gestionnaire = GestionnaireConnexions()


@router.websocket("/ws")
async def canal_temps_reel(ws: WebSocket):
    # TODO : connecter le client puis rester à l'écoute jusqu'à sa déconnexion
    raise NotImplementedError
