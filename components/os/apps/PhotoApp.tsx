'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Photo } from '@/content/os';
import { track } from '@/lib/track';
import { useBackLayer } from '@/lib/useBackLayer';
import { Media } from '../Media';

type Tab = { tab: string; photos: Photo[]; note?: string };

export function PhotoApp({ tabs, intro }: { tabs: Tab[]; intro?: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const current = tabs[active];
  useBackLayer(open !== null, () => setOpen(null));

  return (
    <div className="p-4 space-y-4">
      {intro && <p className="text-sm text-dim">{intro}</p>}
      {tabs.length > 1 && (
        <div className="flex flex-wrap gap-1.5" role="tablist">
          {tabs.map((t, i) => (
            <button
              key={t.tab}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`font-mono text-xs px-2.5 py-1 rounded-md border transition-colors ${
                i === active ? 'border-accent text-accent bg-accent/10' : 'border-line text-dim hover:text-ink hover:border-line-strong'
              }`}
            >
              ./{t.tab}/ <span className="opacity-60">{t.photos.length}</span>
            </button>
          ))}
        </div>
      )}

      {current.photos.length === 0 ? (
        <p className="font-mono text-sm text-dim border border-dashed border-line rounded-lg p-6 text-center">{current.note}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {current.photos.map((p, i) => (
            <button
              key={p.src}
              onClick={() => {
                setOpen(i);
                track({ name: 'photo_open', src: p.src });
              }}
              className="group text-left"
              data-target={`photo-${p.src.split('/').pop()}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-line">
                <Media item={p} sizes="(max-width: 768px) 50vw, 220px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                {p.video && <span className="absolute top-2 right-2 font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-white">▶ clip</span>}
              </div>
              <p className="mt-1.5 text-xs text-dim leading-snug line-clamp-2 group-hover:text-ink">{p.caption}</p>
            </button>
          ))}
        </div>
      )}

      {open !== null && <Lightbox photos={current.photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}

function Lightbox({ photos, index, onIndex, onClose }: { photos: Photo[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const p = photos[index];
  const step = (d: number) => onIndex((index + d + photos.length) % photos.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Portal: windows use backdrop-blur, which would trap a fixed overlay inside them.
  return createPortal(
    <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4" onClick={onClose} role="dialog" aria-label="Photo viewer">
      <div className="relative w-full max-w-4xl h-[75vh]" onClick={(e) => e.stopPropagation()}>
        <Media item={p} sizes="100vw" className="object-contain" priority />
      </div>
      <p className="mt-4 max-w-2xl text-center text-ink text-base" onClick={(e) => e.stopPropagation()}>
        {p.caption}
      </p>
      <div className="mt-4 flex gap-3 font-mono text-xs" onClick={(e) => e.stopPropagation()}>
        {photos.length > 1 && (
          <button onClick={() => step(-1)} className="px-3 py-1.5 rounded border border-line-strong text-dim hover:text-ink">← prev</button>
        )}
        <span className="px-2 py-1.5 text-dim">{index + 1} / {photos.length}</span>
        {photos.length > 1 && (
          <button onClick={() => step(1)} className="px-3 py-1.5 rounded border border-line-strong text-dim hover:text-ink">next →</button>
        )}
        <button onClick={onClose} className="px-3 py-1.5 rounded border border-line-strong text-dim hover:text-ink">close ✕</button>
      </div>
    </div>,
    document.body,
  );
}
