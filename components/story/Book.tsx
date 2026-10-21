'use client';

import { motion, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { NAZM, SHAYARI } from '@/content/secret-shayari';
import { track } from '@/lib/track';
import { maafi } from '@/lib/maafi';

// Pages: the three recorded couplets, then the nazm over two pages (no recording yet).
const PAGES: { text: string; audio?: string; note?: string }[] = [
  ...SHAYARI,
  { text: NAZM.lines.slice(0, 3).join('\n'), note: `${NAZM.title} — i` },
  { text: NAZM.lines.slice(3).join('\n'), note: `${NAZM.title} — ii` },
];
// Scroll windows in which each page turns, spread evenly; the last page never turns.
const TURN_SPAN = 0.44 / (PAGES.length - 1);
const FLIPS: [number, number][] = PAGES.slice(1).map((_, i) => [0.08 + i * TURN_SPAN, 0.08 + i * TURN_SPAN + TURN_SPAN * 0.8]);
const NUMERALS = ['१', '२', '३', '४', '५', '६'];
const PAPER = 'bg-[#f1e6d2] text-[#2b1b13]';
const RULED = 'bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_35px,rgb(43_27_19/0.07)_36px)]';

// An open notebook: the left page is fixed, each couplet sits on a right-hand
// page that folds over the spine as you scroll. Phones get a single page.
export function Book({ p, className = '' }: { p: MotionValue<number>; className?: string }) {
  const [current, setCurrent] = useState(0);
  useMotionValueEvent(p, 'change', (v) => setCurrent(FLIPS.filter(([a, b]) => v > (a + b) / 2).length));

  const [playing, setPlaying] = useState<number | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  useEffect(() => () => audio.current?.pause(), []);
  // turning the page stops the reading
  useEffect(() => {
    if (playing !== null && playing !== current) {
      audio.current?.pause();
      setPlaying(null);
    }
  }, [current, playing]);
  const toggle = (i: number) => {
    audio.current?.pause();
    if (playing === i) return setPlaying(null);
    maafi.pause(); // one voice at a time; the mini player can resume the song
    const a = new Audio(PAGES[i].audio);
    audio.current = a;
    a.onended = () => setPlaying(null);
    a.play()
      .then(() => track({ name: 'audio_play', track: `shayari-${i + 1}` }))
      .catch(() => setPlaying(null));
    setPlaying(i);
  };

  return (
    <div className={`relative w-full max-w-5xl ${className}`}>
      {/* cover + page block peeking out under the paper */}
      <div className="absolute -inset-2 md:-inset-3 rounded-xl bg-[#3b1d14] shadow-[0_30px_60px_-15px_rgb(0_0_0/0.8)]" />
      <div className="absolute inset-y-1 -right-1 left-1 md:left-1/2 rounded-r-md bg-[#d9ccb4]" />
      <div className="absolute inset-y-1 -left-1 right-1/2 rounded-l-md bg-[#d9ccb4] hidden md:block" />

      <div className="relative h-[300px] md:h-[clamp(300px,46vh,420px)] [@media(max-height:640px)]:h-[250px] [perspective:2000px]">
        {/* left page (desktop) */}
        <div className={`absolute inset-y-0 left-0 w-1/2 rounded-l-md hidden md:flex flex-col justify-between p-8 lg:p-10 ${PAPER} ${RULED}`}>
          <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/15 to-transparent" />
          <div>
            <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-[#b4533a]">from the notebook</p>
            <p className="mt-4 text-xl lg:text-2xl leading-snug font-medium">Lines I wrote down, then read out loud.</p>
          </div>
          <p className="font-mono text-xs text-[#2b1b13]/60">scroll to turn the page →</p>
        </div>

        {PAGES.map((s, i) => (
          <Leaf key={i} i={i} p={p} live={current === i}>
            <div className="h-full flex flex-col justify-between">
              <div className="space-y-2">
                {s.text.split('\n').map((l) => (
                  <p
                    key={l}
                    className={`font-hindi ${
                      s.audio
                        ? 'text-xl md:text-xl lg:text-[26px] [@media(max-height:640px)]:text-lg leading-[1.7]'
                        : 'text-lg lg:text-xl [@media(max-height:640px)]:text-sm leading-[1.6]'
                    }`}
                  >
                    {l}
                  </p>
                ))}
              </div>
              <div className="flex items-end justify-between">
                {s.audio ? (
                  <button
                    onClick={() => toggle(i)}
                    className="inline-flex items-center gap-2.5 sm:gap-3 text-[#b4533a] font-mono text-xs sm:text-sm whitespace-nowrap"
                    data-target={`story-shayari-${i}`}
                  >
                    <span className="w-10 h-10 rounded-full border border-[#b4533a] grid place-items-center">{playing === i ? '◼' : '▶'}</span>
                    {playing === i ? 'playing…' : 'hear it in my voice'}
                  </button>
                ) : (
                  <span className="font-hindi text-sm text-[#b4533a]">{s.note}</span>
                )}
                <span className="font-mono text-xs text-[#2b1b13]/50 whitespace-nowrap">
                  {i + 1} / {PAGES.length}
                </span>
              </div>
            </div>
          </Leaf>
        ))}
      </div>
    </div>
  );
}

function Leaf({ i, p, live, children }: { i: number; p: MotionValue<number>; live: boolean; children: React.ReactNode }) {
  const flip = FLIPS[i];
  const rotateY = useTransform(p, flip ?? [0, 1], flip ? [0, -180] : [0, 0]);
  // a turned page lands on top of the ones turned before it
  const zIndex = useTransform(rotateY, (r) => (r < -90 ? 20 + i : 10 - i));
  const frontShade = useTransform(rotateY, [0, -90], [0, 0.35]);
  const backShade = useTransform(rotateY, [-90, -180], [0.35, 0]);

  return (
    <motion.div
      style={{ rotateY, zIndex, pointerEvents: live ? 'auto' : 'none' }}
      className="absolute inset-y-0 right-0 w-full md:w-1/2 origin-left [transform-style:preserve-3d]"
      aria-hidden={!live}
    >
      <div className={`absolute inset-0 rounded-md md:rounded-l-none [backface-visibility:hidden] p-5 sm:p-6 md:p-8 lg:p-10 ${PAPER} ${RULED}`}>
        <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/15 to-transparent pointer-events-none" />
        <div className="relative h-full">{children}</div>
        <motion.div style={{ opacity: frontShade }} className="absolute inset-0 rounded-[inherit] bg-black pointer-events-none" />
      </div>
      {flip && (
        <div
          className={`absolute inset-0 rounded-l-md hidden md:flex flex-col items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] ${PAPER} ${RULED}`}
        >
          <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/15 to-transparent" />
          <p className="font-hindi text-8xl text-[#b4533a]/25">{NUMERALS[i]}</p>
          <p className="mt-2 font-hindi text-2xl text-[#2b1b13]/50 italic">~ स.</p>
          <motion.div style={{ opacity: backShade }} className="absolute inset-0 rounded-[inherit] bg-black pointer-events-none" />
        </div>
      )}
    </motion.div>
  );
}
