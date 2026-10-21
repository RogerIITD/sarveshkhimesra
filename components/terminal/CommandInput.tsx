'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useGame } from '@/components/game/GameProvider';
import { runCommand, type CommandOutput } from '@/components/game/commands';
import { BIO, SOCIALS, SPORTS, TRAVEL } from '@/content/os';
import { track } from '@/lib/track';

const ShayariApp = dynamic(() => import('@/components/os/apps/ShayariApp').then((m) => m.ShayariApp), { ssr: false });
const MaafiApp = dynamic(() => import('@/components/os/apps/MaafiApp').then((m) => m.MaafiApp), { ssr: false });
const PhotoApp = dynamic(() => import('@/components/os/apps/PhotoApp').then((m) => m.PhotoApp), { ssr: false });

type Entry = { id: number; input: string; output: CommandOutput };

function ComponentSlot({ kind }: { kind: string }) {
  if (kind === 'shayari') return <ShayariApp />;
  if (kind === 'song:maafi') return <MaafiApp />;
  if (kind === 'gallery:travel') return <PhotoApp tabs={TRAVEL} />;
  if (kind === 'gallery:travel-india') return <PhotoApp tabs={TRAVEL.filter((t) => t.tab === 'india')} />;
  if (kind === 'gallery:travel-ireland') return <PhotoApp tabs={TRAVEL.filter((t) => t.tab === 'ireland')} />;
  if (kind === 'gallery:sports') return <PhotoApp tabs={SPORTS} />;
  if (kind === 'whoami') return <pre className="text-ink/90">{`${BIO.name.toLowerCase()} · ${BIO.title.toLowerCase()}`}</pre>;
  if (kind === 'about') return <div className="space-y-2 text-ink/90 text-sm">{BIO.lines.map((l) => <p key={l}>{l}</p>)}</div>;
  if (kind === 'contact')
    return (
      <ul className="text-sm space-y-1">
        {SOCIALS.map((s) => (
          <li key={s.id}><a className="text-accent underline decoration-dotted" href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a> <span className="text-dim">{s.handle}</span></li>
        ))}
      </ul>
    );
  return null;
}

export function CommandInput() {
  const { unlock, dispatchEvent, emitter } = useGame();
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<Entry[]>([]);
  const [recall, setRecall] = useState<number | null>(null);
  const [typedOnce, setTypedOnce] = useState(false);
  const idCounter = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.type === 'clear' || detail?.type === 'reset') {
        setHistory([]);
        return;
      }
      if (detail?.type === 'run' && typeof detail.command === 'string') {
        const cmd = detail.command as string;
        const output = runCommand(cmd, { unlock, emit: dispatchEvent });
        setHistory((h) => [...h, { id: ++idCounter.current, input: cmd, output }]);
        setRecall(null);
      }
    };
    emitter.addEventListener('game', onEvent);
    return () => emitter.removeEventListener('game', onEvent);
  }, [emitter, unlock, dispatchEvent]);

  // Like a real terminal: keep the prompt in view after every command. Some outputs (shayari,
  // galleries) load a moment later, so follow the output as it grows for a short while.
  const area = useRef<HTMLDivElement>(null);
  const followUntil = useRef(0);
  useEffect(() => {
    if (history.length) followUntil.current = Date.now() + 2000;
  }, [history]);
  useEffect(() => {
    const el = area.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (Date.now() > followUntil.current) return;
      // only the terminal's own panel — scrollIntoView would also shift the desktop behind it
      const panel = el.closest<HTMLElement>('.overflow-auto, .overflow-y-auto');
      if (panel) panel.scrollTop = panel.scrollHeight;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    track({ name: 'terminal_cmd', cmd: value.trim().toLowerCase().slice(0, 40) });
    const output = runCommand(value, { unlock, emit: dispatchEvent });
    setHistory((h) => [...h, { id: ++idCounter.current, input: value, output }]);
    setValue('');
    setRecall(null);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    if (!typedOnce && e.target.value.length > 0) {
      unlock('inspector');
      setTypedOnce(true);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (history.length === 0) return;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = recall === null ? history.length - 1 : Math.max(0, recall - 1);
      setRecall(next);
      setValue(history[next].input);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (recall === null) return;
      const next = recall + 1;
      if (next >= history.length) {
        setRecall(null);
        setValue('');
      } else {
        setRecall(next);
        setValue(history[next].input);
      }
    }
  }

  return (
    <div ref={area} className="space-y-4" data-target="prompt-area">
      {history.map((h) => (
        <div key={h.id} className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-accent">$</span>
            <span className="text-ink">{h.input}</span>
          </div>
          {h.output.kind === 'text' && h.output.body !== '' && (
            <pre className="pl-4 border-l border-line whitespace-pre-wrap text-ink/90 text-sm">
              {h.output.body}
            </pre>
          )}
          {h.output.kind === 'error' && (
            <pre className="pl-4 border-l border-line whitespace-pre-wrap text-[#ff8080] text-sm">
              {h.output.body}
            </pre>
          )}
          {h.output.kind === 'component' && (
            <div className="pl-4 border-l border-line">
              <ComponentSlot kind={h.output.body} />
            </div>
          )}
        </div>
      ))}
      <form onSubmit={handleSubmit} className="flex items-baseline gap-2">
        <span className="text-accent">$</span>
        <input
          ref={inputRef}
          aria-label="Enter command"
          autoComplete="off"
          spellCheck={false}
          className="flex-1 bg-transparent outline-none text-ink placeholder:text-dim/60"
          placeholder="type help and hit enter"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <span className="caret w-[8px] h-[16px] bg-accent inline-block" aria-hidden />
      </form>
    </div>
  );
}
