import styles from "./Prompt.module.css";

type props = {message?: string, curseur?: boolean}

function Prompt({ message, curseur }: props){
    return <div className={styles.lignes}>
        &gt; {message}
        {curseur && <span className={styles.curseur}/>}
    </div>
}

export default Prompt;