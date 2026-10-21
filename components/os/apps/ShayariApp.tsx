'use client';

import { useEffect, useRef, useState } from 'react';
import { SHAYARI } from '@/content/secret-shayari';
import { track } from '@/lib/track';

export function ShayariApp() {
  const [playing, setPlaying] = useState<number | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => () => audio.current?.pause(), []);

  function toggle(i: number) {
    audio.current?.pause();
    if (playing === i) {
      setPlaying(null);
      return;
    }
    const a = new Audio(SHAYARI[i].audio);
    audio.current = a;
    a.onended = () => setPlaying(null);
    a.play().then(() => track({ name: 'audio_play', track: `shayari-${i + 1}` })).catch(() => setPlaying(null));
    setPlaying(i);
  }

  return (
    <div className="p-4 space-y-3">
      <p className="text-xs text-dim font-mono">{'// written by me, read by me. hit ▶ to hear it.'}</p>
      {SHAYARI.map((s, i) => (
        <article key={i} className={`rounded-xl border p-4 transition-colors ${playing === i ? 'border-accent bg-accent/5' : 'border-line'}`} data-target={`shayari-${i}`}>
          <p className="font-hindi text-lg leading-loose text-ink whitespace-pre-line">{s.text}</p>
          <button
            onClick={() => toggle(i)}
            className="mt-2 inline-flex items-center gap-2 text-sm text-accent hover:brightness-125"
            aria-label={playing === i ? 'Stop' : 'Play shayari'}
          >
            <span className="w-7 h-7 rounded-full border border-accent grid place-items-center text-xs">{playing === i ? '◼' : '▶'}</span>
            {playing === i ? <Bars /> : 'listen'}
          </button>
        </article>
      ))}
    </div>
  );
}

function Bars() {
  return (
    <span className="inline-flex items-end gap-0.5 h-4" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="w-0.5 bg-accent eq-bar" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </span>
  );
}
