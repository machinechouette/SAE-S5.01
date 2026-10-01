# 🧩 GDD-TEMPLATE : CYBERDECK
**Document de Conception de Jeu (Game Design Document)**

| Information | Détails |
| :--- | :--- |
| **Groupe / Équipe** | PERITO Maïssane, Tiago, Abdellah, Reda, Apollinaire|
| **Version** | 1.0 - Draft initial |
| **Date de mise à jour** | 30/09/2026 |

---

## 1. VISION & CONCEPT (Le "Pitch")

*       **High Concept (Le Pitch) :** Le seul escape game où tu découvres ce qu'est un cyberdeck..le tout en jouant directement sur l'un d'eux.
*       **Genre :** Escape game narratif en solo, avec des énigmes mˆĺant écran et manipulations d'objets physiques.
*       **Public Cible :** Visiteurs de la JPO, lycéens et étudiants (15-25 ans), intéressés par l'informatique ou souhaitant s'y intéresser. Aucune connaissance technique n'est nécessaire : les énigmes reposent sur la logique, l'observation et la manipulation. Une partie dure de 10 à 20 minutes.
*       **Proposition de Valeur :** Notre jeu est unique car le support est le sujet : le joueur ne joue pas sur un ordinateur classique, mais sur un véritable cyberdeck fabriqué à partir d'objets de récupération (Raspberry Pi, anciens jouets, manettes de Xbox 360 détournés). En le manipulant, il découvre ce qu'est un cyberdeck et les valeurs qu'il porte : réemploi, open source, respect de la vie privée et place des femmes dans la tech.
	Le jeu est aussi pensé pour être regardé : une seule personne joue, mais les spectateurs peuvent l'aider à résoudre les énigmes, ce qui en fait une expérience collective lors des JPO.
	L'experience recherchée : la curiosité face à un objet mystérieux, la satisfaction de le comprendre et de le faire fonctionner, puis une prise de conscience sur l'impact de l'informatique et notre rapport aux technologies actuelles.

---

## 2. LE GAMEPLAY (Les Règles du Jeu)

### 2.1 La Boucle de Gameplay (Core Loop)
* Examiner un module en panne -> Trouver un indice (fragment du journal de la créatrice) -> Résoudre l'énigme (à l'écran et/ou physiquement) -> Module réparé -> Un morceau du message se révèle

### 2.2 Mécaniques de Jeu
*   **Actions directes :** 
       * Brancher des câbles sur les bons ports
       * Reproduire une séquence de touches sur une manette Xbox 360 détournée
       * Poser des perles sur une balance connectée
       * Insérer des clés USB et explorer leur contenu
       * Déchiffrer un message codé
       * Saisir un code à 4 ou 6 chiffres
       * Manipuler des cartes physiques
*   **Systèmes de jeu :** 
       * **Chrono :** une « mise à jour forcée » est en cours de téléchargement. Le joueur a 20 minutespour réparer le deck avant qu'elle ne s'installe et n'efface tout. Le chrono est affiché en permanence sous forme de barre de progression.
       * **Indices :** à chaque énigme, le joueur peut demander un indice léger, puis un indice plus précis. Si vraiment il bloque, il peut obtenir la réponse, mais seulement **2 fois par partie**.
       * **Pas de score :** l'objectif est l'expérience et la découverte, pas la compétition.

### 2.3 Structure & Progression
*       **Le Flow :** linéaire. Les modules se réparent dans un ordre fixe, et chacun débloque l'accès au suivant. C'est plus simple à développer, et plus lisible pour un public de 11 ans et plus comme pour les spectateurs.
*       **Difficulté :** croissante. Les premiers modules sont guidés et rapides (schéma à suivre, mémoire), les derniers demandent de combiner plusieurs indices (déchiffrement, reconstitution du code).
*       **Condition de victoire :** 
       *       **Victoire :** les cinq modules sont réparés avant la fin du chrono. Le deck redémarre entièrement à partir du mot de passe obtenu et affiche le message complet de la créatrice.
       *       **Défaite :** Le chrono se termine, la mise à jour forcée s'installe et le deck est « effacé ». Pour garder la dimension pédagogique, un écran de fin explique quand même ce que le joueur aurait découvert.
	
