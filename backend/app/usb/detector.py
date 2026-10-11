"""Détection des clés USB branchées sur le Raspberry Pi (module 3).

TODO :
- détecter l'insertion et le retrait d'une clé (pyudev ou surveillance du point de montage)
- identifier la clé et lister son contenu pour l'explorateur affiché à l'écran
- envoyer l'événement au moteur de jeu et au frontend
- ne jamais exécuter ni écrire quoi que ce soit sur une clé : lecture seule
- prévoir un mode simulé pour développer sans Raspberry Pi
"""


class DetecteurUSB:
    def demarrer(self) -> None:
        raise NotImplementedError

    def arreter(self) -> None:
        raise NotImplementedError

    def contenu_cle(self, identifiant_cle: str) -> list[str]:
        raise NotImplementedError
