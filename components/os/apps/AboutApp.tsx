'use client';

import Image from 'next/image';
import { BIO, SOCIALS } from '@/content/os';
import { track } from '@/lib/track';

export function AboutApp() {
  return (
    <div className="p-5 space-y-5">
      <div className="flex gap-4 items-center">
        <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border border-line-strong" title={BIO.headshot.caption}>
          <Image src={BIO.headshot.src} alt="Sarvesh Khimesra" fill sizes="96px" className="object-cover object-[50%_25%]" priority />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-ink tracking-tight">{BIO.name}</h1>
          <p className="text-sm text-accent mt-0.5">{BIO.title}</p>
          <p className="text-xs text-dim mt-1 italic">“{BIO.headshot.caption}”</p>
        </div>
      </div>

      <div className="space-y-3 text-[15px] leading-relaxed text-ink/90">
        {BIO.lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {BIO.focus.map((f) => (
          <span key={f} className="font-mono text-xs px-2.5 py-1 rounded-full border border-accent/40 text-accent bg-accent/10">
            {f}
          </span>
        ))}
      </div>

      <p className="text-sm text-dim">
        <span className="font-mono text-xs text-ink/70">off the clock →</span> {BIO.offClock}
      </p>

      <div className="flex flex-wrap gap-2 pt-1">
        {SOCIALS.map((s) => (
          <a
            key={s.id}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track({ name: 'link_click', target: s.id })}
            data-target={`social-${s.id}`}
            className="text-sm px-3 py-1.5 rounded-lg border border-line hover:border-accent hover:text-accent transition-colors"
          >
            {s.label} ↗
          </a>
        ))}
      </div>
    </div>
  );
}
