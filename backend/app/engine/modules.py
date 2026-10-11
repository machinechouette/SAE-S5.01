"""Validation des énigmes de chaque module (GDD 2.3).

Les solutions sont lues en base, pas écrites en dur ici.
"""


def valider_module_1(sequence: list[str]) -> bool:
    # TODO : comparer la séquence de la manette (A vert, B rouge, X bleu, Y jaune)
    # à la séquence attendue ; gérer la séquence de plus en plus longue.
    # Réparé -> position de 2 cartes, écrite en binaire.
    raise NotImplementedError


def valider_module_2(poids: float) -> bool:
    # TODO : comparer le poids reçu de l'ESP32 au poids attendu, avec une marge de
    # tolérance, et exiger un poids stable quelques instants (balance imprécise, GDD 6).
    # Réparé -> position de 2 cartes, écrite avec le code couleur.
    raise NotImplementedError


def valider_module_3(identifiant_cle: str, message_dechiffre: str) -> bool:
    # TODO : vérifier que la clé insérée est celle de la créatrice, puis que le
    # message a été correctement déchiffré.
    # Réparé -> emplacement des cartes et position des 2 dernières.
    raise NotImplementedError


def valider_module_4(mot_de_passe: str) -> bool:
    # TODO : comparer au mot de passe final, sans tenir compte de la casse ni des espaces
    raise NotImplementedError
