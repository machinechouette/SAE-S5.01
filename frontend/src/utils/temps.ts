// 1187.4 secondes -> "19:48"
export function formatTemps(secondes: number) {
  const s = Math.ceil(secondes);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}
