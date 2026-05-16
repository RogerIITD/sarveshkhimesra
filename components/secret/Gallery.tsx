'use client';

import Image from 'next/image';
import { TRAVEL_INDIA } from '@/content/secret-travel';
import { SPORTS } from '@/content/secret-sports';

const SETS = { travel: TRAVEL_INDIA, sports: SPORTS };

type Props = { which: 'travel' | 'sports' };

export function Gallery({ which }: Props) {
  const items = SETS[which];
  return (
    <div className="grid grid-cols-2 gap-3 max-w-md">
      {items.map((it) => (
        <figure key={it.src} className="space-y-1" data-target={`photo-${which}`}>
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-chrome rounded">
            <Image
              src={it.src}
              alt={it.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 220px"
            />
          </div>
          <figcaption className="text-xs text-muted">{it.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
