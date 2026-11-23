import EcranFin from "./EcranFin";
import styles from "./Fins.module.css";

const LIGNES = [
  "chrono : 00:00",
  "mise à jour arasaka installée",
  "deck effacé",
];

const VALEURS = [
  ["alimentation", "prolonger la vie du matériel"],
  ["contrôles", "détourner des objets plutôt que racheter"],
  ["capteurs", "comprendre et maîtriser son matériel"],
  ["données", "protéger sa vie privée"],
  ["système", "garder le contrôle de ses technologies"],
];

type Props = { onHopper: () => void };

export default function Defaite({ onHopper }: Props) {
  return (
    <EcranFin couleur="magenta" lignes={LIGNES} titrePanneau="CE QUE TU AURAIS DÉCOUVERT" onHopper={onHopper}>
      <ul className={styles.liste}>
        {VALEURS.map(([module, valeur]) => (
          <li key={module}>
            {module} : <span className={styles.valeur}>{valeur}</span>
          </li>
        ))}
      </ul>
    </EcranFin>
  );
}
