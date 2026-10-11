"""Système d'indices à 3 niveaux (GDD 2.2).

TODO :
- par module : indice léger, puis indice précis, puis réponse
- la réponse n'est disponible que 2 fois par partie
- les textes des indices viennent de la base
- garder le compte des indices et réponses utilisés dans l'état de la partie
"""


class GestionnaireIndices:
    def indice_suivant(self, numero_module: int) -> dict:
        # TODO : renvoyer le niveau, le texte et le nombre de réponses restantes
        raise NotImplementedError

    def reponses_restantes(self) -> int:
        raise NotImplementedError
