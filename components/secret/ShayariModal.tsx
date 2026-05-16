'use client';

import { useEffect, useRef, useState } from 'react';
import { SHAYARI } from '@/content/secret-shayari';

type Props = { inline?: boolean };

export function ShayariModal({ inline = false }: Props) {
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  function play(idx: number, src: string) {
    audioRef.current?.pause();
    const a = new Audio(src);
    audioRef.current = a;
    setPlayingIdx(idx);
    a.play().catch(() => setPlayingIdx(null));
    a.onended = () => setPlayingIdx(null);
  }

  function stop() {
    audioRef.current?.pause();
    setPlayingIdx(null);
  }

  return (
    <div className={inline ? 'space-y-3' : 'fixed inset-0 z-40 bg-bg/95 backdrop-blur p-6 overflow-auto'}>
      {SHAYARI.map((s, i) => (
        <div key={i} className="border border-chrome rounded p-3" data-target={`shayari-${i}`}>
          <pre className="whitespace-pre-wrap text-fg/90 text-sm leading-relaxed">{s.text}</pre>
          <button
            onClick={() => (playingIdx === i ? stop() : play(i, s.audio))}
            className="mt-2 text-xs text-prompt hover:text-ball"
          >
            {playingIdx === i ? '◼ stop' : '▶ play'}
          </button>
        </div>
      ))}
    </div>
  );
}
