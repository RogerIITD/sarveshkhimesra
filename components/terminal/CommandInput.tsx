'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useGame } from '@/components/game/GameProvider';
import { runCommand, type CommandOutput } from '@/components/game/commands';

const ShayariModal = dynamic(
  () => import('@/components/secret/ShayariModal').then((m) => m.ShayariModal),
  { ssr: false },
);
const SongPlayer = dynamic(() => import('@/components/SongPlayer'), { ssr: false });
const Gallery = dynamic(
  () => import('@/components/secret/Gallery').then((m) => m.Gallery),
  { ssr: false },
);

type Entry = { id: number; input: string; output: CommandOutput };

function ComponentSlot({ kind }: { kind: string }) {
  if (kind === 'shayari') return <ShayariModal inline />;
  if (kind === 'song:maafi') return <SongPlayer />;
  if (kind === 'gallery:travel') return <Gallery which="travel" />;
  if (kind === 'gallery:sports') return <Gallery which="sports" />;
  if (kind === 'whoami') return <pre className="text-fg/90">sarvesh khimesra · ai builder · razorpay · coo&apos;s office</pre>;
  if (kind === 'about') return <p className="text-fg/90 text-sm">already shown above — run &apos;help&apos; for the menu.</p>;
  if (kind === 'projects') return <p className="text-fg/90 text-sm">scroll up — projects/ already listed.</p>;
  if (kind === 'contact') return <p className="text-fg/90 text-sm">socials are above.</p>;
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
      if (detail?.type === 'clear' || detail?.type === 'reset') setHistory([]);
    };
    emitter.addEventListener('game', onEvent);
    return () => emitter.removeEventListener('game', onEvent);
  }, [emitter]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
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
    <div className="space-y-4" data-target="prompt-area">
      {history.map((h) => (
        <div key={h.id} className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-prompt">$</span>
            <span className="text-fg">{h.input}</span>
          </div>
          {h.output.kind === 'text' && h.output.body !== '' && (
            <pre className="pl-4 border-l border-chrome whitespace-pre-wrap text-fg/90 text-sm">
              {h.output.body}
            </pre>
          )}
          {h.output.kind === 'error' && (
            <pre className="pl-4 border-l border-chrome whitespace-pre-wrap text-[#ff8080] text-sm">
              {h.output.body}
            </pre>
          )}
          {h.output.kind === 'component' && (
            <div className="pl-4 border-l border-chrome">
              <ComponentSlot kind={h.output.body} />
            </div>
          )}
        </div>
      ))}
      <form onSubmit={handleSubmit} className="flex items-baseline gap-2">
        <span className="text-prompt">$</span>
        <input
          ref={inputRef}
          aria-label="Enter command"
          autoComplete="off"
          spellCheck={false}
          className="flex-1 bg-transparent outline-none text-fg placeholder:text-muted/60"
          placeholder="type 'help'"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <span className="caret w-[8px] h-[16px] bg-prompt inline-block" aria-hidden />
      </form>
    </div>
  );
}
