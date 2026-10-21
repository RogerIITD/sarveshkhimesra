'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { APPS, APP_BY_ID, BIO, FIRST_VISIT_APPS, WALLPAPER, type AppId } from '@/content/os';
import { PERSONAS, PERSONA_BY_ID, type Persona, type PersonaId } from '@/content/personas';
import { useGame } from '@/components/game/GameProvider';
import { track, type TrackEvent } from '@/lib/track';
import { AppBody } from './AppBody';
import { PersonaWipe } from './PersonaWipe';
import { useScramble } from './useScramble';
import { Wallpaper } from './Wallpaper';
import { SocialLinks } from '@/components/SocialLinks';
import { Window } from './Window';

type Via = Extract<TrackEvent, { name: 'app_open' }>['via'];
type Point = { x: number; y: number };
type Win = { id: AppId; x: number; y: number; z: number; max: boolean; openedAt: number; origin: Point };

const TOPBAR = 32;
const DOCK_ITEMS: AppId[] = ['about', 'shayari', 'maafi', 'sports', 'travel', 'camera', 'terminal', 'contact'];

const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;

/** Window position: slot 0 = left, slot 1 = right, anything else cascades. */
function placeWindow(id: AppId, slot: number, vw: number, vh: number): Point {
  const { w, h } = APP_BY_ID[id].size;
  const p = slot === 0 ? { x: 190, y: 24 } : slot === 1 ? { x: vw - w - 48, y: 24 } : { x: 220 + (slot % 6) * 36, y: 40 + (slot % 6) * 30 };
  return {
    x: Math.max(8, Math.min(p.x, vw - w - 8)),
    y: Math.max(8, Math.min(p.y, vh - TOPBAR - h - 96)),
  };
}

/** Centre of the app's dock icon in desktop-area coordinates (fallback origin). */
function dockOrigin(id: AppId): Point {
  const el = document.querySelector(`[data-target="dock-${id}"]`);
  const r = el?.getBoundingClientRect();
  return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 - TOPBAR } : { x: window.innerWidth / 2, y: window.innerHeight };
}

function fromElement(el: Element): Point {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 - TOPBAR };
}

