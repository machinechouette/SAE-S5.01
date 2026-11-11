import Prompt from "../components/ui/Prompt/Prompt";
import { useGame } from "../hooks/useGame";
import Accueil from "./Accueil/Accueil";
import Hub from "./Hub/Hub";

export default function GameShell() {
  const { state, lancer, ouvrirModule } = useGame();

  if (!state) return <Prompt message="connexion au deck..." curseur />;

  switch (state.phase) {
    case "ACCUEIL":
      return <Accueil onLancer={lancer} />;
    case "HUB":
    return <Hub state={state} onOuvrirModule={ouvrirModule} />
    default:
      // TODO: screens still to build (modules, choix, fins, Hopper)
      return <Prompt message={`${state.phase} : écran à venir`} curseur />;
  }
}