| # | Module | Énigme | Nos idées | Interaction | Valeur abordée |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Contrôles** | Les commandes sont verrouillées dans un « coffre » numérique. Le deck affiche une séquence de couleurs que le joueur doit reproduire sur la manette Xbox, avec une séquence de plus en plus longue. | Débloquer le coffre + jeu de mémoire | Manette Xbox | Détourner des objets plutôt que racheter |
| 2 | **Capteurs** | Une série de couleurs associées à des nombres permet de calculer le poids exact à atteindre. Le joueur pose les bonnes perles sur la balance connectée à l'ESP32. | Trouver le bon poids + couleurs et calcul | Balance (ESP32) | Comprendre et maîtriser son matériel |
| 3 | **Données** |Plusieurs clés USB sont disponibles, une seule contient le fichier de la créatrice. Ce fichier est un message codé, qui une fois déchiffré indique où trouver les cartes de l'étape suivante. | Clés USB + message codé | Physique + écran | Vie privée, protection des données|
| 4 | **Système (final)** |Des cartes représentant les composants d'un ordinateur (processeur, RAM, stockage…) portent chacune un fragment d'indice. En les réassemblant et en retrouvant les nombres cachés dans la pièce, le joueur obtient le code à 6 chiffres qui stoppe la mise à jour forcée.	| Jeu de cartes + trouver le code | Cartes + saisie à l'écran | Open source, garder le contrôle de ses technologies |

---

## 3. SCÉNARIO & THÉMATIQUE (L'Univers)

### 3.1 L'Intrigue & l'Univers
**Ambiance :** rétro-futuriste et bricolée, à l'image du deck lui-même. Interface façon terminal, couleurs néon sur fond sombre, et un objet physique fait de jouets, de câbles et de manettes de récupération.
**L'histoire :**
Lucyna « Lucy » Kushinada est une créatrice de cyberdecks. Elle a construit un deck unique, fait entièrement d'objets récupérés, avec un but : **libérer les utilisateurs du contrôle des appareils fermés** (mises à jour imposées, données collectées, obsolescence programmée).
Elle a découvert qu'**Arasaka**, une méga-corporation qui ne vit que pour ses profits et ses actionnaires, voulait s'emparer de sa création pour la transformer en produit fermé, vendu en série et remplacé chaque année. Avant de disparaître, Lucy a démonté son deck en cinq modules et en a caché les accès, pour que seule une personne curieuse et patiente puisse le réparer. Elle a protégé le dernier module par un mot de passe : le nom de la pionnière de l'informatique qui l'a inspirée, **Grace Murray Hopper**.
Le joueur incarne **Hedy**, qui retrouve ce deck abandonné. Dès qu'il s'allume, une mise à jour forcée d'Arasaka commence à se télécharger : dans 20 minutes, elle s'installera et effacera tout. Hedy doit réparer le deck module par module. Chaque réparation révèle un fragment du message de Lucy.
**La fin, le choix éthique :**
Une fois le mot de passe saisi, la mise à jour est stoppée. Arasaka propose alors un marché : *« Installez notre mise à jour Premium : votre deck sera plus rapide, plus moderne, et vous n'aurez plus jamais à le réparer. »* Hedy doit choisir :
*   **Accepter :** le deck devient un produit Arasaka. L'écran de fin montre les conséquences : données revendues, réparation impossible, appareil programmé pour être remplacé.
*   **Refuser :** le deck reste libre. Le message complet de Lucy s'affiche, sous forme de manifeste pour une tech réparable, ouverte et respectueuse de la vie privée.
Dans les deux cas, la partie se termine par l'écran **« Qui était la vraie Grace Hopper ? »**, puis une courte explication de ce qu'est un vrai cyberdeck.


### 3.2 Intégration des Enjeux (Éthique / Durable)
Les enjeux éthiques et durables sont au cœur de l'expérience, à trois niveaux :

	1. **Le support :** le cyberdeck est lui-même un acte de réemploi. Il est construit à partir d'un Raspberry Pi 3, d'anciens jouets et de manettes Xbox 360 détournées. Le joueur manipule la preuve que le matériel « obsolète » peut revivre.
	2. **Les mécaniques :** chaque module réparé est lié à une valeur du cyberdeck :
| Module | Valeur |
| :--- | :--- |
| Alimentation | Réemploi : prolonger la vie du matériel |
| Contrôles | Détourner des objets plutôt que racheter |
| Capteurs | Comprendre et maîtriser son matériel |
| Données | Vie privée et protection des données |
| Système | Open source et contrôle de ses technologies |
	3. **Le dénouement :** le choix éthique final oblige le joueur à se positionner lui-même entre confort et liberté. Le sujet n'est pas simplement expliqué : le joueur le vit et en assume les conséquences.
Le jeu met aussi en avant **la place des femmes dans l'informatique** : les personnages de Lucy et de Hedy, le mot de passe final qui rend hommage à Grace Hopper, et l'écran qui présente la vraie pionnière. Il s'inscrit ainsi dans les problématiques de la ressource R5.A.13 *Économie durable et numérique* : obsolescence programmée, impact environnemental de la production en série et sobriété numérique.

