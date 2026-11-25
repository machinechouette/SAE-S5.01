import { useState, type FormEvent } from "react";
import BarreStatut from "../../../components/game/BarreStatut/BarreStatut";
import Button from "../../../components/ui/Button/Button";
import Panneau from "../../../components/ui/Panneau/Panneau";
import Prompt from "../../../components/ui/Prompt/Prompt";
import type { CleUsb, GameState } from "../../../types/game";
import styles from "./Donnees.module.css";

type Props = {
  state: GameState;
  usb: CleUsb | null;
  onReponse: (reponse: string) => Promise<GameState>;
};

export default function Donnees({ state, usb, onReponse }: Props) {
  const [ouvert, setOuvert] = useState<string | null>(null);
  const [reponse, setReponse] = useState("");
  const [erreur, setErreur] = useState(false);
  const [envoi, setEnvoi] = useState(false);

  const fichier = usb?.fichiers.find((f) => f.nom === ouvert) ?? null;

  async function envoyer(e?: FormEvent) {
    e?.preventDefault();
    if (!reponse.trim() || envoi) return;
    setEnvoi(true);
    try {
      const nouvelEtat = await onReponse(reponse.trim());
      if (nouvelEtat.phase === "MODULE_3") {
        setErreur(true);
        setReponse("");
      }
    } catch {
      setErreur(true);
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className={styles.module}>
      <div className={styles.panneaux}>
        <Panneau titre="CLÉ USB" className={styles.cle}>
          {usb ? (
            <>
              <Prompt message={`usb --liste ${usb.label}`} />
              {usb.fichiers.length === 0 && <p className={styles.secondaire}>aucun fichier</p>}
              <ul className={styles.fichiers}>
                {usb.fichiers.map((f) => (
                  <li key={f.nom}>
                    <button
                      type="button"
                      className={`${styles.fichier} ${f.nom === ouvert ? styles.ouvert : ""}`}
                      onClick={() => setOuvert(f.nom)}
                    >
                      {f.nom}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <Prompt message="insère une clé usb" curseur />
          )}
        </Panneau>

        <Panneau titre="FICHIER" couleur="cyan" className={styles.lecteur}>
          {fichier ? (
            <>
              <p className={styles.nom}>{fichier.nom}</p>
              <pre className={styles.contenu}>{fichier.contenu}</pre>
            </>
          ) : (
            <p className={styles.secondaire}>{usb ? "sélectionne un fichier" : "en attente d'une clé"}</p>
          )}
        </Panneau>
      </div>

      <form className={styles.saisie} onSubmit={envoyer}>
        <label htmlFor="dechiffrer" className={styles.label}>&gt; déchiffrer :</label>
        <input
          id="dechiffrer"
          className={styles.champ}
          value={reponse}
          onChange={(e) => {
            setReponse(e.target.value);
            setErreur(false);
          }}
          autoComplete="off"
          spellCheck={false}
        />
        <Button onClick={envoyer}>VALIDER</Button>
        {erreur && <span className={styles.erreur}>message incorrect</span>}
      </form>

      <BarreStatut state={state} />
    </div>
  );
}
