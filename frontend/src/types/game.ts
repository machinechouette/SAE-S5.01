export type Phase =
  | "ACCUEIL"
  | "HUB"
  | "MODULE_1"
  | "MODULE_2"
  | "MODULE_3"
  | "MODULE_4"
  | "MODULE_5"
  | "CHOIX"
  | "FIN_LIBRE"
  | "FIN_FERMEE"
  | "FIN_DEFAITE"
  | "HOPPER";

export type EtatModule = "locked" | "active" | "repaired";

export type GameState = {
  phase: Phase;
  remaining_s: number;
  modules: Record<"1" | "2" | "3" | "4" | "5", EtatModule>;
  answers_left: number;
};

export type Poids = {
  grams: number;
  stable: boolean;
};

export type Indice = {
  level: 1 | 2 | 3;
  text: string;
  answers_left: number;
};

export type FichierUsb = {
  nom: string;
  contenu: string;
};

export type CleUsb = {
  label: string;
  fichiers: FichierUsb[];
};
