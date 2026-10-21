'use client';

import { useSyncExternalStore } from 'react';
import { track } from '@/lib/track';

// One Maafi player for the whole site, so the song keeps going while you
// scroll to other chapters, enter the desktop or close the window.
// It only stops when someone pauses or stops it.
type State = { playing: boolean; time: number; duration: number; started: boolean };

const MILESTONES = [25, 50, 75, 100] as const;
const SERVER: State = { playing: false, time: 0, duration: 0, started: false };
let state: State = SERVER;
let audio: HTMLAudioElement | null = null;
const reached = new Set<number>();
const listeners = new Set<() => void>();

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function el() {
  if (audio) return audio;
  const a = new Audio('/audio/song.mp3');
  a.preload = 'metadata';
  a.addEventListener('loadedmetadata', () => set({ duration: a.duration }));
  a.addEventListener('play', () => set({ playing: true, started: true }));
  a.addEventListener('pause', () => set({ playing: false }));
  a.addEventListener('ended', () => set({ playing: false, started: false, time: 0 }));
  a.addEventListener('timeupdate', () => {
    set({ time: a.currentTime });
    if (!a.duration) return;
    const pct = (a.currentTime / a.duration) * 100;
    for (const m of MILESTONES) {
      if (pct >= m - 0.5 && !reached.has(m)) {
        reached.add(m);
        track({ name: 'audio_progress', track: 'maafi', pct: m });
      }
    }
  });
  audio = a;
  return a;
}

export const maafi = {
  /** load metadata so the player can show the duration */
  prepare: () => void el(),
  toggle() {
    const a = el();
    if (a.paused) {
      void a.play();
      track({ name: 'audio_play', track: 'maafi' });
    } else a.pause();
  },
  pause: () => audio?.pause(),
  /** pause and rewind; hides the mini player */
  stop() {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    set({ started: false, time: 0 });
  },
  seek(fraction: number) {
    const a = el();
    if (a.duration) a.currentTime = fraction * a.duration;
  },
};

export function useMaafi() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => SERVER,
  );
}
