import { useState } from "react";
import Button from "../../components/ui/Button/Button";
import Panneau from "../../components/ui/Panneau/Panneau";
import styles from "./Hopper.module.css";

type Props = {
  onRejouer: () => Promise<unknown>;
};

export default function Hopper({ onRejouer }: Props) {
  const [envoi, setEnvoi] = useState(false);

  async function rejouer() {
    if (envoi) return;
    setEnvoi(true);
    try {
      await onRejouer();
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className={styles.ecran}>
      <div className={styles.panneaux}>
        <Panneau titre="QUI ÉTAIT LA VRAIE GRACE HOPPER ?" couleur="cyan" className={styles.hopper}>
          <p className={styles.nom}>Grace Murray Hopper (1906 – 1992)</p>
          <p>Mathématicienne et officière de la marine américaine, pionnière de la programmation.</p>
          <p>
            Elle a programmé l'un des premiers ordinateurs, le Harvard Mark I, et créé l'un des
            premiers compilateurs, qui traduit du texte proche de l'anglais en instructions pour la machine.
          </p>
          <p>Ses travaux ont mené au langage COBOL, encore utilisé aujourd'hui.</p>
          <p>
            On lui attribue aussi le mot « bug » : en 1947, son équipe a retrouvé un papillon de nuit
            coincé dans un ordinateur.
          </p>
        </Panneau>

        <Panneau titre="UN VRAI CYBERDECK" className={styles.deck}>
          <p>Un ordinateur portable fait main, souvent à partir de matériel récupéré.</p>
          <p>
            Celui-ci tourne sur un Raspberry Pi 3, des jouets et des manettes détournés :
            du matériel « obsolète » qui fonctionne encore.
          </p>
          <p>Son idée : un appareil qu'on comprend, qu'on répare et qu'on contrôle soi-même.</p>
        </Panneau>
      </div>

      <div>
        <Button onClick={rejouer}>{envoi ? "RÉINITIALISATION..." : "REJOUER"}</Button>
      </div>
    </div>
  );
}
