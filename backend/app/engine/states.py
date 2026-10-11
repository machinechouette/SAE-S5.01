"""États de la partie (GDD 4.2) : progression linéaire."""

from enum import Enum


class Etat(str, Enum):
    ACCUEIL = "accueil"
    MODULE_1 = "module_1"  # Contrôles : séquence de couleurs sur la manette
    MODULE_2 = "module_2"  # Capteurs : bon poids sur la balance (ESP32)
    MODULE_3 = "module_3"  # Données : clés USB + message codé
    MODULE_4 = "module_4"  # Système : cartes composants + mot de passe final
    CHOIX_ETHIQUE = "choix_ethique"
    FIN_LIBRE = "fin_libre"
    FIN_FERMEE = "fin_fermee"
    FIN_DEFAITE = "fin_defaite"
    GRACE_HOPPER = "grace_hopper"
