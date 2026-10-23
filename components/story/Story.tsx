'use client';

import Image from 'next/image';
import { easeInOut, motion, useMotionValueEvent, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { BIO, HERO, PEOPLE, SPORTS, TRAVEL, type AppId } from '@/content/os';
import { NAZM } from '@/content/secret-shayari';
import { BOOT_LINES } from '@/content/personas';
import { MaafiApp } from '@/components/os/apps/MaafiApp';
import { useScramble } from '@/components/os/useScramble';
import { Media } from '@/components/os/Media';
import { track } from '@/lib/track';
import { BouncingBalls } from '@/components/BouncingBalls';
import { Chapter } from './Chapter';
import { Book } from './Book';
import { People } from './People';
import { Reveal, Words } from './Words';

export const CHAPTERS = [
  { id: 'hello', label: '00 hello' },
  { id: 'engineer', label: '01 engineer' },
  { id: 'poet', label: '02 poet' },
  { id: 'athlete', label: '03 athlete' },
  { id: 'traveller', label: '04 traveller' },
  { id: 'people', label: '05 my people' },
  { id: 'boot', label: '06 sarvesh-os' },
] as const;

type Props = { onActive: (id: string) => void; onEnterOS: () => void; onOpenApp: (id: AppId) => void };

export function Story({ onActive, onEnterOS, onOpenApp }: Props) {
  // A chapter is "active" once its wipe is mostly done and it hasn't scrolled away.
  const state = useRef<Record<string, { entered: boolean; done: boolean }>>({});
  const seen = useRef(new Set<string>());
  const report = (id: string, entered: boolean, done: boolean) => {
    state.current[id] = { entered, done };
    const active = [...CHAPTERS].reverse().find((c) => state.current[c.id]?.entered && !state.current[c.id]?.done) ?? CHAPTERS[0];
    onActive(active.id);
    if (!seen.current.has(active.id)) {
      seen.current.add(active.id);
      track({ name: 'story_chapter', chapter: active.id });
    }
  };

  return (
    <div>
      <Chapter id="hello" screens={2} enter="none" background="#07080b" accent="251 191 36" z={1} onProgress={report}>
        {(p) => <Hello p={p} />}
      </Chapter>
      <Chapter id="engineer" screens={4} enter="pill" background="#0b0d12" accent="251 191 36" z={2} onProgress={report}>
        {(p) => <Engineer p={p} />}
      </Chapter>
      <Chapter id="poet" screens={7} enter="circle" background="#120b09" accent="244 114 82" z={3} className="cursor-pen" onProgress={report}>
        {(p) => <Poet p={p} onMore={() => onOpenApp('shayari')} />}
      </Chapter>
      <Chapter id="athlete" screens={4} enter="pill" background="#0a1a14" accent="190 242 100" z={4} className="cursor-racquet" onProgress={report}>
        {(p) => <Athlete p={p} />}
      </Chapter>
      <Chapter id="traveller" screens={5} enter="circle" background="#08121b" accent="125 211 252" z={5} className="cursor-plane" onProgress={report}>
        {(p) => <Traveller p={p} />}
      </Chapter>
      <Chapter id="people" screens={5} enter="pill" background="#120e0a" accent="251 191 36" z={6} onProgress={report}>
        {(p) => <People p={p} />}
      </Chapter>
      <Chapter id="boot" screens={2} enter="circle" background="#050608" accent="52 211 153" z={7} last onProgress={report}>
        {(p) => <Boot p={p} onEnterOS={onEnterOS} />}
      </Chapter>
    </div>
  );
}

function Kicker({ n, label }: { n: string; label: string }) {
  return (
    <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">
      {n} — {label}
    </p>
  );
}

/* ── 00 hello ─────────────────────────────────────────── */
function Hello({ p }: { p: MotionValue<number> }) {
  const name = useScramble(BIO.name, 900);
  const scale = useTransform(p, [0, 1], [1.04, 1]);
  const fade = useTransform(p, [0, 0.6], [1, 0]);
  const lift = useTransform(p, [0, 0.6], [0, -80]);
  return (
    <>
      {/* Full-bleed on phones; anchored right on desktop so the silhouette isn't under the name. Opens as a rising pill. */}
      <motion.div
        className="absolute inset-0 md:left-[28%]"
        style={{ scale }}
        initial={{ clipPath: 'inset(100% 12% 0% 12% round 480px 480px 0px 0px)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)' }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      >
        <Image src={HERO.src} alt={HERO.alt} fill priority sizes="(max-width: 768px) 100vw, 72vw" className="object-cover object-[50%_15%] opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07080b]/30 to-[#07080b] md:hidden" />
        <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-[#07080b] via-[#07080b]/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 hidden md:block bg-gradient-to-t from-[#07080b] to-transparent" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent" />
      </motion.div>
      <motion.div
        style={{ opacity: fade, y: lift }}
        className="relative h-full flex flex-col justify-end pb-20 md:pb-0 md:justify-center px-6 md:px-16 max-w-6xl mx-auto"
      >
        <motion.div
          initial={{ clipPath: 'inset(50% 50% 50% 50% round 999px)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0% round 999px)' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
          className="relative hidden md:block w-28 h-28 mb-8 rounded-full overflow-hidden border border-white/20"
        >
          <Image src={BIO.headshot.src} alt="Sarvesh Khimesra" fill sizes="112px" className="object-cover object-[50%_25%]" priority />
        </motion.div>
        <p className="font-mono text-xs md:text-sm text-accent mb-4">&gt; whoami</p>
        <h1 className="text-5xl md:text-8xl font-semibold tracking-tight text-ink leading-[0.95] [text-shadow:0_2px_24px_rgb(0_0_0/0.55)]">{name}</h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-16 font-mono text-xs text-dim flex items-center gap-3"
        >
          <span className="inline-block w-px h-8 bg-gradient-to-b from-accent to-transparent animate-pulse" /> scroll — five sides, one person
        </motion.p>
      </motion.div>
    </>
  );
}

/* ── 01 engineer ──────────────────────────────────────── */
const PILLARS = [
  {
    t: 'Business transformation',
    d: 'Find the workflows that actually move the company, and rebuild them around AI — not bolt it on.',
  },
  {
    t: 'Process excellence',
    d: 'Measure, simplify, then automate. In that order. Always in that order.',
  },
  {
    t: 'AI strategy',
    d: 'Decide where AI earns its keep — and, just as important, where it doesn’t.',
  },
];

function Engineer({ p }: { p: MotionValue<number> }) {
  return (
    <div className="relative h-full">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgb(var(--accent)/0.10),transparent_55%)]" />
      <div className="relative h-full flex flex-col justify-center pt-16 pb-6 md:py-0 px-6 md:px-16 max-w-6xl mx-auto">
        <Kicker n="01" label="at work" />
        <Words
          text="I work in the COO's office at Razorpay, redesigning how a company runs — with AI."
          progress={p}
          from={0}
          to={0.35}
          className="mt-4 md:mt-6 text-[26px] sm:text-3xl md:text-6xl [@media(max-height:640px)]:text-[22px] font-semibold tracking-tight leading-[1.15] md:leading-[1.1] text-ink max-w-5xl"
        />
        <div className="mt-6 md:mt-12 grid gap-3 md:gap-4 md:grid-cols-3">
          {PILLARS.map((x, i) => (
            <Reveal key={x.t} progress={p} at={[0.35 + i * 0.1, 0.5 + i * 0.1]} y={40}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur p-4 md:p-5">
                <p className="font-mono text-[11px] text-accent">0{i + 1}</p>
                <p className="mt-1 md:mt-2 text-base md:text-xl text-ink font-medium">{x.t}</p>
                <p className="mt-1 md:mt-2 text-xs md:text-sm text-dim leading-relaxed [@media(max-height:640px)]:hidden">{x.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 02 poet ──────────────────────────────────────────── */
// Three acts on one pinned screen: the notebook of recorded couplets, the nazm
// on a page of its own, then the song gets the whole stage.
function Poet({ p, onMore }: { p: MotionValue<number>; onMore: () => void }) {
  const bookOpacity = useTransform(p, [0.3, 0.36], [1, 0]);
  const bookY = useTransform(p, [0.3, 0.36], [0, -80]);
  const bookEvents = useTransform(p, (v) => (v < 0.33 ? 'auto' : 'none'));
  const nazmOpacity = useTransform(p, [0.34, 0.4, 0.56, 0.61], [0, 1, 1, 0]);
  const nazmY = useTransform(p, [0.34, 0.4, 0.56, 0.61], [60, 0, 0, -80]);
  const nazmEvents = useTransform(p, (v) => (v > 0.38 && v < 0.58 ? 'auto' : 'none'));
  const songEvents = useTransform(p, (v) => (v > 0.68 ? 'auto' : 'none'));
  const glow = useTransform(p, [0.64, 0.78], [0, 1]);
  // keep the song's (blurred) words fully off stage until the nazm has left
  const songOpacity = useTransform(p, [0.6, 0.64], [0, 1]);
  return (
    <div className="relative h-full">
      <motion.div style={{ opacity: bookOpacity, y: bookY, pointerEvents: bookEvents }} className="absolute inset-0 flex flex-col justify-center pt-16 pb-6 md:py-0 px-6 md:px-16 max-w-6xl mx-auto">
        <Kicker n="02" label="the shayar" />
        <Reveal progress={p} at={[0, 0.08]}>
          <p className="mt-4 md:mt-6 font-hindi text-5xl md:text-7xl [@media(max-height:640px)]:text-4xl leading-[1.25] text-ink">सर्वेश</p>
        </Reveal>
        <Book p={p} className="mt-4 md:mt-6" />
      </motion.div>
      <motion.div style={{ opacity: nazmOpacity, y: nazmY, pointerEvents: nazmEvents }} className="absolute inset-0 flex flex-col justify-center pt-16 pb-20 md:py-0 px-6 md:px-16 max-w-6xl mx-auto">
        <Kicker n="02" label="a nazm" />
        <div className="relative mt-4 md:mt-6 max-w-3xl md:w-fit">
          <div className="absolute -inset-2 md:-inset-3 rounded-xl bg-[#3b1d14] shadow-[0_30px_60px_-15px_rgb(0_0_0/0.8)]" />
          <div className="relative rounded-md bg-[#f1e6d2] text-[#2b1b13] bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_35px,rgb(43_27_19/0.07)_36px)] p-5 sm:p-7 md:p-10 [@media(max-height:640px)]:p-4">
            <p className="font-hindi text-3xl md:text-4xl [@media(max-height:640px)]:text-2xl text-[#b4533a] leading-[1.4]">{NAZM.title}</p>
            <div className="mt-3 md:mt-5 space-y-2 md:space-y-2.5 [@media(max-height:640px)]:space-y-1">
              {NAZM.lines.map((l, i) => (
                <Reveal key={l} progress={p} at={[0.38 + i * 0.02, 0.42 + i * 0.02]} y={12}>
                  {/* phones: each line breaks at its comma so "मेरे दोस्तों" never dangles alone */}
                  <p className="font-hindi text-[15px] sm:text-lg md:text-xl lg:text-2xl [@media(max-height:640px)]:text-sm leading-[1.5] sm:leading-[1.6]">
                    {l.split(/(?<=,) /).map((part) => (
                      <span key={part} className="block sm:inline">
                        {part}{' '}
                      </span>
                    ))}
                  </p>
                </Reveal>
              ))}
            </div>
            <p className="mt-3 md:mt-5 text-right font-hindi text-sm md:text-base text-[#2b1b13]/50 italic [@media(max-height:640px)]:hidden">~ स.</p>
          </div>
        </div>
        <Reveal progress={p} at={[0.5, 0.54]} className="mt-6 md:mt-8 [@media(max-height:640px)]:mt-4">
          <button
            onClick={onMore}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-accent text-accent hover:bg-accent/10 font-mono text-xs md:text-sm"
            data-target="story-more-shayari"
          >
            more shayaris on my desktop →
          </button>
        </Reveal>
      </motion.div>
      <motion.div style={{ pointerEvents: songEvents, opacity: songOpacity }} className="absolute inset-0 flex flex-col justify-center pt-16 pb-6 md:py-0 px-6 md:px-16 max-w-6xl mx-auto">
        <motion.div style={{ opacity: glow }} className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[70vmin] h-[70vmin] rounded-full bg-[radial-gradient(circle,rgb(236_72_153/0.12),transparent_65%)] pointer-events-none" />
        <Reveal progress={p} at={[0.64, 0.74]}>
          <Kicker n="02" label="the songwriter" />
        </Reveal>
        <Words
          text="And sometimes the lines refuse to stay on paper."
          progress={p}
          from={0.64}
          to={0.8}
          className="mt-4 md:mt-6 text-2xl md:text-5xl [@media(max-height:640px)]:text-xl font-semibold tracking-tight leading-[1.15] text-ink max-w-3xl"
        />
        <Reveal progress={p} at={[0.74, 0.88]} y={40} className="mt-8 md:mt-14 max-w-3xl">
          <MaafiApp big />
        </Reveal>
      </motion.div>
    </div>
  );
}

/* ── 03 athlete ───────────────────────────────────────── */
const COURT = ['M0 0 H1097 V2377 H0 Z', 'M137 0 V2377', 'M960 0 V2377', 'M137 548 H960', 'M137 1829 H960', 'M548 548 V1829', 'M-40 1188 H1137'];

// squash → cricket → the wall → tennis on top, dealt onto the court one by one
const DECK = [SPORTS[2].photos[0], SPORTS[3].photos[0], SPORTS[0].photos[0], SPORTS[1].photos[0]];
const TILT = [-9, -2, 5, 10];
const NUDGE = [
  [-36, 12],
  [-12, -8],
  [14, 10],
  [32, -4],
];

function Athlete({ p }: { p: MotionValue<number> }) {
  const draw = useTransform(p, [0, 0.45], [0, 1]);
  return (
    <div className="relative h-full">
      <svg
        viewBox="-60 -40 1217 2457"
        className="absolute left-1/2 top-[6%] h-[150%] -translate-x-1/2 [transform:translateX(-50%)_perspective(1400px)_rotateX(58deg)] origin-top text-accent/30"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
      >
        {COURT.map((d) => (
          <motion.path key={d} d={d} style={{ pathLength: draw }} />
        ))}
      </svg>
      <BouncingBalls className="opacity-70" />
      <div className="relative h-full flex flex-col md:flex-row md:items-center gap-5 md:gap-8 pt-14 md:pt-0 px-6 md:px-16 max-w-6xl mx-auto justify-center">
        <div className="md:flex-1">
          <Kicker n="03" label="on court" />
          <div className="mt-6 space-y-1">
            {['Tennis.', 'Squash.', 'Cricket.'].map((w, i) => (
              <Reveal key={w} progress={p} at={[0.1 + i * 0.12, 0.22 + i * 0.12]} x={-40} y={0}>
                <p className="text-4xl md:text-8xl font-semibold tracking-tight text-ink leading-none italic">{w}</p>
              </Reveal>
            ))}
          </div>
          <Reveal progress={p} at={[0.42, 0.55]}>
            <p className="mt-4 md:mt-6 text-base md:text-xl text-ink/70 max-w-md">
              RCB forever — yes, still. And a wall of CR7, Kohli and Kobe that keeps me honest.
            </p>
          </Reveal>
        </div>
        <div className="relative w-40 h-60 md:w-72 md:h-[26rem] shrink-0 self-center md:mr-10">
          {DECK.map((ph, i) => (
            <Reveal key={ph.src} progress={p} at={[0.28 + i * 0.1, 0.42 + i * 0.1]} x={120} y={30} className="absolute inset-0">
              <div
                className="relative w-full h-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl shadow-black/60"
                style={{ transform: `rotate(${TILT[i]}deg) translate(${NUDGE[i][0]}px, ${NUDGE[i][1]}px)` }}
              >
                <Image src={ph.src} alt={ph.alt} fill sizes="300px" className="object-cover object-[40%_50%]" />
                <p
                  className={`absolute inset-x-0 bottom-0 p-3 pt-10 text-[11px] md:text-xs text-white/90 leading-snug bg-gradient-to-t from-black/85 to-transparent ${i < DECK.length - 1 ? 'hidden' : ''}`}
                >
                  {ph.caption}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 04 traveller ─────────────────────────────────────── */
// Ireland first, then a few India trips (the people shots live in "my people")
const IN_PEOPLE = new Set(PEOPLE.map((x) => x.photo.src));
const STRIP = [...TRAVEL[1].photos, ...TRAVEL[0].photos].filter((ph) => !IN_PEOPLE.has(ph.src));

function Traveller({ p }: { p: MotionValue<number> }) {
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  useEffect(() => {
    const measure = () => setDistance(Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth + 48));
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  // sprung so the strip glides instead of tracking the wheel 1:1; eased with a short
  // hold at each end so it gathers speed gently and settles before the next chapter
  const smooth = useSpring(p, { stiffness: 120, damping: 30, mass: 0.6 });
  const x = useTransform(smooth, [0.14, 0.88], [0, -distance], { ease: easeInOut });
  return (
    <div className="relative h-full flex flex-col justify-center pt-14 md:pt-0">
      <div className="px-6 md:px-16">
        <Kicker n="04" label="out of office" />
        <Words
          text="I don't travel to escape. I travel to find what I'm here for."
          progress={p}
          from={0}
          to={0.12}
          className="mt-4 text-[26px] sm:text-3xl md:text-5xl [@media(max-height:640px)]:text-xl font-semibold tracking-tight leading-[1.15] text-ink max-w-4xl"
        />
      </div>
      {/* edges fade so photos (and captions) don't collide with the social rail as they slide */}
      <div className="mt-10 [@media(max-height:760px)]:mt-6 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <motion.div ref={track} style={{ x }} className="flex gap-5 pl-6 md:pl-16 w-max">
          {STRIP.map((ph, i) => (
            <figure key={ph.src} className={`w-56 md:w-72 [@media(max-height:760px)]:w-44 md:[@media(max-height:760px)]:w-56 shrink-0 ${i % 2 ? 'mt-10 [@media(max-height:760px)]:mt-6' : ''}`}>
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-white/10">
                <Media item={ph} sizes="300px" />
              </div>
              <figcaption className="mt-2 text-sm text-dim leading-snug">{ph.caption}</figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ── 05 boot ──────────────────────────────────────────── */
function Boot({ p, onEnterOS }: { p: MotionValue<number>; onEnterOS: () => void }) {
  const [lines, setLines] = useState(0);
  const fired = useRef(false);
  useMotionValueEvent(p, 'change', (v) => {
    setLines(Math.min(BOOT_LINES.length + 1, Math.floor(v * (BOOT_LINES.length + 2) * 1.15)));
    if (v > 0.97 && !fired.current) {
      fired.current = true;
      onEnterOS();
    }
  });
  return (
    <div className="h-full flex items-center justify-center px-6 pt-14 md:pt-0 font-mono">
      <div className="w-full max-w-2xl">
        <Kicker n="06" label="sarvesh-os" />
        <div className="mt-6 space-y-1.5 text-sm md:text-base text-dim min-h-[180px]">
          {BOOT_LINES.slice(0, lines).map((l) => (
            <p key={l}>
              {l.startsWith('[ ok ]') ? (
                <>
                  <span className="text-accent">[ ok ]</span>
                  {l.slice(6)}
                </>
              ) : (
                <span className="text-ink">{l}</span>
              )}
            </p>
          ))}
          {lines > BOOT_LINES.length && (
            <p className="text-ink text-2xl md:text-4xl mt-6">
              &gt; entering the desktop
              <span className="caret inline-block w-3 h-7 bg-accent align-middle ml-2" />
            </p>
          )}
        </div>
        <button onClick={onEnterOS} className="mt-10 px-5 py-3 rounded-xl border border-accent text-accent hover:bg-accent/10 text-sm">
          enter the desktop now →
        </button>
        <p className="mt-4 text-xs text-dim/60">keep scrolling and it boots on its own.</p>
      </div>
    </div>
  );
}
