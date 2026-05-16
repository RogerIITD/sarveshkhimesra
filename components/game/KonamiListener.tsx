'use client';

import { useEffect, useRef } from 'react';
import { useGame } from './GameProvider';
import { matchKonami } from './konami';

export function KonamiListener() {
  const { unlock, setTurbo } = useGame();
  const history = useRef<string[]>([]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      history.current.push(e.code);
      if (history.current.length > 20) history.current.shift();
      if (matchKonami(history.current)) {
        unlock('turbo');
        setTurbo(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [unlock, setTurbo]);
  return null;
}
