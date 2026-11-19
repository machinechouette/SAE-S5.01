import { useEffect, useRef, useState } from "react";

export type Touche = "A" | "B" | "X" | "Y";

const BOUTONS: Touche[] = ["A", "B", "X", "Y"];

const CLAVIER: Record<string, Touche> = { a: "A", b: "B", x: "X", y: "Y" };

export function useManette(onTouche: (touche: Touche) => void) {
  const callback = useRef(onTouche);
  const [connectee, setConnectee] = useState(false);

  useEffect(() => {
    callback.current = onTouche;
  });

  useEffect(() => {
    let frame: number;
    let etaitConnectee = false;
    const avant: Record<string, boolean> = {};

    function lire() {
      const manettes = navigator.getGamepads().filter((m) => m !== null);

      for (const manette of manettes) {
        BOUTONS.forEach((touche, i) => {
          const cle = `${manette.index}-${i}`;
          const presse = manette.buttons[i]?.pressed ?? false;
          if (presse && !avant[cle]) callback.current(touche);
          avant[cle] = presse;
        });
      }

      const estConnectee = manettes.length > 0;
      if (estConnectee !== etaitConnectee) {
        etaitConnectee = estConnectee;
        setConnectee(estConnectee);
      }

      frame = requestAnimationFrame(lire);
    }

    function clavier(e: KeyboardEvent) {
      const touche = CLAVIER[e.key.toLowerCase()];
      if (touche && !e.repeat) callback.current(touche);
    }

    frame = requestAnimationFrame(lire);
    window.addEventListener("keydown", clavier);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", clavier);
    };
  }, []);

  return connectee;
}
