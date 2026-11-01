// Same names as the Phase enum in backend/engine.py
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

// Sent by the backend (GameEngine.full_state) on the WebSocket and the REST API
export type GameState = {
  phase: Phase;
  remaining_s: number;
  modules: Record<"1" | "2" | "3" | "4" | "5", EtatModule>;
  answers_left: number;
};

export type Indice = {
  level: 1 | 2 | 3;
  text: string;
  answers_left: number;
};
