export const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA',
];

export function matchKonami(history: readonly string[]): boolean {
  if (history.length < KONAMI.length) return false;
  const tail = history.slice(-KONAMI.length);
  return KONAMI.every((k, i) => k === tail[i]);
}
