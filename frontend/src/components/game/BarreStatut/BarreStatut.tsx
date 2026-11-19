import type { GameState } from "../../../types/game";
import { formatTemps } from "../../../utils/temps";
import styles from "./BarreStatut.module.css";

type Props = { state: GameState };

export default function BarreStatut({ state }: Props) {
  return (
    <div className={styles.barre}>
      <span>réponses : {state.answers_left} / 2</span>
      <span>▲ MAJ ARASAKA {formatTemps(state.remaining_s)}</span>
    </div>
  );
}
