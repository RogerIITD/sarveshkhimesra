import type { AppId } from './os';

export type PersonaId = 'engineer' | 'poet' | 'athlete' | 'traveller';

export type Persona = {
  id: PersonaId;
  label: string;
  glyph: string;
  accent: string; // "r g b" — feeds the --accent CSS variable
  headline: string;
  sub: string;
  font: 'mono' | 'hindi' | 'sans';
  apps: AppId[]; // windows the persona opens (left → right)
  wallpaper: { kind: 'image'; src: string } | { kind: 'ink' } | { kind: 'court' };
  wipe: string; // background colour of the circle wipe
};

export const PERSONAS: Persona[] = [
  {
    id: 'engineer',
    label: 'engineer',
    glyph: '⌘',
    accent: '251 191 36',
    headline: 'Sarvesh Khimesra',
    sub: 'AI Engineer · Office of the COO, Razorpay — business transformation, process excellence, AI strategy.',
    font: 'sans',
    apps: ['about', 'terminal'],
    wallpaper: { kind: 'image', src: '/images/os/nebula.jpg' },
    wipe: '#0b0d12',
  },
  {
    id: 'poet',
    label: 'poet',
    glyph: '✒',
    accent: '244 114 82',
    headline: 'सर्वेश — the shayar.',
    sub: 'Hindi shayari, in my own voice. And a song called Maafi.',
    font: 'hindi',
    apps: ['shayari', 'maafi'],
    wallpaper: { kind: 'ink' },
    wipe: '#140c0a',
  },
  {
    id: 'athlete',
    label: 'athlete',
    glyph: '🎾',
    accent: '190 242 100',
    headline: 'Sarvesh, on court.',
    sub: 'Tennis, squash, cricket. RCB forever — yes, still.',
    font: 'sans',
    apps: ['sports'],
    wallpaper: { kind: 'court' },
    wipe: '#0a1a14',
  },
  {
    id: 'traveller',
    label: 'traveller',
    glyph: '✈',
    accent: '125 211 252',
    headline: 'Sarvesh, out of office.',
    sub: 'India and Ireland, one camera roll at a time.',
    font: 'sans',
    apps: ['travel', 'camera'],
    wallpaper: { kind: 'image', src: '/images/os/traveller-bg.jpg' },
    wipe: '#08131c',
  },
];

export const PERSONA_BY_ID = Object.fromEntries(PERSONAS.map((p) => [p.id, p])) as Record<PersonaId, Persona>;

export const BOOT_LINES = [
  'sarvesh-os v2.0 — booting',
  '[ ok ] mounting /shayari  (3 poems, 1 voice)',
  '[ ok ] loading maafi.mp3',
  '[ ok ] warming up forehand',
  '[ ok ] connecting to razorpay/office-of-the-coo',
];

export const BOOT_ROLES = ['AI Engineer', 'Shayar', 'Songwriter', 'Athlete', 'Sarvesh Khimesra'];
