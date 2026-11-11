import Button from "../../components/ui/Button/Button";
import Panneau from "../../components/ui/Panneau/Panneau";
import type { EtatModule, GameState } from "../../types/game";
import styles from "./Hub.module.css";

const NOMS = {
  "1": "contrôles",
  "2": "capteurs",
  "3": "données",
  "4": "système",
  "5": "à définir",
} as const;

const LIBELLES: Record<EtatModule, string> = {
  repaired: "réparé",
  active: "en cours",
  locked: "en panne",
};

function formatTemps(secondes: number) {
  const s = Math.ceil(secondes);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

type Props = {
  state: GameState;
  onOuvrirModule: () => void;
};

export default function Hub({ state, onOuvrirModule }: Props) {
  const numeros = Object.keys(NOMS) as (keyof typeof NOMS)[];
  const nbRepares = numeros.filter((n) => state.modules[n] === "repaired").length;

  return (
    <div className={styles.hub}>
      <div className={styles.panneaux}>
        <Panneau titre="MODULES" className={styles.modules}>
          {numeros.map((n) => {
            const etat = state.modules[n];
            return (
              <div key={n} className={`${styles.ligne} ${styles[etat]}`}>
                <span className={styles.etat}>{n.padStart(2, "0")}</span>
                <span>{NOMS[n]}</span>
                <span className={styles.etat}>{LIBELLES[etat]}</span>
              </div>
            );
          })}
        </Panneau>

        <Panneau titre="MESSAGE DE LUCY" couleur="cyan" className={styles.message}>
          <p className={styles.secondaire}>{nbRepares} fragment(s) sur 5</p>
        </Panneau>
      </div>

      <div className={styles.action}>
        <Button onClick={onOuvrirModule}>OUVRIR LE MODULE</Button>
      </div>

      <div className={styles.barre}>
        <span>réponses : {state.answers_left} / 2</span>
        <span>▲ MAJ ARASAKA {formatTemps(state.remaining_s)}</span>
      </div>
    </div>
  );
}