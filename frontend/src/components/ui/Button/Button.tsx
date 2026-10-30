import type { ReactNode } from "react";
import styles from "./Button.module.css";

type Props = {children: ReactNode, onClick?: () => void, couleur?: string;
};

function Button({ children, onClick, couleur = "vert" }: Props) {
    return (
    <button type="button" className={`${styles.bouton} ${styles[couleur]}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;