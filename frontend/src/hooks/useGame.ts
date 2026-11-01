import { useEffect, useState } from "react";
import type { GameState, Indice } from "../types/game";

// The backend is the source of truth: it pushes the state on /ws after every change
// and every second (timer). Actions are sent with the REST API.

async function post<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`/api/${path}`, {
        method: "POST",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`${path}: ${res.status} ${await res.text()}`);
    return res.json();
}

export function useGame() {
    const [state, setState] = useState<GameState | null>(null);

    useEffect(() => {
        let ws: WebSocket;
        let retry: number;
        let closed = false;

        function connect() {
            const protocol = location.protocol === "https:" ? "wss" : "ws";
            ws = new WebSocket(`${protocol}://${location.host}/ws`);
            ws.onmessage = (e) => {
                const msg = JSON.parse(e.data);
                if (msg.event === "state") setState(msg.data);
            };
            ws.onclose = () => {
                setState(null);
                if (!closed) retry = setTimeout(connect, 1000);
            };
        }

        connect();
        return () => {
            closed = true;
            clearTimeout(retry);
            ws.close();
        };
    }, []);

    return {
        state,
        lancer: () => post<GameState>("game/start"),
        ouvrirModule: () => post<GameState>("game/module"),
        envoyerPoids: (grams: number, stable = true) => post<GameState>("game/weight", { grams, stable }),
        envoyerMotDePasse: (value: string) => post<GameState>("game/password", { value }),
        demanderIndice: () => post<Indice>("game/hint"),
        choisir: (accept: boolean) => post<GameState>("game/choice", { accept }),
        allerHopper: () => post<GameState>("game/hopper"),
    };
}
