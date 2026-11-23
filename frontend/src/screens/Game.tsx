import Prompt from "../components/ui/Prompt/Prompt";
import { useGame } from "../hooks/useGame";
import Accueil from "./Accueil/Accueil";
import Choix from "./Choix/Choix";
import Defaite from "./Fins/Defaite";
import FinFermee from "./Fins/FinFermee";
import FinLibre from "./Fins/FinLibre";
import Hopper from "./Hopper/Hopper";
import Hub from "./Hub/Hub";
import Capteurs from "./Modules/Capteurs/Capteurs";
import Controles from "./Modules/Controles/Controles";
import Donnees from "./Modules/Donnees/Donnees";
import Systeme from "./Modules/Systeme/Systeme";

export default function GameShell() {
  const {
    state,
    poids,
    usb,
    lancer,
    ouvrirModule,
    reussirControles,
    envoyerMessage,
    envoyerMotDePasse,
    demanderIndice,
    choisir,
    allerHopper,
    rejouer,
  } = useGame();

  if (!state) return <Prompt message="connexion au deck..." curseur />;

  switch (state.phase) {
    case "ACCUEIL":
      return <Accueil onLancer={lancer} />;
    case "HUB":
      return <Hub state={state} onOuvrirModule={ouvrirModule} />;
    case "MODULE_1":
      return <Controles state={state} onReussi={reussirControles} />;
    case "MODULE_2":
      return <Capteurs state={state} poids={poids} onIndice={demanderIndice} />;
    case "MODULE_3":
      return <Donnees state={state} usb={usb} onReponse={envoyerMessage} />;
    case "MODULE_4":
      return <Systeme state={state} onMotDePasse={envoyerMotDePasse} onIndice={demanderIndice} />;
    case "CHOIX":
      return <Choix onChoisir={choisir} />;
    case "FIN_LIBRE":
      return <FinLibre onHopper={allerHopper} />;
    case "FIN_FERMEE":
      return <FinFermee onHopper={allerHopper} />;
    case "FIN_DEFAITE":
      return <Defaite onHopper={allerHopper} />;
    case "HOPPER":
      return <Hopper onRejouer={rejouer} />;
    default:
      return <Prompt message={`${state.phase} : écran à venir`} curseur />;
  }
}
