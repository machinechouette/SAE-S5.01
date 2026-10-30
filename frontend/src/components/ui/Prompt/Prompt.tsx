import styles from "./Prompt.module.css";

type props = {message?: string, curseur?: boolean, ecrit?: boolean}

function Prompt({ message, curseur, ecrit }: props){
    return <div className={styles.lignes}>
        &gt; {message}
        {curseur && <span className={`${styles.curseur} ${ecrit ? styles.fixe : ""}`}/>}
    </div>
}

export default Prompt;