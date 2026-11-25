import { useEffect, useState, type ReactNode } from "react";
import Mascotte, { type Humeur } from "../components/game/Mascotte/Mascotte";
import Prompt from "../components/ui/Prompt/Prompt";
import { useGame } from "../hooks/useGame";
import type { GameState, Phase } from "../types/game";
import styles from "./Game.module.css";
import Accueil from "./Accueil/Accueil";
import Choix from "./Choix/Choix";
import Defaite from "./Fins/Defaite";
import FinFermee from "./Fins/FinFermee";
import FinLibre from "./Fins/FinLibre";
import Hopper from "./Hopper/Hopper";
import Hub from "./Hub/Hub";
import Capteurs from "./Modules/Capteurs/Capteurs";
import Controles from "./Modules/Controles/Controles";
import Donnees from "./Modules/Donnees/Donnees";
import Systeme from "./Modules/Systeme/Systeme";

// Must match ACTIVE_MODULES in backend/config.py
const MODULES_ACTIFS = 4;
const PANIQUE_SECONDES = 120;
const DUREE_REACTION_MS = 2200;

function humeurDeLaPhase(phase: Phase, restant: number, derniereFin: Humeur): Humeur {
  switch (phase) {
    case "ACCUEIL":
      return "dort";
    case "CHOIX":
      return "inquiet";
    case "FIN_LIBRE":
      return "libre";
    case "FIN_FERMEE":
      return "corrompu";
    case "FIN_DEFAITE":
      return "efface";
    case "HOPPER":
      return derniereFin;
    default:
      return restant < PANIQUE_SECONDES ? "panique" : "neutre";
  }
}

const FINS: Phase[] = ["FIN_LIBRE", "FIN_FERMEE", "FIN_DEFAITE", "HOPPER"];
const FINS_HUMEUR: Partial<Record<Phase, Humeur>> = {
  FIN_LIBRE: "libre",
  FIN_FERMEE: "corrompu",
  FIN_DEFAITE: "efface",
};

export default function GameShell() {
  const {
    state,
    poids,
    usb,
    lancer,
    ouvrirModule,
    reussirControles,
    envoyerMessage,
    envoyerMotDePasse,
    demanderIndice,
    choisir,
    allerHopper,
    rejouer,
  } = useGame();

  // Short reactions of BIT to the player's answers (correct, wrong, hint).
  // The counter restarts the animation when the same reaction happens twice in a row.
  const [reaction, setReaction] = useState<{ humeur: Humeur; n: number } | null>(null);
  const reagir = (humeur: Humeur) => setReaction((r) => ({ humeur, n: (r?.n ?? 0) + 1 }));
  useEffect(() => {
    if (!reaction) return;
    const timer = setTimeout(() => setReaction(null), DUREE_REACTION_MS);
    return () => clearTimeout(timer);
  }, [reaction]);

  // A module was repaired since the last render: BIT jumps for joy
  const repares = state ? Object.values(state.modules).filter((m) => m === "repaired").length : 0;
  const [reparesAvant, setReparesAvant] = useState(repares);
  if (repares !== reparesAvant) {
    setReparesAvant(repares);
    if (repares > reparesAvant) reagir("joie");
  }

  // The Hopper screen keeps the look of the ending that led to it
  const [derniereFin, setDerniereFin] = useState<Humeur>("libre");
  const fin = state && FINS_HUMEUR[state.phase];
  if (fin && fin !== derniereFin) setDerniereFin(fin);

  // Wrong answer = the backend stays on the same module
  const verifier = (envoyer: (valeur: string) => Promise<GameState>) => async (valeur: string) => {
    const avant = state?.phase;
    const nouvelEtat = await envoyer(valeur);
    if (nouvelEtat.phase === avant) reagir("erreur");
    return nouvelEtat;
  };
  const indice = () => {
    reagir("indice");
    return demanderIndice();
  };

  if (!state) return <Prompt message="connexion au deck..." curseur />;

  const humeur =
    reaction && !FINS.includes(state.phase)
      ? reaction.humeur
      : humeurDeLaPhase(state.phase, state.remaining_s, derniereFin);

  return (
    <div className={styles.cadre}>
      <div className={styles.ecran}>
        {ecran(state, {
          poids, usb, lancer, ouvrirModule, reussirControles, choisir, allerHopper, rejouer,
          envoyerMessage: verifier(envoyerMessage),
          envoyerMotDePasse: verifier(envoyerMotDePasse),
          demanderIndice: indice,
          erreurControles: () => reagir("erreur"),
        })}
      </div>
      <Mascotte humeur={humeur} repares={repares} total={MODULES_ACTIFS} phase={state.phase} />
    </div>
  );
}

type Actions = Omit<ReturnType<typeof useGame>, "state" | "envoyerPoids"> & {
  erreurControles: () => void;
};

function ecran(state: GameState, a: Actions): ReactNode {
  const { poids, usb, lancer, ouvrirModule, reussirControles, envoyerMessage, envoyerMotDePasse,
    demanderIndice, choisir, allerHopper, rejouer, erreurControles } = a;

  switch (state.phase) {
    case "ACCUEIL":
      return <Accueil onLancer={lancer} />;
    case "HUB":
      return <Hub state={state} onOuvrirModule={ouvrirModule} />;
    case "MODULE_1":
      return <Controles state={state} onReussi={reussirControles} onErreur={erreurControles} />;
    case "MODULE_2":
      return <Capteurs state={state} poids={poids} onIndice={demanderIndice} />;
    case "MODULE_3":
      return <Donnees state={state} usb={usb} onReponse={envoyerMessage} />;
    case "MODULE_4":
      return <Systeme state={state} onMotDePasse={envoyerMotDePasse} onIndice={demanderIndice} />;
    case "CHOIX":
      return <Choix onChoisir={choisir} />;
    case "FIN_LIBRE":
      return <FinLibre onHopper={allerHopper} />;
    case "FIN_FERMEE":
      return <FinFermee onHopper={allerHopper} />;
    case "FIN_DEFAITE":
      return <Defaite onHopper={allerHopper} />;
    case "HOPPER":
      return <Hopper onRejouer={rejouer} />;
    default:
      return <Prompt message={`${state.phase} : écran à venir`} curseur />;
  }
}
