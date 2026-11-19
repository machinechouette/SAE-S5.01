let contexte: AudioContext | null = null;

export function bip(frequence: number, duree = 0.15) {
  contexte ??= new AudioContext();
  if (contexte.state === "suspended") contexte.resume();

  const oscillateur = contexte.createOscillator();
  const volume = contexte.createGain();
  oscillateur.type = "square";
  oscillateur.frequency.value = frequence;
  volume.gain.value = 0.08;

  oscillateur.connect(volume).connect(contexte.destination);
  oscillateur.start();
  oscillateur.stop(contexte.currentTime + duree);
}
