import type { Phase } from "../../../types/game";
import styles from "./Mascotte.module.css";

// BIT, the deck's little robot. It starts broken and gets a new part for each repaired module:
// 1 = arms, 2 = antenna, 3 = clean screen + chest light, 4 = legs + glow.
// Its face and animation follow the player's answers (see Humeur).

export type Humeur =
  | "dort"
  | "neutre"
  | "joie"
  | "erreur"
  | "indice"
  | "panique"
  | "inquiet"
  | "libre"
  | "corrompu"
  | "efface";

type Props = {
  humeur: Humeur;
  repares: number;
  total: number;
  phase: Phase;
};

const LARGEUR = 16;

// Faces drawn in the 8 x 3 screen of the head. S = screen, E = eye / mouth, X = special eye
const VISAGES: Record<Humeur, string[]> = {
  dort: ["SSSSSSSS", "SEESSEES", "SSSSSSSS"],
  neutre: ["SEESSEES", "SSSSSSSS", "SSEEEESS"],
  joie: ["SSESSESS", "SESEESES", "SEEEEEES"],
  erreur: ["SEESSEES", "SSEEEESS", "SESSSSES"],
  indice: ["SSSSSSSS", "SSEESSEE", "SSSSEESS"],
  panique: ["SEESSEES", "SEESSEES", "SSSEESSS"],
  inquiet: ["SSEESEES", "SSSSSSSS", "SSSEEESS"],
  libre: ["SSESSESS", "SESEESES", "SEEEEEES"],
  corrompu: ["SXXSSXXS", "SXXSSXXS", "SEEEEEES"],
  efface: ["SXSXXSXS", "SSXSSXSS", "SXSXXSXS"],
};

const BULLES: Record<Humeur, string> = {
  dort: "zzz...",
  neutre: "concentre-toi !",
  joie: "module réparé !",
  erreur: "aïe... ce n'est pas ça",
  indice: "hmm... un indice ?",
  panique: "vite ! la mise à jour arrive",
  inquiet: "à toi de choisir...",
  libre: "merci ! je suis libre",
  corrompu: "MISE À JOUR INSTALLÉE",
  efface: "...",
};

function bulle(humeur: Humeur, repares: number, phase: Phase, restantes: number): string {
  if (humeur === "neutre" && phase === "HUB") {
    if (repares === 0) return "je suis en panne... aide-moi";
    return `encore ${restantes} module${restantes > 1 ? "s" : ""} à réparer`;
  }
  return BULLES[humeur];
}

// Builds the 16 x 17 sprite as rows of palette letters ("." = transparent)
function sprite(humeur: Humeur, repares: number): string[] {
  const bras = repares >= 1;
  const antenne = repares >= 2;
  const propre = repares >= 3;
  const jambes = repares >= 4;
  const visage = VISAGES[humeur];

  const lignes = [
    antenne ? "........A......." : "................",
    antenne ? "........K......." : "................",
    "...KKKKKKKKKK...",
    "..KBBBBBBBBBBK..",
    `..KBSSSSSSSSBK..`,
    `..KB${visage[0]}BK..`,
    `..KB${visage[1]}BK..`,
    `..KB${visage[2]}BK..`,
    "..KBSSSSSSSSBK..",
    "..KBBBBBBBBBBK..",
    "...KKKKKKKKKK...",
    "....KBBBBBBK....",
    bras ? "..HHKBLLLLBKHH.." : "....KBLLLLBK....",
    bras ? "..H.KBLBBLBK.H.." : "....KBLBBLBK....",
    "....KBBBBBBK....",
    jambes ? "....KK....KK...." : "....KKKKKKKK....",
    jambes ? "...KKK....KKK..." : "................",
  ];

  if (!propre) {
    // Rust and a cracked screen until the data module is repaired
    const abime = (ligne: number, col: number, c: string) => {
      const l = lignes[ligne];
      lignes[ligne] = l.slice(0, col) + c + l.slice(col + 1);
    };
    abime(3, 4, "R");
    abime(3, 10, "R");
    abime(9, 11, "R");
    abime(14, 6, "R");
    abime(4, 10, "C");
    abime(8, 5, "C");
  }
  return lignes;
}

function couleurs(humeur: Humeur, repares: number): Record<string, string> {
  const propre = repares >= 3;
  const base: Record<string, string> = {
    K: "#0b1a17",
    B: propre ? "#9fd8c0" : "#6f8a80",
    H: propre ? "#9fd8c0" : "#6f8a80",
    L: propre ? "var(--cyan)" : "#2a4a40",
    S: propre ? "#06231b" : "#0d1714",
    E: "var(--vert)",
    X: "var(--vert)",
    A: "var(--jaune)",
    R: "#9a5a32",
    C: "#3a4a45",
  };
  if (humeur === "erreur" || humeur === "panique") base.E = "var(--magenta)";
  if (humeur === "indice") base.E = "var(--jaune)";
  if (humeur === "corrompu") {
    Object.assign(base, { B: "#c2456d", H: "#c2456d", L: "var(--magenta)", E: "var(--magenta)", X: "var(--magenta)", A: "var(--magenta)" });
  }
  if (humeur === "efface") {
    Object.assign(base, { B: "#3a4542", H: "#3a4542", L: "#2a3330", E: "#56625e", X: "#56625e", A: "#3a4542", R: "#3a4542" });
  }
  return base;
}

export default function Mascotte({ humeur, repares, total, phase }: Props) {
  const restantes = total - repares;
  const lignes = sprite(humeur, repares);
  const palette = couleurs(humeur, repares);
  const pixels = lignes.flatMap((ligne, y) =>
    [...ligne].map((c, x) =>
      c === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={palette[c]} />
    )
  );

  return (
    <aside className={styles.mascotte}>
      <p className={`${styles.bulle} ${styles[`bulle_${humeur}`] ?? ""}`}>
        {bulle(humeur, repares, phase, restantes)}
      </p>

      <div className={styles.scene}>
        <svg
          className={`${styles.robot} ${styles[humeur]} ${repares >= 4 ? styles.brille : ""}`}
          viewBox={`0 0 ${LARGEUR} ${lignes.length}`}
          shapeRendering="crispEdges"
          role="img"
          aria-label={`BIT, ${repares} module(s) réparé(s)`}
        >
          {pixels}
        </svg>
        {humeur === "dort" && <span className={styles.zzz}>z</span>}
        {humeur === "indice" && <span className={styles.point}>?</span>}
        {humeur === "erreur" && <span className={styles.point}>!</span>}
      </div>

      <div className={styles.sol} />
      <p className={styles.nom}>BIT · {repares}/{total}</p>
    </aside>
  );
}
