import Prompt from "../components/ui/Prompt/Prompt";
import { useGame } from "../hooks/useGame";
import Accueil from "./Accueil/Accueil";
import Hub from "./Hub/Hub";
import Capteurs from "./Modules/Capteurs/Capteurs";
import Controles from "./Modules/Controles/Controles";
import Donnees from "./Modules/Donnees/Donnees";
import { CLE_EXEMPLE } from "./Modules/Donnees/exemple";

export default function GameShell() {
  const { state, poids, usb, lancer, ouvrirModule, demanderIndice } = useGame();

  if (!state) return <Prompt message="connexion au deck..." curseur />;

  const apercu = import.meta.env.DEV ? new URLSearchParams(location.search).get("ecran") : null;
  if (apercu === "controles") return <Controles state={state} />;
  if (apercu === "donnees") {
    const sansCle = new URLSearchParams(location.search).get("usb") === "aucune";
    return <Donnees state={state} usb={sansCle ? null : CLE_EXEMPLE} />;
  }

  switch (state.phase) {
    case "ACCUEIL":
      return <Accueil onLancer={lancer} />;
    case "HUB":
      return <Hub state={state} onOuvrirModule={ouvrirModule} />;
    case "MODULE_1":
      return <Controles state={state} />;
    case "MODULE_2":
      return <Capteurs state={state} poids={poids} onIndice={demanderIndice} />;
    case "MODULE_3":
      return <Donnees state={state} usb={usb} />;
    default:
      return <Prompt message={`${state.phase} : écran à venir`} curseur />;
  }
}
