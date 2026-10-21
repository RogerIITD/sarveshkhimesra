'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { track } from '@/lib/track';

const MILESTONES = [25, 50, 75, 100] as const;

/** `big` is the full-stage version used in the story's songwriter moment. */
export function MaafiApp({ big = false }: { big?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  const bar = useRef<HTMLDivElement | null>(null);
  const reached = useRef(new Set<number>());

  useEffect(() => {
    const a = new Audio('/audio/song.mp3');
    a.preload = 'metadata';
    audio.current = a;
    const onMeta = () => setDuration(a.duration);
    const onTime = () => {
      setTime(a.currentTime);
      if (!a.duration) return;
      const pct = (a.currentTime / a.duration) * 100;
      for (const m of MILESTONES) {
        if (pct >= m - 0.5 && !reached.current.has(m)) {
          reached.current.add(m);
          track({ name: 'audio_progress', track: 'maafi', pct: m });
        }
      }
    };
    const onEnd = () => setPlaying(false);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('ended', onEnd);
    return () => {
      a.pause();
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('ended', onEnd);
      a.src = '';
    };
  }, []);

  const toggle = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      void a.play();
      setPlaying(true);
      track({ name: 'audio_play', track: 'maafi' });
    }
  }, [playing]);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audio.current || !bar.current || !duration) return;
    const r = bar.current.getBoundingClientRect();
    audio.current.currentTime = ((e.clientX - r.left) / r.width) * duration;
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const pct = duration ? (time / duration) * 100 : 0;

  return (
    <div className={`flex flex-col h-full ${big ? 'gap-8' : 'p-5 gap-5'}`} data-target="song-player">
      <div className={`flex items-center ${big ? 'gap-6 md:gap-10' : 'gap-4'}`}>
        <div
          className={`rounded-full shrink-0 grid place-items-center bg-[conic-gradient(from_0deg,#ec4899,#f59e0b,#8b5cf6,#ec4899)] ${
            big ? 'w-28 h-28 md:w-48 md:h-48 [@media(max-height:640px)]:w-24 [@media(max-height:640px)]:h-24 shadow-[0_0_80px_-10px_rgb(236_72_153/0.5)]' : 'w-20 h-20'
          } ${playing ? 'animate-spin-slow' : ''}`}
        >
          <div className={`rounded-full bg-panel border border-line ${big ? 'w-8 h-8 md:w-12 md:h-12' : 'w-6 h-6'}`} />
        </div>
        <div className="min-w-0">
          <p className={`font-semibold text-ink ${big ? 'text-4xl md:text-7xl tracking-tight' : 'text-xl'}`}>Maafi</p>
          <p className={`text-dim ${big ? 'mt-2 text-base md:text-xl' : 'text-sm'}`}>written &amp; sung by Sarvesh Khimesra</p>
          <p className={`text-dim/70 mt-1 font-mono ${big ? 'text-xs md:text-sm' : 'text-xs'}`}>no autotune was harmed. some was used.</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={toggle} aria-label={playing ? 'Pause Maafi' : 'Play Maafi'} className="w-11 h-11 rounded-full bg-accent text-bg grid place-items-center text-lg hover:brightness-110 shrink-0">
          {playing ? '❚❚' : '▶'}
        </button>
        <span className="font-mono text-xs text-dim tabular-nums w-9">{fmt(time)}</span>
        <div ref={bar} onClick={seek} className="flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer">
          <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <span className="font-mono text-xs text-dim tabular-nums w-9">{fmt(duration)}</span>
      </div>
    </div>
  );
}
