import { useState } from "react";
import Button from "../../components/ui/Button/Button";
import Panneau from "../../components/ui/Panneau/Panneau";
import styles from "./Choix.module.css";

type Props = {
  onChoisir: (accepter: boolean) => Promise<unknown>;
};

export default function Choix({ onChoisir }: Props) {
  const [envoi, setEnvoi] = useState(false);

  async function choisir(accepter: boolean) {
    if (envoi) return;
    setEnvoi(true);
    try {
      await onChoisir(accepter);
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className={styles.ecran}>
      <p className={styles.alerte}>▲ mise à jour forcée stoppée · nouvelle offre reçue</p>

      <Panneau titre="ARASAKA_UPDATE" couleur="magenta" className={styles.offre}>
        <p className={styles.titre}>&gt; mise à jour premium disponible</p>
        <p className={styles.texte}>
          « Installez notre mise à jour Premium : votre deck sera plus rapide, plus moderne,
          et vous n'aurez plus jamais à le réparer. »
        </p>
        <div className={styles.actions}>
          <Button couleur="magenta" onClick={() => choisir(true)}>INSTALLER</Button>
          <Button couleur="vert" onClick={() => choisir(false)}>REFUSER</Button>
        </div>
      </Panneau>
    </div>
  );
}
