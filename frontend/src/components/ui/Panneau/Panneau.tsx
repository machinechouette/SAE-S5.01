import type { CSSProperties, ReactNode } from "react";
import styles from "./Panneau.module.css";

type Props = {
  titre: string;
  couleur?: "vert" | "cyan" | "magenta" | "jaune";
  className?: string;
  children: ReactNode;
};

export default function Panneau({ titre, couleur = "vert", className = "", children }: Props) {
  const style = { "--couleur-panneau": `var(--${couleur})` } as CSSProperties;
  return (
    <section className={`${styles.panneau} ${className}`} style={style}>
      <h2 className={styles.titre}>{titre}</h2>
      {children}
    </section>
  );
}