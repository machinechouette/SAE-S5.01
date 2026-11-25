import { useEffect, useState } from "react";
import BarreStatut from "../../../components/game/BarreStatut/BarreStatut";
import Panneau from "../../../components/ui/Panneau/Panneau";
import Prompt from "../../../components/ui/Prompt/Prompt";
import { useManette, type Touche } from "../../../hooks/useManette";
import type { GameState } from "../../../types/game";
import { bip } from "../../../utils/son";
import styles from "./Controles.module.css";

const TOUCHES: Touche[] = ["A", "B", "X", "Y"];
const LONGUEUR_DEPART = 3;
const LONGUEUR_FINALE = 8;
const DELAI_DEMO_MS = 700;

const SONS: Record<Touche, number> = { A: 330, B: 392, X: 494, Y: 587 };

type Etape = "demo" | "joueur" | "erreur" | "manche" | "reussi";

const MESSAGES: Record<Etape, string> = {
  demo: "observe la séquence",
  joueur: "reproduis-la sur la manette",
  erreur: "erreur : la séquence recommence",
  manche: "correct",
  reussi: "commandes déverrouillées",
};

function toucheAuHasard(): Touche {
  return TOUCHES[Math.floor(Math.random() * TOUCHES.length)];
}

type Props = {
  state: GameState;
  onReussi?: () => void;
  onErreur?: () => void;
};

export default function Controles({ state, onReussi, onErreur }: Props) {
  const [sequence, setSequence] = useState<Touche[]>(() =>
    Array.from({ length: LONGUEUR_DEPART }, toucheAuHasard)
  );
  const [etape, setEtape] = useState<Etape>("demo");
  const [position, setPosition] = useState(0);
  const [allumee, setAllumee] = useState<Touche | null>(null);

  useEffect(() => {
    if (etape !== "demo") return;
    const timers = sequence.map((touche, i) =>
      setTimeout(() => {
        setAllumee(touche);
        bip(SONS[touche]);
      }, 600 + i * DELAI_DEMO_MS)
    );
    timers.push(
      setTimeout(() => {
        setPosition(0);
        setEtape("joueur");
      }, 600 + sequence.length * DELAI_DEMO_MS)
    );
    return () => timers.forEach(clearTimeout);
  }, [etape, sequence]);

  useEffect(() => {
    if (etape !== "erreur" && etape !== "manche") return;
    const timer = setTimeout(() => {
      if (etape === "manche") setSequence((s) => [...s, toucheAuHasard()]);
      setEtape("demo");
    }, 1000);
    return () => clearTimeout(timer);
  }, [etape]);

  useEffect(() => {
    if (!allumee) return;
    const timer = setTimeout(() => setAllumee(null), 300);
    return () => clearTimeout(timer);
  }, [allumee]);

  function appui(touche: Touche) {
    if (etape !== "joueur") return;
    setAllumee(touche);

    if (touche !== sequence[position]) {
      bip(110, 0.4);
      setEtape("erreur");
      onErreur?.();
      return;
    }

    bip(SONS[touche]);
    if (position + 1 < sequence.length) {
      setPosition(position + 1);
    } else if (sequence.length < LONGUEUR_FINALE) {
      setEtape("manche");
    } else {
      setEtape("reussi");
      onReussi?.();
    }
  }

  const manetteConnectee = useManette(appui);

  return (
    <div className={styles.module}>
      <div className={styles.panneaux}>
        <Panneau titre="SÉQUENCE" className={styles.sequence}>
          <Prompt message={MESSAGES[etape]} curseur={etape === "joueur"} />
          <div className={styles.croix}>
            {TOUCHES.map((touche) => (
              <div
                key={touche}
                className={`${styles.touche} ${styles[touche]} ${allumee === touche ? styles.allumee : ""}`}
              >
                {touche}
              </div>
            ))}
          </div>
        </Panneau>

        <Panneau titre="ÉTAT" couleur="cyan" className={styles.etat}>
          <p>
            longueur <span className={styles.valeur}>{sequence.length} / {LONGUEUR_FINALE}</span>
          </p>
          <p>
            saisie <span className={styles.valeur}>{etape === "joueur" ? `${position} / ${sequence.length}` : "-"}</span>
          </p>
          <p>
            manette{" "}
            <span className={manetteConnectee ? styles.ok : styles.absente}>
              {manetteConnectee ? "connectée" : "non détectée"}
            </span>
          </p>
          {!manetteConnectee && (
            <p className={styles.secondaire}>appuie sur un bouton pour la réveiller, ou utilise le clavier (A B X Y)</p>
          )}
        </Panneau>
      </div>

      <BarreStatut state={state} />
    </div>
  );
}
