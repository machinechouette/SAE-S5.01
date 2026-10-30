import Button from "../../components/ui/Button/Button";
import Prompt from "../../components/ui/Prompt/Prompt";
import { useMachineAEcrire } from "../../hooks/useMachineAEcrire";
import styles from "./Accueil.module.css";

const LIGNES = [
  "boot cyberdeck_os",
  "deck abandonné détecté",
  "modules réparés : 0 / 5",
  "mise à jour forcée : 20:00",
];

type Props = { onLancer: () => void };

export default function Accueil({ onLancer }: Props) {
    const { affichees, ligneEnCours, fini } = useMachineAEcrire(LIGNES);
    return (
        <div className={styles.screen}>
            {affichees.map((texte, i) => (
                <Prompt key={i} message={texte} curseur={i === ligneEnCours} ecrit={i === ligneEnCours} />
            ))}
            {fini && <Prompt curseur />}
            {fini && (
                <div className={styles.buttonStart}>
                    <Button onClick={onLancer}>LANCER</Button>
                </div>
            )}
        </div>
    );
}