'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { maafi, useMaafi } from '@/lib/maafi';

// Mini player that follows you around while Maafi is on, wherever you are on the site.
export function NowPlaying({ mode }: { mode: 'story' | 'os' }) {
  const { playing, time, duration, started } = useMaafi();
  const pct = duration ? (time / duration) * 100 : 0;
  // story: bottom-right on desktop (the social rail owns the left); phones: under the header, clear of the social pill
  // os: above the dock on phones, lifted above the wallpaper caption on desktop
  // (centred with a full-width flex row: framer owns `transform`, so translate classes would be overwritten)
  const where = mode === 'os' ? 'bottom-24 md:bottom-14 md:right-4' : 'top-16 md:top-auto md:bottom-6 md:right-6';
  return (
    <AnimatePresence>
      {started && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`fixed z-[950] inset-x-0 md:left-auto flex justify-center pointer-events-none cursor-auto ${where}`}
          data-target="now-playing"
        >
          <div className="pointer-events-auto relative flex items-center gap-3 pl-2 pr-1.5 py-1.5 rounded-full border border-white/15 bg-[#14100f]/85 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
            <span className={`w-7 h-7 rounded-full shrink-0 grid place-items-center bg-[conic-gradient(from_0deg,#ec4899,#f59e0b,#8b5cf6,#ec4899)] ${playing ? 'animate-spin-slow' : ''}`}>
              <span className="w-2 h-2 rounded-full bg-[#14100f]" />
            </span>
            <span className="font-mono text-[11px] leading-tight whitespace-nowrap">
              <span className="text-white/50">{playing ? 'now playing' : 'paused'}</span>
              <br />
              <span className="text-white">Maafi</span>
            </span>
            <button onClick={maafi.toggle} aria-label={playing ? 'Pause Maafi (mini player)' : 'Play Maafi (mini player)'} className="w-8 h-8 rounded-full bg-[#f47252] text-black grid place-items-center text-xs hover:brightness-110">
              {playing ? '❚❚' : '▶'}
            </button>
            <button onClick={maafi.stop} aria-label="Stop Maafi" className="w-7 h-7 rounded-full text-white/60 hover:text-white hover:bg-white/10 grid place-items-center text-xs">
              ✕
            </button>
            <span className="absolute left-0 bottom-0 h-[2px] bg-[#f47252]" style={{ width: `${pct}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
