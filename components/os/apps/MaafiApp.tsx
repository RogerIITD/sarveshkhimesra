'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { track } from '@/lib/track';

const MILESTONES = [25, 50, 75, 100] as const;

export function MaafiApp() {
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
    <div className="p-5 flex flex-col gap-5 h-full" data-target="song-player">
      <div className="flex items-center gap-4">
        <div className={`w-20 h-20 rounded-full shrink-0 grid place-items-center bg-[conic-gradient(from_0deg,#ec4899,#f59e0b,#8b5cf6,#ec4899)] ${playing ? 'animate-spin-slow' : ''}`}>
          <div className="w-6 h-6 rounded-full bg-panel border border-line" />
        </div>
        <div className="min-w-0">
          <p className="text-xl font-semibold text-ink">Maafi</p>
          <p className="text-sm text-dim">written &amp; sung by Sarvesh Khimesra</p>
          <p className="text-xs text-dim/70 mt-1 font-mono">no autotune was harmed. some was used.</p>
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
