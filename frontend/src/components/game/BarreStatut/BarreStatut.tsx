import type { GameState } from "../../../types/game";
import { formatTemps } from "../../../utils/temps";
import styles from "./BarreStatut.module.css";

type Props = { state: GameState };

export default function BarreStatut({ state }: Props) {
  return (
    <div className={styles.barre}>
      <span>réponses : {state.answers_left} / 2</span>
      <span className={state.remaining_s < 120 ? styles.urgent : ""}>
        ▲ MAJ ARASAKA {formatTemps(state.remaining_s)}
      </span>
    </div>
  );
}
