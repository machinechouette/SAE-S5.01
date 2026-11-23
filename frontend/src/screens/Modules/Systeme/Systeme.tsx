import { useState, type FormEvent } from "react";
import BarreStatut from "../../../components/game/BarreStatut/BarreStatut";
import Button from "../../../components/ui/Button/Button";
import Panneau from "../../../components/ui/Panneau/Panneau";
import Prompt from "../../../components/ui/Prompt/Prompt";
import type { GameState, Indice } from "../../../types/game";
import styles from "./Systeme.module.css";

type Props = {
  state: GameState;
  onMotDePasse: (valeur: string) => Promise<GameState>;
  onIndice: () => Promise<Indice>;
};

export default function Systeme({ state, onMotDePasse, onIndice }: Props) {
  const [valeur, setValeur] = useState("");
  const [erreur, setErreur] = useState(false);
  const [essais, setEssais] = useState(0);
  const [envoi, setEnvoi] = useState(false);
  const [indice, setIndice] = useState<Indice | null>(null);
  const [plusDeReponse, setPlusDeReponse] = useState(false);

  async function valider(e?: FormEvent) {
    e?.preventDefault();
    if (!valeur.trim() || envoi) return;
    setEnvoi(true);
    try {
      const nouvelEtat = await onMotDePasse(valeur.trim());
      if (nouvelEtat.phase === "MODULE_4") {
        setErreur(true);
        setEssais((n) => n + 1);
        setValeur("");
      }
    } catch {
      setErreur(true);
    } finally {
      setEnvoi(false);
    }
  }

  async function demanderIndice() {
    try {
      setIndice(await onIndice());
      setPlusDeReponse(false);
    } catch {
      setPlusDeReponse(true);
    }
  }

  return (
    <div className={styles.module}>
      <div className={styles.panneaux}>
        <Panneau titre="SYSTÈME" className={styles.systeme}>
          <Prompt message="mot de passe requis" />
          <p className={styles.consigne}>
            assemble les cartes des composants pour retrouver le mot de passe
          </p>

          <form className={styles.saisie} onSubmit={valider}>
            <label htmlFor="mot-de-passe" className={styles.label}>&gt;</label>
            <input
              id="mot-de-passe"
              className={`${styles.champ} ${erreur ? styles.champErreur : ""}`}
              value={valeur}
              onChange={(e) => {
                setValeur(e.target.value);
                setErreur(false);
              }}
              autoComplete="off"
              spellCheck={false}
              autoFocus
            />
          </form>

          {erreur && <p className={styles.erreur}>accès refusé : mot de passe incorrect</p>}
          {essais > 0 && <p className={styles.secondaire}>tentatives : {essais}</p>}

          <div className={styles.actions}>
            <Button onClick={valider}>{envoi ? "VÉRIFICATION..." : "VALIDER"}</Button>
            <Button couleur="jaune" onClick={demanderIndice}>INDICE</Button>
          </div>
        </Panneau>

        <Panneau titre="JOURNAL DE LUCY" couleur="cyan" className={styles.journal}>
          <p>« j'ai protégé le dernier module par le nom de la pionnière qui m'a inspirée. »</p>
          {indice && <p>indice {indice.level} : {indice.text}</p>}
          {plusDeReponse && <p className={styles.erreur}>plus aucune réponse disponible</p>}
        </Panneau>
      </div>

      <BarreStatut state={state} />
    </div>
  );
}
