import { useState } from "react";
import type { Phase } from "../types/game";
import Accueil from "./Accueil/Accueil";
import Hub from "./Hub/Hub";

export default function GameShell() {
  const [phase, setPhase] = useState<Phase>("ACCUEIL");

  switch (phase) {
    case "ACCUEIL":
      return <Accueil onLancer={() => setPhase("HUB")} />;
    case "HUB":
      return <Hub />;

  }
}