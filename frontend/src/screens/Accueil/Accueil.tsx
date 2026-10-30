import Button from "../../components/ui/Button/Button";
import Prompt from "../../components/ui/Prompt/Prompt";
import styles from "./Accueil.module.css";

export default function Accueil( { onLancer }: { onLancer: () => void }) {
    return (
        <div className={styles.screen}>
            <Prompt message="boot cyberdeck_os" />
            <Prompt message="deck abandonné détecté" />
            <Prompt message="modules réparés : 0 / 5" />
            <Prompt message="mise à jour forcée : 20:00" />
            <Prompt curseur={true} />
            <div className={styles.buttonStart}>
                <Button onClick={onLancer}>LANCER</Button>
            </div>
        </div>
        
    );
}