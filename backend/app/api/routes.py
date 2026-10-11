"""API REST appelée par le frontend (actions du joueur, indices, mot de passe).

TODO :
- définir les schémas Pydantic des requêtes / réponses
- se mettre d'accord avec le frontend sur le contrat de l'API
- chaque route délègue au moteur de jeu, aucune règle du jeu ici
"""

from fastapi import APIRouter

router = APIRouter(prefix="/api")


@router.post("/partie")
def demarrer_partie():
    # TODO : créer une partie, lancer le chrono, passer de ACCUEIL à MODULE_1
    raise NotImplementedError


@router.get("/partie")
def etat_partie():
    # TODO : renvoyer l'état courant (état, modules réparés, fragments du message,
    # indices de mot de passe obtenus, temps restant, réponses restantes)
    raise NotImplementedError


@router.post("/modules/{numero}/action")
def action_module(numero: int):
    # TODO : recevoir une action du joueur (séquence de la manette pour le module 1,
    # texte déchiffré pour le module 3) et la faire valider par le moteur
    raise NotImplementedError


@router.post("/modules/{numero}/indice")
def demander_indice(numero: int):
    # TODO : renvoyer l'indice suivant (léger -> précis -> réponse, 2 réponses max par partie)
    raise NotImplementedError


@router.post("/mot-de-passe")
def saisir_mot_de_passe():
    # TODO : vérifier le mot de passe final (module 4), stopper le chrono, passer à CHOIX_ETHIQUE
    raise NotImplementedError


@router.post("/choix")
def choix_ethique():
    # TODO : accepter -> FIN_FERMEE, refuser -> FIN_LIBRE
    raise NotImplementedError


@router.post("/admin/reset")
def remise_a_zero():
    # TODO : remettre la partie à zéro entre deux joueurs (écran administrateur caché)
    raise NotImplementedError


@router.post("/admin/calibration")
def calibrer_balance():
    # TODO : demander la tare / calibration de la balance à l'ESP32 via MQTT
    raise NotImplementedError
