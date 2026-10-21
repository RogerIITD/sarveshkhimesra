'use client';

import { SOCIALS } from '@/content/os';
import { track } from '@/lib/track';

export function ContactApp() {
  return (
    <div className="p-5 space-y-4">
      <p className="text-sm text-dim">Building at the edge of AI and business? Want to argue about Kohli vs. everyone? Pick a channel.</p>
      <ul className="space-y-2">
        {SOCIALS.map((s) => (
          <li key={s.id}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track({ name: 'link_click', target: s.id })}
              data-target={`social-${s.id}`}
              className="flex items-center justify-between rounded-lg border border-line px-4 py-3 hover:border-accent group"
            >
              <span className="text-ink">{s.label}</span>
              <span className="font-mono text-xs text-dim group-hover:text-accent">{s.handle} ↗</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
