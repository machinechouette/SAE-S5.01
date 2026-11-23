import EcranFin from "./EcranFin";
import styles from "./Fins.module.css";

const LIGNES = [
  "installation de la mise à jour premium...",
  "installation terminée",
  "deck_status : produit arasaka",
];

const CONSEQUENCES = [
  "tes données sont revendues",
  "la réparation est impossible",
  "l'appareil est programmé pour être remplacé",
];

type Props = { onHopper: () => void };

export default function FinFermee({ onHopper }: Props) {
  return (
    <EcranFin couleur="magenta" lignes={LIGNES} titrePanneau="CONSÉQUENCES" onHopper={onHopper}>
      <ul className={styles.liste}>
        {CONSEQUENCES.map((texte) => (
          <li key={texte}>
            <span className={styles.croix}>×</span> {texte}
          </li>
        ))}
      </ul>
      <p className={styles.secondaire}>le deck est plus rapide, mais il ne t'appartient plus.</p>
    </EcranFin>
  );
}
