import EcranFin from "./EcranFin";
import styles from "./Fins.module.css";

const LIGNES = [
  "mise à jour premium refusée",
  "deck_status : libre",
  "message de lucy : débloqué",
];

type Props = { onHopper: () => void };

export default function FinLibre({ onHopper }: Props) {
  return (
    <EcranFin couleur="cyan" lignes={LIGNES} titrePanneau="MESSAGE DE LUCY" onHopper={onHopper}>
      <p className={styles.manifeste}>
        réparable.<br />
        ouvert.<br />
        respectueux de ta vie privée.
      </p>
      <p className={styles.secondaire}>[message complet de Lucy à écrire avec l'équipe]</p>
    </EcranFin>
  );
}
