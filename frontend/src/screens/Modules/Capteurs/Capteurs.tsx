import { useState } from "react";
import Button from "../../../components/ui/Button/Button";
import Panneau from "../../../components/ui/Panneau/Panneau";
import Prompt from "../../../components/ui/Prompt/Prompt";
import BarreStatut from "../../../components/game/BarreStatut/BarreStatut";
import type { GameState, Indice, Poids } from "../../../types/game";
import styles from "./Capteurs.module.css";

type Props = {
  state: GameState;
  poids: Poids | null;
  onIndice: () => Promise<Indice>;
};

export default function Capteurs({ state, poids, onIndice }: Props) {
  const [indice, setIndice] = useState<Indice | null>(null);
  const [plusDeReponse, setPlusDeReponse] = useState(false);

  async function demanderIndice() {
    try {
      setIndice(await onIndice());
      setPlusDeReponse(false);
    } catch {
      setPlusDeReponse(true); // le backend refuse quand les 2 réponses sont utilisées
    }
  }

  return (
    <div className={styles.module}>
      <div className={styles.panneaux}>
        <Panneau titre="BALANCE" className={styles.balance}>
          <Prompt message="pose les perles sur la balance" />
          <div className={styles.poids}>{poids ? poids.grams.toFixed(1) : "--.-"} g</div>
          <p className={poids?.stable ? styles.stable : styles.instable}>
            {poids?.stable ? "mesure stable" : "mesure en cours..."}
          </p>
        </Panneau>

        <Panneau titre="JOURNAL DE LUCY" couleur="cyan" className={styles.journal}>
          {/* TODO : la série couleurs → nombres, à définir avec l'équipe */}
          <p className={styles.secondaire}>[indice couleurs / nombres à venir]</p>
          {indice && <p>indice {indice.level} : {indice.text}</p>}
          {plusDeReponse && <p className={styles.erreur}>plus aucune réponse disponible</p>}
        </Panneau>
      </div>

      <div>
        <Button couleur="jaune" onClick={demanderIndice}>INDICE</Button>
      </div>

      <BarreStatut state={state} />
    </div>
  );
}
