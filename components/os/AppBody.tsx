'use client';

import type { AppId } from '@/content/os';
import { CAMERA_ROLL, SPORTS, TRAVEL } from '@/content/os';
import { CommandInput } from '@/components/terminal/CommandInput';
import { AboutApp } from './apps/AboutApp';
import { ContactApp } from './apps/ContactApp';
import { MaafiApp } from './apps/MaafiApp';
import { PhotoApp } from './apps/PhotoApp';
import { ShayariApp } from './apps/ShayariApp';

export function AppBody({ id }: { id: AppId }) {
  switch (id) {
    case 'about':
      return <AboutApp />;
    case 'shayari':
      return <ShayariApp />;
    case 'maafi':
      return <MaafiApp />;
    case 'sports':
      return <PhotoApp tabs={SPORTS} intro="Tennis, squash, cricket — and the wall that keeps me honest." />;
    case 'travel':
      return <PhotoApp tabs={TRAVEL} />;
    case 'camera':
      return <PhotoApp tabs={[{ tab: 'life', photos: CAMERA_ROLL }]} intro="Life outside the screen. Captions are mostly accurate." />;
    case 'contact':
      return <ContactApp />;
    case 'terminal':
      return (
        <div className="p-4 font-mono text-sm bg-[#07090c] min-h-full">
          <p className="text-dim mb-3">sarvesh-os v2.0 — type <span className="text-accent">help</span>. some commands are secret.</p>
          <CommandInput />
        </div>
      );
  }
}
