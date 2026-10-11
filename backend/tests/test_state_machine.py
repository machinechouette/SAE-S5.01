"""Tests unitaires du moteur de jeu.

TODO :
- une partie démarre en ACCUEIL puis passe en MODULE_1
- les modules s'enchaînent dans l'ordre, impossible d'en sauter un
- fin du chrono -> FIN_DEFAITE, quel que soit le module en cours
- choix éthique : accepter -> FIN_FERMEE, refuser -> FIN_LIBRE
- pas plus de 2 réponses par partie
- la remise à zéro ramène en ACCUEIL
"""

from app.engine.state_machine import MoteurDeJeu
from app.engine.states import Etat


def test_partie_commence_a_l_accueil():
    assert MoteurDeJeu().etat == Etat.ACCUEIL