---

## 4. SPÉCIFICATIONS TECHNIQUES (L'Ingénierie)
 
### 4.1 Stack Technologique
 
*   **Software :**
    *   **Système :** Raspberry Pi OS Lite (Linux, logiciel libre). L'interface est affichée en plein écran dans Chromium en mode kiosque.
    *   **Frontend :** application web (HTML / CSS / JavaScript, framework léger à trancher en groupe : Vue.js ou React). Ce choix permet de lire la manette Xbox 360 directement via l'API Gamepad du navigateur, et de réaliser facilement le style rétro-terminal.
    *   **Backend :** Python (FastAPI) ou Node.js (Express) [à trancher en groupe]. Il expose une **API REST** (actions du joueur, indices, mot de passe) et un canal **WebSocket** pour pousser en temps réel vers l'écran les événements physiques et le chrono.
    *   **Message Broker :** **Mosquitto (MQTT)**, installé sur le Raspberry Pi. Il assure la communication entre l'ESP32 et le backend.
    *   **Base de données :** **SQLite**. Elle stocke les modules et leurs solutions, les indices (léger / précis / réponse), les textes du scénario (fragments du message, fins), l'état de la partie en cours et l'historique des parties. SQLite est adaptée aux ressources limitées du Raspberry Pi 3 et ne nécessite pas de serveur séparé.
    *   **Firmware ESP32 :** C++ (Arduino / PlatformIO), avec la bibliothèque PubSubClient pour MQTT et HX711 pour la balance.
    *   **Gestion de projet et qualité :** dépôt GitHub (README, branches par fonctionnalité, revues de code), tests unitaires du moteur de jeu, tickets par sprint.
