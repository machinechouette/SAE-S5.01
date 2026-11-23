import type { CSSProperties, ReactNode } from "react";
import Button from "../../components/ui/Button/Button";
import Panneau from "../../components/ui/Panneau/Panneau";
import { useMachineAEcrire } from "../../hooks/useMachineAEcrire";
import styles from "./Fins.module.css";

type Couleur = "vert" | "cyan" | "magenta";

type Props = {
  couleur: Couleur;
  lignes: string[];
  titrePanneau: string;
  children: ReactNode;
  onHopper: () => void;
};

export default function EcranFin({ couleur, lignes, titrePanneau, children, onHopper }: Props) {
  const { affichees, ligneEnCours, fini } = useMachineAEcrire(lignes, 35, 400);
  const style = { "--couleur-fin": `var(--${couleur})` } as CSSProperties;

  return (
    <div className={styles.ecran} style={style}>
      <div>
        {affichees.map((texte, i) => (
          <p key={i} className={styles.ligne}>
            &gt; {texte}
            {i === ligneEnCours && <span className={styles.curseur} />}
          </p>
        ))}
      </div>

      {fini && (
        <>
          <Panneau titre={titrePanneau} couleur={couleur} className={styles.panneau}>
            {children}
          </Panneau>
          <div>
            <Button couleur={couleur === "magenta" ? "magenta" : "vert"} onClick={onHopper}>
              QUI ÉTAIT LA VRAIE GRACE HOPPER ?
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
