'use client';

import Image from 'next/image';
import { TRAVEL_ALL, TRAVEL_INDIA, TRAVEL_IRELAND } from '@/content/secret-travel';
import { SPORTS } from '@/content/secret-sports';

type Props = { which: 'travel' | 'travel-india' | 'travel-ireland' | 'sports' };

export function Gallery({ which }: Props) {
  if (which === 'sports') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl">
        {SPORTS.map((it) => (
          <figure key={it.src} className="space-y-1" data-target="photo-sports">
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-chrome rounded">
              <Image src={it.src} alt={it.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 220px" />
            </div>
            <figcaption className="text-xs text-muted">{it.caption}</figcaption>
          </figure>
        ))}
      </div>
    );
  }

  // Travel: render with location-grouped section labels when showing all.
  const showBoth = which === 'travel';
  const sections =
    which === 'travel-india'   ? [{ label: 'india',   items: TRAVEL_INDIA }]
  : which === 'travel-ireland' ? [{ label: 'ireland', items: TRAVEL_IRELAND }]
  :                              [
      { label: 'india',   items: TRAVEL_INDIA },
      { label: 'ireland', items: TRAVEL_IRELAND },
    ];

  return (
    <div className="space-y-4 max-w-2xl">
      {sections.map((sec) => (
        <div key={sec.label} className="space-y-2">
          {showBoth && (
            <div className="text-xs text-prompt uppercase tracking-wider">{`./${sec.label}/`}</div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {sec.items.map((it) => (
              <figure key={it.src} className="space-y-1" data-target={`photo-${it.place}`}>
                <div className="relative aspect-[4/5] w-full overflow-hidden border border-chrome rounded">
                  <Image src={it.src} alt={it.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 220px" />
                </div>
                <figcaption className="text-xs text-muted">{it.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Backwards-compat: TRAVEL_ALL unused here directly but exported elsewhere.
export const _all = TRAVEL_ALL;
