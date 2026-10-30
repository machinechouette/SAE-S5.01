import {useEffect, useState} from "react";

export function useMachineAEcrire(lignes: string[], vitesse = 40, pause = 300){
    const [ligne, setLigne] = useState(0);
    const [lettre, setLettre] = useState(0);

    useEffect(() => {
        if(ligne >= lignes.length) return;

        const finDeLigne = lettre >= lignes[ligne].length;
        const timer = setTimeout(() => {
            if (finDeLigne) {
                setLigne((l) => l + 1);
                setLettre(0);
            } else {
                setLettre((n) => n + 1);
            }
        }, finDeLigne ? pause : vitesse);

        return () => clearTimeout(timer);
    }, [ligne, lettre, lignes, vitesse, pause]);

    const affichees = lignes.slice(0, ligne + 1).map((texte, i) => (i < ligne ? texte : texte.slice(0, lettre)));

    return {
        affichees,
        ligneEnCours: ligne,
        fini: ligne >= lignes.length,
    };
}