*   **Hardware / IoT :**
| Composant | Rôle | Module concerné |
| :--- | :--- | :--- |
| Raspberry Pi 3 (récupéré) | Cerveau du cyberdeck : frontend, backend, broker, base de données | Tous |
| Boîtier fait de jouets détournés | Habillage du cyberdeck | Tous |
| Écran [taille et type à préciser] | Affichage du jeu | Tous |
| Clavier [à préciser] | Saisie du mot de passe final et des réponses | 4, 5 |
| ESP32 (prêté) | Lecture des capteurs et des entrées physiques | 1, 3 |
| Câbles et connecteurs reliés aux broches GPIO de l'ESP32 | Détection des branchements | 1 - Alimentation |
| Manette Xbox 360 filaire (USB, branchée au Pi) | Saisie de la séquence de couleurs (A vert, B rouge, X bleu, Y jaune) | 2 - Contrôles |
| Cellule de charge + module HX711 | Balance connectée | 3 - Capteurs |
| Perles de couleurs | Poids à placer sur la balance | 3 - Capteurs |
| Clés USB (une seule contient le fichier) | Lues par le Raspberry Pi | 4 - Données |
| Cartes imprimées (composants d'un ordinateur) | Support de l'énigme, sans électronique | 5 - Système |
| LED / buzzer | Retours lumineux et sonores | Tous |
| Alimentation | Pi + ESP32 | - |
 
*   **Mode de connexion :** l'ESP32 communique avec le Raspberry Pi en **Wi-Fi via MQTT**. Le Raspberry Pi crée son propre point d'accès Wi-Fi, pour ne pas dépendre du réseau de la salle. Une liaison série USB est prévue en solution de secours.
### 4.2 Architecture du Système
 
```
                     ┌──────────────────── RASPBERRY PI 3 (cyberdeck) ────────────────────┐
                     │                                                                     │
 [Câbles - Module 1] │                                                                     │
 [Balance - Module 3]│                                                                     │
 [LED / buzzer]      │                                                                     │
        │            │                                                                     │
    [ ESP32 ] ── Wi-Fi / MQTT ──► [ Broker Mosquitto ] ◄──► [ Backend : moteur de jeu ] ◄──► [ SQLite ]
                     │                                            │        ▲               │
                     │                                 REST + WebSocket   │ détection     │
                     │                                            ▼        │ clés USB      │
 [Manette Xbox 360] ─┼── USB ──► [ Frontend web (Chromium kiosque) ]   [Clés USB - Module 4]
 [Clavier]          ─┘                                                                     │
                     └─────────────────────────────────────────────────────────────────────┘
```
 
*   **Communication par événements (MQTT) :** l'ESP32 publie des messages sur des topics dédiés, par exemple :
    *   `cyberdeck/module1/cables` : état des branchements
    *   `cyberdeck/module3/poids` : poids mesuré par la balance
    *   Le backend publie sur `cyberdeck/feedback` pour piloter les LED et le buzzer.
*   **Moteur de jeu (backend) :** une machine à états gère la progression linéaire de la partie :
    `ACCUEIL → MODULE 1 → MODULE 2 → MODULE 3 → MODULE 4 → MODULE 5 → CHOIX ÉTHIQUE → FIN (libre / fermée / défaite) → ÉCRAN GRACE HOPPER`
    À chaque événement, il vérifie la solution en base, met à jour l'état (modules réparés, chrono, indices et réponses utilisés) et notifie le frontend.
*   **Architecture distribuée :** le système repose sur deux nœuds physiques distincts (ESP32 et Raspberry Pi) découplés par un message broker. Les composants logiciels (frontend, backend, broker, base de données) sont indépendants et communiquent uniquement par API ou par messages, ce qui permettrait de déplacer le backend sur un serveur séparé sans modifier les autres composants.
*   **Fonctionnement hors ligne :** le jeu fonctionne entièrement en réseau local, sans dépendance à Internet.
### 4.3 Interface & Expérience Utilisateur (UI/UX)
 
*   **Interface :**
    *   **Écran d'accueil :** briefing de l'histoire (Hedy découvre le deck abandonné), bouton de lancement.
    *   **Écran principal :** barre de progression de la mise à jour forcée (le chrono), état des 5 modules (en panne / réparé), fragments du message de la créatrice déjà révélés.
    *   **Écran de module :** consigne de l'énigme en cours et zone d'interaction (séquence de couleurs, poids mesuré en direct, explorateur des clés USB, saisie).
    *   **Écran d'indices :** indice léger, puis indice précis, puis réponse, avec un compteur des réponses restantes (2 par partie).
    *   **Écrans de feedback :** succès, erreur, module réparé.
    *   **Écran du mot de passe final.**
    *   **Écran du choix éthique :** accepter ou refuser la mise à jour.
    *   **Écrans de fin :** fin « deck libre », fin « deck fermé », fin « défaite ».
    *   **Écran « Qui était la vraie Grace Hopper ? »**, puis explication de ce qu'est un vrai cyberdeck.
    *   **Écran administrateur (caché) :** remise à zéro de la partie entre deux joueurs, calibration de la balance.
    *   **Style :** rétro-terminal, couleurs néon sur fond sombre, texte large et lisible de loin pour que les spectateurs puissent suivre et aider.
*   **Interaction Physique :**
| Module | Action du joueur | Retour immédiat |
| :--- | :--- | :--- |
| 1 - Alimentation | Brancher les câbles selon le schéma | LED par port, écran qui s'allume au bon branchement |
| 2 - Contrôles | Reproduire la séquence sur la manette Xbox | Couleur affichée et son à chaque touche |
| 3 - Capteurs | Poser des perles sur la balance | Poids affiché en direct à l'écran |
| 4 - Données | Insérer les clés USB une par une | Contenu de la clé affiché à l'écran |
| 5 - Système | Réassembler les cartes et saisir le mot de passe | Message de validation, arrêt de la mise à jour |
 
---
 
## 5. PLAN DE PRODUCTION (La Roadmap)
 
### 5.1 Liste des Fonctionnalités (Feature List)
 
*   **Must-Have (Critique) - MVP, Jalon 2 :**
    *   Cyberdeck fonctionnel : Raspberry Pi + écran + clavier, interface en mode kiosque.
    *   Moteur de jeu : machine à états, enchaînement linéaire des modules, chrono de 20 minutes.
    *   Communication ESP32 ↔ Raspberry Pi via MQTT.
    *   Base de données SQLite (modules, solutions, textes).
    *   **Une « vertical slice » complète :** écran d'accueil → un module physique entièrement jouable traversant tout le stack (capteur → ESP32 → MQTT → backend → base de données → écran) → écran de fin victoire / défaite. Module conseillé : le module 1 (câbles).
    *   Stabilité de base : une partie complète sans plantage.
*   **Should-Have (Important) - Beta, Jalon 3 :**
    *   Les 5 modules jouables.
    *   Système d'indices à 3 niveaux, avec 2 réponses maximum par partie.
    *   Mot de passe final et choix éthique avec les trois fins.
    *   Écran « Qui était la vraie Grace Hopper ? » et explication du cyberdeck.
    *   Textes du scénario et fragments du message intégrés.
    *   Retours lumineux et sonores (LED, buzzer).
    *   Écran administrateur : remise à zéro entre deux parties, calibration de la balance.
    *   Boîtier assemblé à partir des jouets récupérés.
*   **Nice-to-Have (Bonus) - JPO, Jalon 4 :**
    *   Boîtier soigné et décoré.
    *   Écran miroir pour les spectateurs.
    *   Ambiance sonore.
    *   Statistiques de parties (temps moyen, taux de réussite, proportion de joueurs qui acceptent ou refusent la mise à jour).
    *   Mode de secours « software-only » : chaque énigme physique a un équivalent à l'écran.
### 5.2 Jalons de Validation (Milestones)
 
| Jalon | Date | Objectif | Livrable |
| :--- | :--- | :--- | :--- |
| Jalon 1 - Conception | Fin septembre | Valider la faisabilité technique et le scénario | Ce GDD |
| *Étape interne - Prototype technique* | *Mi-octobre* | *Valider la chaîne ESP32 → MQTT → backend → écran* | *Un capteur qui déclenche un affichage* |
| Jalon 2 - Prototype | Mi-novembre | Valider la boucle de gameplay principale | MVP (vertical slice) |
| Jalon 3 - Beta | Mi-janvier | Valider l'UX et la stabilité | Version intégrée (5 modules) et rapport d'équipe |
| Jalon 4 - JPO | Mi-février | Livrer le produit fini et le démontrer en public | Produit final et exposition |
| Soutenance | Semaine 16 | Présenter le projet | Soutenance |
 
### 5.3 Répartition des Rôles (Garants de domaine)
 
| Domaine | Garant(e) | Backup(s) |
| :--- | :--- | :--- |
| Frontend | Tiago | Maïssane |
| Backend | Abdellah | Reda |
| Base de données | Apollinaire | Reda [à confirmer] |
| IoT / Capteurs | Maïssane | Tiago |
| Architecture distribuée (API / Message Broker) | Reda [à confirmer] | Tiago [à confirmer] |
| Tests / Qualité | Tiago | Maïssane |
| Documentation | Maïssane | Tiago [à confirmer] |
| Gestion de projet / Agile | Maïssane | Apollinaire |
 
---
 
## 6. ANALYSE DES RISQUES
 
| Risque identifié | Impact (H/M/L) | Stratégie d'atténuation |
| :--- | :--- | :--- |
| Instabilité du hardware (ESP32, capteurs, Raspberry Pi 3 ancien) | H | Tester le matériel dès le prototype technique, prévoir du matériel de rechange et le mode « software-only ». |
| Performances limitées du Raspberry Pi 3 (1 Go de RAM) avec navigateur + backend + broker + base de données | M | Frontend léger, build de production, SQLite, mesures de charge dès le MVP. Si besoin, déplacer le backend sur un serveur séparé (rendu possible par l'architecture distribuée). |
| Balance imprécise : les perles sont très légères | M | Marge de tolérance, calibration avant chaque session, ou remplacement des perles par des objets plus lourds. |
| Détection des câbles peu fiable (faux contacts) | M | Connecteurs à verrouillage, test de continuité répété, validation après une courte stabilisation. |
| Wi-Fi instable en salle d'exposition | M | Raspberry Pi en point d'accès Wi-Fi dédié, liaison série USB en secours. |
| Garant de l'architecture distribuée non confirmé (contrainte obligatoire) | M | Désigner le garant et le backup dès le début du premier sprint. |
| Trop d'énigmes à développer pour le temps disponible | M | MVP limité à un module complet ; les autres modules sont ajoutés un par sprint, par ordre de priorité. |
| Énigmes trop difficiles ou trop faciles pour des lycéens et étudiants (15-25 ans) | M | Tests avec des personnes extérieures à chaque sprint ; durée du chrono et textes des indices paramétrables en base de données. |
| Perte ou mélange du matériel physique entre deux parties en JPO (clés USB, cartes, perles) | M | Check-list et écran administrateur de remise à zéro entre chaque partie, matériel en double. |
| Utilisation de références à une licence existante (univers Cyberpunk : Lucy Kushinada, Arasaka) lors d'une exposition publique | L | Projet non commercial présenté comme un hommage ; aucun visuel, logo ou musique officiels réutilisés ; noms de remplacement prêts si les référents le demandent. |
| Répartition inégale du travail ou manque de coordination | M | Rôles de garants clairs, rituels agiles (daily, revue de sprint), suivi sur GitHub et Discord. |
| Retard sur le boîtier (récupération, assemblage) | L | Commencer par un boîtier simple, l'améliorer pour la JPO. |
| Matériel de récupération manquant (ex. manette Xbox 360) | L | Alternative : autre manette USB ou boutons de couleur branchés sur l'ESP32. |
 