export function SarveshOS({ onStory }: { onStory: () => void }) {
  const { emitter, turbo } = useGame();
  const [wins, setWins] = useState<Win[]>([]);
  const [mobileApp, setMobileApp] = useState<AppId | null>(null);
  const [persona, setPersona] = useState<Persona>(PERSONA_BY_ID.engineer);
  const [wipe, setWipe] = useState<{ to: Persona; origin: Point } | null>(null);
  const zTop = useRef(10);
  const area = useRef<HTMLDivElement>(null);

  const open = useCallback((id: AppId, via: Via, origin?: Point, slot?: number) => {
    track({ name: 'app_open', app: id, via });
    setWins((ws) => {
      const z = ++zTop.current;
      if (ws.some((w) => w.id === id)) return ws.map((w) => (w.id === id ? { ...w, z } : w));
      const { x, y } = placeWindow(id, slot ?? ws.length + 2, window.innerWidth, window.innerHeight);
      return [...ws, { id, x, y, z, max: false, openedAt: Date.now(), origin: origin ?? dockOrigin(id) }];
    });
  }, []);

  const close = useCallback((id: AppId) => {
    setWins((ws) => {
      const w = ws.find((v) => v.id === id);
      if (w) track({ name: 'app_close', app: id, seconds: Math.round((Date.now() - w.openedAt) / 1000) });
      return ws.filter((v) => v.id !== id);
    });
  }, []);

  const patch = (id: AppId, fn: (w: Win) => Partial<Win>) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, ...fn(w) } : w)));
  const focus = (id: AppId) => patch(id, () => ({ z: ++zTop.current }));

  const openMobile = (id: AppId, via: Via = 'mobile') => {
    setMobileApp(id);
    track({ name: 'app_open', app: id, via });
  };

  // ── persona switching ──
  const switchPersona = useCallback(
    (id: PersonaId, origin: Point) => {
      if (wipe || id === persona.id) return;
      track({ name: 'persona_switch', persona: id });
      setWipe({ to: PERSONA_BY_ID[id], origin });
    },
    [wipe, persona.id],
  );

  const applyPersona = (p: Persona) => {
    setPersona(p);
    if (!isDesktop()) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setWins(
      p.apps.map((id, slot) => {
        const { x, y } = placeWindow(id, slot, vw, vh);
        return { id, x, y, z: ++zTop.current, max: false, openedAt: Date.now(), origin: dockOrigin(id) };
      }),
    );
    p.apps.forEach((id) => track({ name: 'app_open', app: id, via: 'persona' }));
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', persona.accent);
  }, [persona]);

  // ── first windows + deep links ──
  useEffect(() => {
    const linked = new URLSearchParams(window.location.search).get('open') as AppId | null;
    const deep = linked && APP_BY_ID[linked] ? linked : null;
    if (isDesktop()) {
      FIRST_VISIT_APPS.forEach((id, slot) => open(id, 'auto', undefined, slot));
      if (deep) open(deep, 'link');
    } else if (deep) openMobile(deep, 'link');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ── terminal: `open <app>` and `persona <name>` ──
  useEffect(() => {
    const onEvent = (e: Event) => {
      const d = (e as CustomEvent).detail;
      if (d?.type === 'open-app') {
        const id = (d.app === 'camera-roll' ? 'camera' : d.app) as AppId;
        if (!APP_BY_ID[id]) return;
        if (isDesktop()) open(id, 'terminal');
        else openMobile(id, 'terminal');
      }
      if (d?.type === 'persona' && PERSONA_BY_ID[d.persona as PersonaId]) {
        switchPersona(d.persona, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
      }
    };
    emitter.addEventListener('game', onEvent);
    return () => emitter.removeEventListener('game', onEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emitter, open, switchPersona]);

  const topId = wins.reduce<Win | null>((a, w) => (!a || w.z > a.z ? w : a), null)?.id;

  return (
    <div className="fixed inset-0 overflow-hidden bg-bg text-ink">
      <div className={`absolute inset-0 transition-[filter] duration-700 ${turbo ? 'hue-rotate-180 saturate-150' : ''}`}>
        <Wallpaper persona={persona} />
      </div>

      {/* ───────────── desktop (md+) ───────────── */}
      <div className="hidden md:block absolute inset-0">
        <TopBar persona={persona} onOpen={(id, el) => open(id, 'icon', fromElement(el))} onPersona={switchPersona} onStory={onStory} />

        <div ref={area} className="absolute left-0 right-0 bottom-0" style={{ top: TOPBAR }}>
          <Welcome persona={persona} />

          <nav aria-label="Apps" className="absolute left-4 top-4 bottom-24 flex flex-col flex-wrap content-start gap-1">
            {APPS.map((a, i) => (
              <motion.button
                key={a.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => open(a.id, 'icon', fromElement(e.currentTarget))}
                data-target={`icon-${a.id}`}
                className="group w-[88px] flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-white/10 focus-visible:bg-white/10"
              >
                <AppGlyph id={a.id} size="lg" />
                <span className="font-mono text-[11px] text-ink/90 text-center leading-tight px-1 rounded group-hover:bg-accent/25 [text-shadow:0_1px_3px_rgb(0_0_0/0.9)]">
                  {a.label}
                </span>
              </motion.button>
            ))}
          </nav>

          <AnimatePresence>
            {wins.map((w) => (
              <Window
                key={w.id}
                app={APP_BY_ID[w.id]}
                x={w.x}
                y={w.y}
                z={w.z}
                origin={w.origin}
                focused={w.id === topId}
                maximized={w.max}
                bounds={area}
                onFocus={() => w.id !== topId && focus(w.id)}
                onClose={() => close(w.id)}
                onToggleMax={() => patch(w.id, (v) => ({ max: !v.max }))}
                onMove={(dx, dy) => patch(w.id, (v) => ({ x: v.x + dx, y: v.y + dy }))}
              >
                <AppBody id={w.id} />
              </Window>
            ))}
          </AnimatePresence>

          <nav aria-label="Dock" className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[900] flex items-end gap-1.5 px-2.5 py-2 rounded-2xl border border-line bg-panel/70 backdrop-blur-xl shadow-2xl">
            {DOCK_ITEMS.map((id) => {
              const isOpen = wins.some((w) => w.id === id);
              return (
                <button
                  key={id}
                  onClick={(e) => open(id, 'dock', fromElement(e.currentTarget))}
                  data-target={`dock-${id}`}
                  className="group relative flex flex-col items-center"
                  aria-label={APP_BY_ID[id].label}
                >
                  <span className="pointer-events-none absolute -top-8 whitespace-nowrap font-mono text-[11px] px-2 py-0.5 rounded bg-panel border border-line opacity-0 group-hover:opacity-100 transition-opacity">
                    {APP_BY_ID[id].label}
                  </span>
                  <span className="transition-transform duration-200 ease-out group-hover:-translate-y-2 group-hover:scale-[1.18]">
                    <AppGlyph id={id} size="md" />
                  </span>
                  <span className={`mt-1 w-1 h-1 rounded-full transition-colors ${isOpen ? 'bg-accent' : 'bg-transparent'}`} />
                </button>
              );
            })}
          </nav>

          {persona.wallpaper.kind === 'image' && persona.wallpaper.src === WALLPAPER.src && (
            <p className="absolute bottom-4 right-4 font-mono text-[10px] text-dim/70 max-w-[220px] text-right">wallpaper: {WALLPAPER.caption}</p>
          )}
          <p className="absolute bottom-4 left-4 font-mono text-[10px] text-dim/50">psst — move your cursor over the wallpaper</p>
        </div>
      </div>

      {/* ───────────── phone (< md) ───────────── */}
      <div className="md:hidden absolute inset-0 flex flex-col overflow-y-auto">
        <div className="flex justify-between px-5 pt-3 pb-2 font-mono text-xs text-ink/80">
          <Clock />
          <button onClick={onStory} className="text-accent">↺ story</button>
        </div>

        <button onClick={() => openMobile('about')} className="mx-4 mt-2 text-left rounded-3xl border border-line bg-panel/60 backdrop-blur-xl p-4 flex gap-4 items-center" data-target="m-widget-about">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0">
            <Image src={BIO.casual.src} alt="Sarvesh Khimesra" fill sizes="80px" className="object-cover object-[50%_25%]" priority />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold leading-tight">{BIO.name}</h1>
            <p className="text-xs text-accent mt-1 leading-snug">{BIO.title}</p>
          </div>
        </button>

        <SocialLinks where="os-mobile" size={20} className="flex gap-6 px-6 mt-4 text-ink/80" linkClassName="hover:text-accent" />
        <PersonaChips persona={persona} onPick={switchPersona} pillId="pill-mobile" className="px-4 mt-4 flex-wrap" />
        <p className={`px-5 mt-3 text-sm text-ink/80 ${persona.font === 'hindi' ? 'font-hindi' : ''}`}>{persona.sub}</p>

        <nav aria-label="Apps" className="grid grid-cols-4 gap-y-5 gap-x-2 px-4 pt-5 pb-32">
          {APPS.map((a) => (
            <button key={a.id} onClick={() => openMobile(a.id)} data-target={`m-icon-${a.id}`} className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
              <AppGlyph id={a.id} size="lg" />
              <span className="text-[11px] text-ink/90 text-center leading-tight [text-shadow:0_1px_3px_rgb(0_0_0/0.9)]">{a.label}</span>
            </button>
          ))}
        </nav>

        <nav aria-label="Dock" className="fixed bottom-4 left-4 right-4 flex justify-around py-3 rounded-3xl border border-line bg-panel/70 backdrop-blur-xl">
          {(['about', 'shayari', 'maafi', 'contact'] as AppId[]).map((id) => (
            <button key={id} onClick={() => openMobile(id)} aria-label={APP_BY_ID[id].label} data-target={`m-dock-${id}`}>
              <AppGlyph id={id} size="md" />
            </button>
          ))}
        </nav>

        <AnimatePresence>
          {mobileApp && (
            <motion.section
              key={mobileApp}
              role="dialog"
              aria-label={APP_BY_ID[mobileApp].title}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[950] bg-panel flex flex-col"
            >
              <header className="flex items-center gap-3 px-3 h-12 border-b border-line shrink-0">
                <button onClick={() => setMobileApp(null)} className="text-accent text-sm px-2 py-1">‹ home</button>
                <span className="font-mono text-xs text-dim truncate">{APP_BY_ID[mobileApp].title}</span>
              </header>
              <div className="flex-1 overflow-y-auto">
                <AppBody id={mobileApp} />
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {wipe && (
        <PersonaWipe
          key={wipe.to.id}
          persona={wipe.to}
          origin={wipe.origin}
          onCovered={() => applyPersona(wipe.to)}
          onDone={() => setWipe(null)}
        />
      )}
    </div>
  );
}

function Welcome({ persona }: { persona: Persona }) {
  const headline = useScramble(persona.headline, 700);
  const font = persona.font === 'hindi' ? 'font-hindi' : persona.font === 'mono' ? 'font-mono' : 'font-sans';
  // hidden on short screens, where the opening windows would cover it
  return (
    <div className="absolute right-10 bottom-28 text-right max-w-lg pointer-events-none select-none [@media(max-height:820px)]:hidden">
      <p className="font-mono text-xs text-accent mb-3 tracking-widest uppercase">
        {persona.glyph} ~/{persona.label}
      </p>
      <h1 className={`text-5xl font-semibold tracking-tight text-ink/95 ${font}`}>{headline}</h1>
      <p className="mt-3 text-base text-ink/70 leading-relaxed">{persona.sub}</p>
      <p className="mt-4 font-mono text-xs text-dim">switch sides in the menu bar ↑ · click any icon · drag windows</p>
    </div>
  );
}

function PersonaChips({ persona, onPick, pillId, className = '' }: { persona: Persona; onPick: (id: PersonaId, at: Point) => void; pillId: string; className?: string }) {
  return (
    <div role="radiogroup" aria-label="Show a side of Sarvesh" className={`flex gap-1 ${className}`}>
      {PERSONAS.map((p) => {
        const active = p.id === persona.id;
        return (
          <button
            key={p.id}
            role="radio"
            aria-checked={active}
            data-target={`persona-${p.id}`}
            onClick={(e) => onPick(p.id, { x: e.clientX, y: e.clientY })}
            className={`relative px-2.5 py-1 rounded-md font-mono text-[11px] whitespace-nowrap transition-colors ${active ? 'text-bg' : 'text-ink/75 hover:text-ink'}`}
          >
            {active && <motion.span layoutId={pillId} className="absolute inset-0 rounded-md bg-accent" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
            <span className="relative">
              {p.glyph} {p.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TopBar({ persona, onOpen, onPersona, onStory }: { persona: Persona; onOpen: (id: AppId, el: Element) => void; onPersona: (id: PersonaId, at: Point) => void; onStory: () => void }) {
  return (
    <header className="absolute top-0 inset-x-0 z-[950] h-8 flex items-center justify-between px-4 bg-panel/60 backdrop-blur-xl border-b border-line font-mono text-xs">
      <div className="flex items-center gap-5">
        <button onClick={onStory} className="font-semibold text-accent whitespace-nowrap" title="back to the story">◆ sarvesh-os</button>
        <button onClick={onStory} className="text-ink/80 hover:text-ink whitespace-nowrap">↺ story</button>
        {(['about', 'shayari', 'contact'] as AppId[]).map((id) => (
          <button key={id} onClick={(e) => onOpen(id, e.currentTarget)} className="hidden lg:inline text-ink/80 hover:text-ink">
            {id}
          </button>
        ))}
      </div>
      <PersonaChips persona={persona} onPick={onPersona} pillId="pill-desktop" />
      <div className="flex items-center gap-4 text-ink/80">
        <SocialLinks where="os-menubar" size={14} className="flex items-center gap-3" linkClassName="text-ink/70 hover:text-accent" />
        <span className="hidden xl:inline text-dim">bengaluru · building</span>
        <Clock />
      </div>
    </header>
  );
}

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(t);
  }, []);
  if (!now) return <span className="tabular-nums opacity-0">00:00</span>;
  return (
    <span className="tabular-nums">
      <span className="hidden lg:inline">{now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} </span>
      {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}
    </span>
  );
}

function AppGlyph({ id, size }: { id: AppId; size: 'md' | 'lg' }) {
  const a = APP_BY_ID[id];
  const box = size === 'lg' ? 'w-14 h-14 text-[26px] rounded-2xl' : 'w-11 h-11 text-xl rounded-xl';
  return (
    <span
      aria-hidden
      className={`${box} grid place-items-center shadow-lg shadow-black/40 border border-white/15`}
      style={{ background: `linear-gradient(145deg, ${a.tint}, ${a.tint}99)` }}
    >
      {a.icon === '>_' ? <span className="font-mono font-bold text-base text-white">&gt;_</span> : a.icon}
    </span>
  );
}
