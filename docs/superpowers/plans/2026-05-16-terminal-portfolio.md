# Terminal Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `sarveshkhimesra.vercel.app` with a dark terminal-styled AI Builder portfolio: animated CLI commands, tennis-racquet cursor with click-to-serve ball physics, XP + achievements layer, and secret commands that revive cut content (shayari, song, travel-india, sports).

**Architecture:** Single page (`app/page.tsx`) renders a `TerminalWindow` containing four pre-run command blocks plus a live `CommandInput`. A `GameProvider` React context holds XP / achievements / classic-mode and persists to `localStorage`. `TennisCursor` follows the pointer; `BallField` runs a `requestAnimationFrame` physics loop that bounces "live balls" off the viewport and `[data-target]` elements. Pure game logic (storage, streak, command parser, achievement predicates) is TDD'd with Vitest; visual components are verified manually in dev.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript 5, Tailwind 3, framer-motion 12, `next/font/google` (JetBrains Mono), Vitest + jsdom for unit tests. Drops `@notionhq/client` and `@tailwindcss/typography`.

**Reference spec:** `docs/superpowers/specs/2026-05-16-terminal-portfolio-design.md`

---

## Phase 1 — Foundation

### Task 1: Add Vitest test harness

**Why:** TDD the pure logic tasks (storage, streak, command parser, achievements). Vitest runs natively with Next.js + jsdom, no Next/Jest setup needed.

**Files:**
- Modify: `package.json` (deps + scripts)
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `tsconfig.test.json`

- [ ] **Step 1: Install dev dependencies**

```bash
cd /Users/sarveshkhimesra/sarvesh-portfolio
npm install -D vitest@^2 jsdom@^25 @testing-library/react@^16 @testing-library/jest-dom@^6
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
});
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Add scripts in `package.json`**

Edit the `"scripts"` block to add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Sanity-check the harness**

Create `__sanity__.test.ts` at repo root:
```ts
import { describe, it, expect } from 'vitest';
describe('vitest', () => { it('runs', () => expect(1 + 1).toBe(2)); });
```

Run: `npm test`
Expected: 1 test passing. Delete `__sanity__.test.ts` after.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts
git commit -m "chore: add vitest + jsdom test harness"
```

---

### Task 2: Remove obsolete dependencies and dead code

**Files:**
- Modify: `package.json`
- Delete: `lib/notion.ts`, `app/blog/`, `app/now/`, `app/about/`, `app/template.tsx`
- Delete (components no longer used): `BentoCard.tsx`, `BentoGrid.tsx`, `HeroCard.tsx`, `Polaroid.tsx`, `PhotoCarousel.tsx`, `BlogList.tsx`, `FilterBar.tsx`, `PostCard.tsx`, `Nav.tsx`, `MobileMenu.tsx`, `GradientMesh.tsx`, `SocialDock.tsx`, `PageTransition.tsx`, `ShareButton.tsx`, `ShayariText.tsx`, `ShayariCard.tsx`

**Note:** `components/SongPlayer.tsx` is **kept** — it will be lazy-imported by the `play maafi` secret command.

- [ ] **Step 1: Remove notion + typography from `package.json`**

In `dependencies` delete `"@notionhq/client"` and `"@tailwindcss/typography"`. Then:

```bash
npm install
```

- [ ] **Step 2: Remove typography plugin from `tailwind.config.ts`**

In `tailwind.config.ts`, change `plugins: [require("@tailwindcss/typography")]` to `plugins: []`.

- [ ] **Step 3: Delete obsolete files**

```bash
rm lib/notion.ts
rm -rf lib  # only if empty after; check first
rm -rf app/blog app/now app/about
rm -f app/template.tsx
rm components/{BentoCard,BentoGrid,HeroCard,Polaroid,PhotoCarousel,BlogList,FilterBar,PostCard,Nav,MobileMenu,GradientMesh,SocialDock,PageTransition,ShareButton,ShayariText,ShayariCard}.tsx
```

- [ ] **Step 4: Stub `app/page.tsx` so the project still builds**

Replace `app/page.tsx` contents with:
```tsx
export default function HomePage() {
  return <main className="min-h-screen bg-[#0a0e0a] text-[#4cd964] font-mono p-8">booting...</main>;
}
```

- [ ] **Step 5: Stub `app/layout.tsx` (strip references to deleted components)**

Read the current `app/layout.tsx` first. Remove any imports for `Nav`, `MobileMenu`, `SocialDock`, `PageTransition`. Replace its `children` wrapping with just `{children}`.

- [ ] **Step 6: Verify the build succeeds**

```bash
npm run build
```
Expected: build completes with no missing-module errors. Fix any remaining imports referencing deleted files.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: remove notion blog/now and legacy bento components"
```

---

### Task 3: Theme tokens, font, globals

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update Tailwind color tokens**

In `tailwind.config.ts`, replace the `colors` block with:
```ts
colors: {
  bg: "#0a0e0a",
  fg: "#d3f3d3",
  prompt: "#4cd964",
  ball: "#d9f04a",
  muted: "#8d9b8d",
  chrome: "#1f3a1f",
},
```
Also remove the `fontFamily` entries `heading`, `body`, `shayari` — keep only `mono: ["var(--font-mono)", "monospace"]`.

- [ ] **Step 2: Replace `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

html, body {
  background: #0a0e0a;
  color: #d3f3d3;
  font-family: var(--font-mono), 'JetBrains Mono', monospace;
}

html { cursor: none; }
@media (hover: none) and (pointer: coarse) { html { cursor: auto; } }
@media (prefers-reduced-motion: reduce) { html { cursor: auto; } }

.scanlines {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent 0,
    transparent 2px,
    rgba(255, 255, 255, 0.018) 2px,
    rgba(255, 255, 255, 0.018) 3px
  );
  z-index: 50;
}
@media (prefers-reduced-motion: reduce) { .scanlines { display: none; } }

:focus-visible { outline: 2px solid #d9f04a; outline-offset: 2px; }

@keyframes caret { 50% { opacity: 0; } }
.caret { animation: caret 1s steps(2, end) infinite; }
```

- [ ] **Step 3: Load JetBrains Mono in `app/layout.tsx`**

Read the current file, then replace contents with:
```tsx
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sarvesh Khimesra",
  description: "AI builder. GTM × AI. Joining Razorpay 2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <body>
        {children}
        <div className="scanlines" aria-hidden />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npm run dev
```
Open http://localhost:3000 — page shows "booting..." in green-on-black mono. OS cursor hidden on desktop.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts app/globals.css app/layout.tsx
git commit -m "feat(theme): dark terminal palette, JetBrains Mono, scanlines"
```

---

## Phase 2 — Pure game logic (TDD)

### Task 4: `storage.ts` — versioned localStorage helper

**Files:**
- Create: `components/game/storage.ts`
- Create: `components/game/storage.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// components/game/storage.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { readGameState, writeGameState, readStreak, writeStreak, GAME_STATE_KEY, STREAK_KEY } from './storage';

describe('readGameState', () => {
  beforeEach(() => localStorage.clear());

  it('returns defaults when empty', () => {
    expect(readGameState()).toEqual({ xp: 0, achievements: [], classic: false, turbo: false });
  });
  it('reads what was written', () => {
    writeGameState({ xp: 50, achievements: ['first_contact'], classic: true, turbo: false });
    expect(readGameState()).toEqual({ xp: 50, achievements: ['first_contact'], classic: true, turbo: false });
  });
  it('ignores stored data with wrong version', () => {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify({ version: 'v0', xp: 999, achievements: [] }));
    expect(readGameState()).toEqual({ xp: 0, achievements: [], classic: false, turbo: false });
  });
  it('survives malformed JSON', () => {
    localStorage.setItem(GAME_STATE_KEY, '{not json');
    expect(readGameState()).toEqual({ xp: 0, achievements: [], classic: false, turbo: false });
  });
});

describe('streak', () => {
  beforeEach(() => localStorage.clear());

  it('returns 1 with today when empty', () => {
    const r = readStreak('2026-05-16');
    expect(r).toEqual({ count: 1, lastVisitUTC: '2026-05-16' });
  });
  it('increments when called on the next day', () => {
    writeStreak({ count: 3, lastVisitUTC: '2026-05-15' });
    expect(readStreak('2026-05-16')).toEqual({ count: 4, lastVisitUTC: '2026-05-16' });
  });
  it('does not change when called twice the same day', () => {
    writeStreak({ count: 3, lastVisitUTC: '2026-05-16' });
    expect(readStreak('2026-05-16')).toEqual({ count: 3, lastVisitUTC: '2026-05-16' });
  });
  it('resets to 1 when a day is skipped', () => {
    writeStreak({ count: 5, lastVisitUTC: '2026-05-14' });
    expect(readStreak('2026-05-16')).toEqual({ count: 1, lastVisitUTC: '2026-05-16' });
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test
```
Expected: tests fail with "Cannot find module './storage'".

- [ ] **Step 3: Implement**

```ts
// components/game/storage.ts
export const GAME_STATE_KEY = 'khimesra.game.v1';
export const STREAK_KEY = 'khimesra.streak.v1';

export type GameState = { xp: number; achievements: string[]; classic: boolean; turbo: boolean };
export type Streak = { count: number; lastVisitUTC: string };

const DEFAULT_STATE: GameState = { xp: 0, achievements: [], classic: false, turbo: false };

function safeParse<T>(raw: string | null, expectedVersion: string): T | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (data?.version !== expectedVersion) return null;
    return data.payload as T;
  } catch { return null; }
}

export function readGameState(): GameState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  return safeParse<GameState>(localStorage.getItem(GAME_STATE_KEY), 'v1') ?? DEFAULT_STATE;
}

export function writeGameState(state: GameState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GAME_STATE_KEY, JSON.stringify({ version: 'v1', payload: state }));
}

function previousUtcDay(today: string): string {
  const d = new Date(today + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function readStreak(today: string): Streak {
  if (typeof window === 'undefined') return { count: 1, lastVisitUTC: today };
  const stored = safeParse<Streak>(localStorage.getItem(STREAK_KEY), 'v1');
  let next: Streak;
  if (!stored) next = { count: 1, lastVisitUTC: today };
  else if (stored.lastVisitUTC === today) next = stored;
  else if (stored.lastVisitUTC === previousUtcDay(today)) next = { count: stored.count + 1, lastVisitUTC: today };
  else next = { count: 1, lastVisitUTC: today };
  writeStreak(next);
  return next;
}

export function writeStreak(s: Streak): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STREAK_KEY, JSON.stringify({ version: 'v1', payload: s }));
}

export function todayUTC(): string { return new Date().toISOString().slice(0, 10); }
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test
```
Expected: 8 tests passing.

- [ ] **Step 5: Commit**

```bash
git add components/game/storage.ts components/game/storage.test.ts
git commit -m "feat(game): versioned localStorage + streak logic"
```

---

### Task 5: Achievement registry

**Files:**
- Create: `components/game/achievements.ts`
- Create: `components/game/achievements.test.ts`

- [ ] **Step 1: Write tests**

```ts
// components/game/achievements.test.ts
import { describe, it, expect } from 'vitest';
import { ACHIEVEMENTS, getAchievement, totalXpFor } from './achievements';

describe('achievement registry', () => {
  it('exposes 12 unique ids', () => {
    const ids = ACHIEVEMENTS.map(a => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ACHIEVEMENTS).toHaveLength(12);
  });
  it('every achievement has positive xp', () => {
    for (const a of ACHIEVEMENTS) expect(a.xp).toBeGreaterThan(0);
  });
  it('getAchievement returns matching record', () => {
    expect(getAchievement('first_contact')?.xp).toBe(10);
    expect(getAchievement('nope')).toBeUndefined();
  });
  it('totalXpFor sums only known ids', () => {
    expect(totalXpFor(['first_contact', 'server'])).toBe(25);
    expect(totalXpFor(['first_contact', 'unknown_id'])).toBe(10);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

`npm test` → fails missing module.

- [ ] **Step 3: Implement**

```ts
// components/game/achievements.ts
export type AchievementId =
  | 'first_contact' | 'inspector' | 'server' | 'volley' | 'net_shot'
  | 'read_it_all' | 'connector' | 'shayari_open' | 'maafi_played'
  | 'travel_seen' | 'sports_seen' | 'turbo';

export type Achievement = { id: AchievementId; title: string; description: string; xp: number };

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_contact', title: 'first_contact', description: 'You opened the terminal.', xp: 10 },
  { id: 'inspector',     title: 'inspector',     description: 'Started typing at the prompt.', xp: 15 },
  { id: 'server',        title: 'server',        description: 'First ball served.', xp: 15 },
  { id: 'volley',        title: 'volley',        description: 'Kept a ball alive 10 seconds.', xp: 25 },
  { id: 'net_shot',      title: 'net_shot',      description: 'Hit 3 targets with one serve.', xp: 30 },
  { id: 'read_it_all',   title: 'read_it_all',   description: 'Scrolled past every section.', xp: 20 },
  { id: 'connector',     title: 'connector',     description: 'Visited all 3 socials.', xp: 20 },
  { id: 'shayari_open',  title: 'secret: shayari', description: 'Found the poetry command.', xp: 50 },
  { id: 'maafi_played',  title: 'secret: maafi',   description: 'Played the song.', xp: 50 },
  { id: 'travel_seen',   title: 'secret: travel',  description: 'Found the travel gallery.', xp: 50 },
  { id: 'sports_seen',   title: 'secret: sports',  description: 'Found the sports gallery.', xp: 50 },
  { id: 'turbo',         title: 'turbo',           description: 'Konami unlocked.', xp: 75 },
];

const BY_ID: Record<string, Achievement> = Object.fromEntries(ACHIEVEMENTS.map(a => [a.id, a]));

export function getAchievement(id: string): Achievement | undefined { return BY_ID[id]; }

export function totalXpFor(ids: readonly string[]): number {
  return ids.reduce((sum, id) => sum + (BY_ID[id]?.xp ?? 0), 0);
}
```

- [ ] **Step 4: Run — expect PASS**

`npm test`

- [ ] **Step 5: Commit**

```bash
git add components/game/achievements.ts components/game/achievements.test.ts
git commit -m "feat(game): achievement registry"
```

---

### Task 6: Command parser

**Files:**
- Create: `components/game/commands.ts`
- Create: `components/game/commands.test.ts`

- [ ] **Step 1: Write tests**

```ts
// components/game/commands.test.ts
import { describe, it, expect, vi } from 'vitest';
import { parseCommand, runCommand, COMMAND_REGISTRY } from './commands';

describe('parseCommand', () => {
  it('lowercases, trims, splits args', () => {
    expect(parseCommand('  Help  ')).toEqual({ name: 'help', args: [] });
    expect(parseCommand('play maafi')).toEqual({ name: 'play', args: ['maafi'] });
    expect(parseCommand('ls travel/india')).toEqual({ name: 'ls', args: ['travel/india'] });
  });
  it('returns null for empty input', () => {
    expect(parseCommand('')).toBeNull();
    expect(parseCommand('   ')).toBeNull();
  });
});

describe('runCommand', () => {
  it('runs a known visible command', () => {
    const ctx = { unlock: vi.fn(), emit: vi.fn() };
    const out = runCommand('help', ctx);
    expect(out.kind).toBe('text');
    expect(out.body).toContain('whoami');
  });
  it('returns not-found for unknown', () => {
    const ctx = { unlock: vi.fn(), emit: vi.fn() };
    const out = runCommand('xyzzy', ctx);
    expect(out.kind).toBe('error');
    expect(out.body).toMatch(/command not found/i);
  });
  it('shayari unlocks shayari_open', () => {
    const ctx = { unlock: vi.fn(), emit: vi.fn() };
    runCommand('shayari', ctx);
    expect(ctx.unlock).toHaveBeenCalledWith('shayari_open');
  });
  it('play maafi unlocks maafi_played', () => {
    const ctx = { unlock: vi.fn(), emit: vi.fn() };
    runCommand('play maafi', ctx);
    expect(ctx.unlock).toHaveBeenCalledWith('maafi_played');
  });
  it('ls travel and ls travel/india both unlock travel_seen', () => {
    const ctx = { unlock: vi.fn(), emit: vi.fn() };
    runCommand('ls travel', ctx);
    runCommand('ls travel/india', ctx);
    expect(ctx.unlock).toHaveBeenCalledWith('travel_seen');
    expect(ctx.unlock).toHaveBeenCalledTimes(2);
  });
  it('help lists only non-hidden command names', () => {
    const ctx = { unlock: vi.fn(), emit: vi.fn() };
    const out = runCommand('help', ctx);
    expect(out.body).not.toMatch(/shayari/);
    expect(out.body).not.toMatch(/play maafi/);
  });
  it('registry contains all expected commands', () => {
    const names = COMMAND_REGISTRY.map(c => c.name).sort();
    expect(names).toContain('help'); expect(names).toContain('clear');
    expect(names).toContain('whoami'); expect(names).toContain('shayari');
    expect(names).toContain('play'); expect(names).toContain('ls');
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement**

```ts
// components/game/commands.ts
import type { AchievementId } from './achievements';

export type CommandCtx = {
  unlock: (id: AchievementId) => void;
  emit: (event: GameEvent) => void;
};

export type GameEvent =
  | { type: 'clear' }
  | { type: 'open-shayari' }
  | { type: 'open-song' }
  | { type: 'open-gallery'; key: 'travel' | 'sports' }
  | { type: 'theme'; mode: 'classic' | 'game' }
  | { type: 'reset' };

export type CommandOutput =
  | { kind: 'text'; body: string }
  | { kind: 'error'; body: string }
  | { kind: 'component'; body: string };

type Command = {
  name: string;
  hidden?: boolean;
  describe: string;
  run: (args: string[], ctx: CommandCtx) => CommandOutput;
};

export const COMMAND_REGISTRY: Command[] = [
  { name: 'help', describe: 'list visible commands', run: (_a, _c) => ({
      kind: 'text',
      body: [
        'available commands:',
        '  whoami            who is sarvesh',
        '  cat about.md      longer intro',
        '  ls projects/      what i am building',
        '  contact --me      socials',
        '  theme classic     turn the game off',
        '  theme game        turn the game on',
        '  clear             clear the screen',
        '  help              this list',
      ].join('\n'),
    }) },
  { name: 'whoami', describe: 'who am i', run: () => ({ kind: 'component', body: 'whoami' }) },
  { name: 'cat',    describe: 'cat <file>', run: (args) => args[0] === 'about.md'
      ? { kind: 'component', body: 'about' }
      : { kind: 'error', body: `cat: ${args.join(' ') || ''}: no such file` } },
  { name: 'contact', describe: 'contact --me', run: (args) => args[0] === '--me'
      ? { kind: 'component', body: 'contact' }
      : { kind: 'error', body: `contact: unknown flag '${args.join(' ')}'` } },
  { name: 'clear', describe: 'clear the screen', run: (_a, ctx) => { ctx.emit({ type: 'clear' }); return { kind: 'text', body: '' }; } },
  { name: 'theme', describe: 'theme classic | theme game', run: (args, ctx) => {
      if (args[0] === 'classic') { ctx.emit({ type: 'theme', mode: 'classic' }); return { kind: 'text', body: 'theme: classic' }; }
      if (args[0] === 'game')    { ctx.emit({ type: 'theme', mode: 'game' });    return { kind: 'text', body: 'theme: game' }; }
      return { kind: 'error', body: `theme: expected 'classic' or 'game'` };
    } },
  { name: 'reset',  describe: 'wipe progress', run: (_a, ctx) => { ctx.emit({ type: 'reset' }); return { kind: 'text', body: 'progress wiped.' }; } },
  // Hidden
  { name: 'ls',      hidden: true, describe: 'ls <dir>', run: (args, ctx) => {
      const dir = args[0] ?? '';
      if (dir.startsWith('projects')) return { kind: 'component', body: 'projects' };
      if (dir.startsWith('travel'))   { ctx.unlock('travel_seen'); ctx.emit({ type: 'open-gallery', key: 'travel' });  return { kind: 'component', body: 'gallery:travel' }; }
      if (dir.startsWith('sports'))   { ctx.unlock('sports_seen'); ctx.emit({ type: 'open-gallery', key: 'sports' });  return { kind: 'component', body: 'gallery:sports' }; }
      return { kind: 'error', body: `ls: ${dir || '(no dir)'}: no such directory` };
    } },
  { name: 'shayari', hidden: true, describe: 'open shayari', run: (_a, ctx) => { ctx.unlock('shayari_open'); ctx.emit({ type: 'open-shayari' }); return { kind: 'component', body: 'shayari' }; } },
  { name: 'play',    hidden: true, describe: 'play <track>', run: (args, ctx) => args[0] === 'maafi'
      ? (ctx.unlock('maafi_played'), ctx.emit({ type: 'open-song' }), { kind: 'component', body: 'song:maafi' })
      : { kind: 'error', body: `play: unknown track '${args.join(' ')}'` } },
];

const BY_NAME = new Map(COMMAND_REGISTRY.map(c => [c.name, c]));

export function parseCommand(raw: string): { name: string; args: string[] } | null {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return null;
  const [name, ...args] = trimmed.split(/\s+/);
  return { name, args };
}

export function runCommand(raw: string, ctx: CommandCtx): CommandOutput {
  const parsed = parseCommand(raw);
  if (!parsed) return { kind: 'text', body: '' };
  const cmd = BY_NAME.get(parsed.name);
  if (!cmd) return { kind: 'error', body: `command not found: ${parsed.name}. type 'help'.` };
  return cmd.run(parsed.args, ctx);
}
```

- [ ] **Step 4: Run — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add components/game/commands.ts components/game/commands.test.ts
git commit -m "feat(game): command parser and registry"
```

---

## Phase 3 — Game state provider + HUD

### Task 7: `GameProvider`

**Files:**
- Create: `components/game/GameProvider.tsx`

- [ ] **Step 1: Create the provider**

```tsx
'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import type { Achievement, AchievementId } from './achievements';
import { ACHIEVEMENTS, getAchievement } from './achievements';
import { readGameState, writeGameState, readStreak, todayUTC } from './storage';
import type { GameEvent } from './commands';

type State = { xp: number; achievements: AchievementId[]; classic: boolean; turbo: boolean; streak: number; lastUnlock: Achievement | null };
type Action =
  | { type: 'unlock'; id: AchievementId }
  | { type: 'toggleClassic' }
  | { type: 'setTurbo'; value: boolean }
  | { type: 'reset' }
  | { type: 'hydrate'; payload: Partial<State> }
  | { type: 'clearToast' };

const initial: State = { xp: 0, achievements: [], classic: false, turbo: false, streak: 1, lastUnlock: null };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'hydrate':       return { ...s, ...a.payload };
    case 'unlock': {
      if (s.achievements.includes(a.id)) return s;
      const ach = getAchievement(a.id);
      if (!ach) return s;
      return { ...s, achievements: [...s.achievements, a.id], xp: s.xp + ach.xp, lastUnlock: ach };
    }
    case 'toggleClassic': return { ...s, classic: !s.classic };
    case 'setTurbo':      return { ...s, turbo: a.value };
    case 'reset':         return { ...initial, classic: s.classic };
    case 'clearToast':    return { ...s, lastUnlock: null };
  }
}

type Ctx = State & {
  unlock: (id: AchievementId) => void;
  toggleClassic: () => void;
  setTurbo: (v: boolean) => void;
  resetProgress: () => void;
  dispatchEvent: (e: GameEvent) => void;
  emitter: EventTarget;
};

const GameCtx = createContext<Ctx | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const emitter = useRef(new EventTarget()).current;

  // Hydrate from localStorage and compute streak
  useEffect(() => {
    const stored = readGameState();
    const streak = readStreak(todayUTC()).count;
    dispatch({ type: 'hydrate', payload: { ...stored, streak } });
    dispatch({ type: 'unlock', id: 'first_contact' });
  }, []);

  // Persist on change
  useEffect(() => {
    writeGameState({ xp: state.xp, achievements: state.achievements, classic: state.classic, turbo: state.turbo });
  }, [state.xp, state.achievements, state.classic, state.turbo]);

  // Auto-clear toast after 3s
  useEffect(() => {
    if (!state.lastUnlock) return;
    const id = setTimeout(() => dispatch({ type: 'clearToast' }), 3000);
    return () => clearTimeout(id);
  }, [state.lastUnlock]);

  const unlock        = useCallback((id: AchievementId) => dispatch({ type: 'unlock', id }), []);
  const toggleClassic = useCallback(() => dispatch({ type: 'toggleClassic' }), []);
  const setTurbo      = useCallback((v: boolean) => dispatch({ type: 'setTurbo', value: v }), []);
  const resetProgress = useCallback(() => { localStorage.removeItem('khimesra.game.v1'); dispatch({ type: 'reset' }); }, []);
  const dispatchEvent = useCallback((e: GameEvent) => {
    if (e.type === 'theme')  dispatch({ type: 'toggleClassic' }); // simple toggle for now
    if (e.type === 'reset')  resetProgress();
    emitter.dispatchEvent(new CustomEvent('game', { detail: e }));
  }, [emitter, resetProgress]);

  const value = useMemo<Ctx>(() => ({ ...state, unlock, toggleClassic, setTurbo, resetProgress, dispatchEvent, emitter }),
    [state, unlock, toggleClassic, setTurbo, resetProgress, dispatchEvent, emitter]);

  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>;
}

export function useGame(): Ctx {
  const v = useContext(GameCtx);
  if (!v) throw new Error('useGame must be used inside <GameProvider>');
  return v;
}

export { ACHIEVEMENTS };
```

- [ ] **Step 2: Commit**

```bash
git add components/game/GameProvider.tsx
git commit -m "feat(game): GameProvider with localStorage hydration"
```

---

### Task 8: `HUD` (XP, streak, classic toggle)

**Files:**
- Create: `components/game/HUD.tsx`

- [ ] **Step 1: Implement**

```tsx
'use client';
import { useGame } from './GameProvider';

export function HUD() {
  const { xp, streak, classic, toggleClassic } = useGame();
  return (
    <div className="flex items-center gap-3 text-xs text-muted" role="status" aria-live="polite">
      <span className="text-ball">XP {xp}</span>
      <span aria-hidden>·</span>
      <span>🔥{streak}</span>
      <span aria-hidden>·</span>
      <button onClick={toggleClassic} className="underline decoration-dotted hover:text-prompt focus:text-prompt"
        aria-pressed={classic} data-target="hud-toggle">
        [{classic ? 'game' : 'no-game'}]
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/game/HUD.tsx
git commit -m "feat(game): XP/streak HUD with classic-mode toggle"
```

---

### Task 9: `AchievementToast`

**Files:**
- Create: `components/game/AchievementToast.tsx`

- [ ] **Step 1: Implement**

```tsx
'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from './GameProvider';

export function AchievementToast() {
  const { lastUnlock } = useGame();
  return (
    <div className="fixed bottom-4 right-4 z-40 pointer-events-none" aria-live="polite">
      <AnimatePresence>
        {lastUnlock && (
          <motion.div
            key={lastUnlock.id}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="border border-prompt/40 bg-bg/95 backdrop-blur px-4 py-3 rounded-md shadow-[0_0_24px_rgba(76,217,100,0.18)] text-sm">
            <div className="text-prompt font-medium">✓ {lastUnlock.title}</div>
            <div className="text-muted text-xs mt-0.5">{lastUnlock.description}</div>
            <div className="text-ball text-xs mt-1">+{lastUnlock.xp} XP</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/game/AchievementToast.tsx
git commit -m "feat(game): achievement toast"
```

---

## Phase 4 — Terminal UI

### Task 10: `TerminalWindow` + `BlockReveal`

**Files:**
- Create: `components/terminal/TerminalWindow.tsx`
- Create: `components/terminal/BlockReveal.tsx`

- [ ] **Step 1: BlockReveal**

```tsx
// components/terminal/BlockReveal.tsx
'use client';
import { motion, useReducedMotion } from 'framer-motion';

export function BlockReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay }}>
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: TerminalWindow**

```tsx
// components/terminal/TerminalWindow.tsx
'use client';
import { HUD } from '@/components/game/HUD';

export function TerminalWindow({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen w-full flex justify-center p-3 md:p-8">
      <section className="w-full max-w-[860px] border border-chrome rounded-lg overflow-hidden bg-[#0a0e0a] shadow-[0_0_60px_rgba(76,217,100,0.06)]">
        <header className="flex items-center justify-between px-4 py-2 border-b border-chrome bg-[#0d130d]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" aria-hidden />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" aria-hidden />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" aria-hidden />
            <span className="ml-3 text-xs text-muted">sarvesh@razorpay:~$</span>
          </div>
          <HUD />
        </header>
        <div className="p-5 md:p-8 space-y-8" data-target="terminal-body">{children}</div>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/terminal/TerminalWindow.tsx components/terminal/BlockReveal.tsx
git commit -m "feat(terminal): window chrome + block reveal"
```

---

### Task 11: `CommandBlock`

**Files:**
- Create: `components/terminal/CommandBlock.tsx`

- [ ] **Step 1: Implement**

```tsx
// components/terminal/CommandBlock.tsx
import { BlockReveal } from './BlockReveal';

export function CommandBlock({ command, delay = 0, children, id }: {
  command: string; delay?: number; children: React.ReactNode; id?: string;
}) {
  return (
    <BlockReveal delay={delay}>
      <div data-target={id ? `block-${id}` : undefined} className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-prompt">$</span>
          <span className="text-fg">{command}</span>
        </div>
        <div className="pl-4 border-l border-chrome">{children}</div>
      </div>
    </BlockReveal>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/terminal/CommandBlock.tsx
git commit -m "feat(terminal): CommandBlock"
```

---

### Task 12: `CommandInput`

**Files:**
- Create: `components/terminal/CommandInput.tsx`

- [ ] **Step 1: Implement**

```tsx
// components/terminal/CommandInput.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { useGame } from '@/components/game/GameProvider';
import { runCommand, type CommandOutput } from '@/components/game/commands';

type Entry = { input: string; output: CommandOutput };

export function CommandInput() {
  const { unlock, dispatchEvent, emitter } = useGame();
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<Entry[]>([]);
  const [typedOnce, setTypedOnce] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onClear = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.type === 'clear') setHistory([]);
    };
    emitter.addEventListener('game', onClear);
    return () => emitter.removeEventListener('game', onClear);
  }, [emitter]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    const output = runCommand(value, { unlock, emit: dispatchEvent });
    setHistory(h => [...h, { input: value, output }]);
    setValue('');
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    if (!typedOnce && e.target.value.length > 0) { unlock('inspector'); setTypedOnce(true); }
  }

  return (
    <div className="space-y-3" data-target="prompt-area">
      {history.map((h, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-baseline gap-2"><span className="text-prompt">$</span><span className="text-fg">{h.input}</span></div>
          {h.output.kind === 'text'      && <pre className="pl-4 border-l border-chrome whitespace-pre-wrap text-fg/90 text-sm">{h.output.body}</pre>}
          {h.output.kind === 'error'     && <pre className="pl-4 border-l border-chrome whitespace-pre-wrap text-[#ff8080] text-sm">{h.output.body}</pre>}
          {h.output.kind === 'component' && <ComponentSlot kind={h.output.body} />}
        </div>
      ))}
      <form onSubmit={handleSubmit} className="flex items-baseline gap-2">
        <span className="text-prompt">$</span>
        <input
          ref={inputRef}
          aria-label="Enter command"
          autoFocus
          autoComplete="off"
          spellCheck={false}
          className="flex-1 bg-transparent outline-none text-fg placeholder:text-muted"
          placeholder="type 'help'"
          value={value}
          onChange={handleChange}
        />
        <span className="caret w-[8px] h-[16px] bg-prompt inline-block" aria-hidden />
      </form>
    </div>
  );
}

import dynamic from 'next/dynamic';

const ShayariModal = dynamic(() => import('@/components/secret/ShayariModal').then(m => m.ShayariModal), { ssr: false });
const SongPlayer   = dynamic(() => import('@/components/SongPlayer'),                       { ssr: false });
const Gallery      = dynamic(() => import('@/components/secret/Gallery').then(m => m.Gallery), { ssr: false });

function ComponentSlot({ kind }: { kind: string }) {
  if (kind === 'shayari')         return <ShayariModal inline />;
  if (kind === 'song:maafi')      return <SongPlayer audioSrc="/audio/song.mp3" title="Maafi" />;
  if (kind === 'gallery:travel')  return <Gallery which="travel" />;
  if (kind === 'gallery:sports')  return <Gallery which="sports" />;
  if (kind === 'whoami')          return <pre className="text-fg/90">sarvesh khimesra · ai builder · razorpay '26</pre>;
  if (kind === 'about')           return <p className="text-fg/90 text-sm leading-relaxed">see the about block above. (run 'help' for the menu.)</p>;
  if (kind === 'projects')        return <p className="text-fg/90 text-sm">scroll up — projects/ already listed.</p>;
  if (kind === 'contact')         return <p className="text-fg/90 text-sm">socials are above.</p>;
  return null;
}
```

- [ ] **Step 2: Commit**

```bash
git add components/terminal/CommandInput.tsx
git commit -m "feat(terminal): live command input with dynamic component slots"
```

---

## Phase 5 — Cursor and ball physics

### Task 13: `TennisCursor`

**Files:**
- Create: `components/game/TennisCursor.tsx`

- [ ] **Step 1: Implement**

```tsx
// components/game/TennisCursor.tsx
'use client';
import { useEffect, useRef } from 'react';
import { useGame } from './GameProvider';

export function TennisCursor() {
  const { classic } = useGame();
  const racquetRef = useRef<HTMLDivElement>(null);
  const ballRef    = useRef<HTMLDivElement>(null);
  const target     = useRef({ x: 0, y: 0 });
  const racquet    = useRef({ x: 0, y: 0 });
  const ball       = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (classic) return;
    const onMove = (e: PointerEvent) => { target.current.x = e.clientX; target.current.y = e.clientY; };
    window.addEventListener('pointermove', onMove);
    let raf = 0;
    const tick = () => {
      racquet.current.x += (target.current.x - racquet.current.x) * 0.20;
      racquet.current.y += (target.current.y - racquet.current.y) * 0.20;
      ball.current.x    += (racquet.current.x + 14 - ball.current.x) * 0.10;
      ball.current.y    += (racquet.current.y + 14 - ball.current.y) * 0.10;
      if (racquetRef.current) racquetRef.current.style.transform = `translate(${racquet.current.x - 18}px, ${racquet.current.y - 18}px) rotate(-18deg)`;
      if (ballRef.current)    ballRef.current.style.transform    = `translate(${ball.current.x - 6}px, ${ball.current.y - 6}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove); };
  }, [classic]);

  if (classic) return null;
  return (
    <>
      <div ref={racquetRef} className="fixed top-0 left-0 w-9 h-9 z-[60] pointer-events-none" aria-hidden>
        <svg viewBox="0 0 40 40" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 6px rgba(217,240,74,0.5))' }}>
          <ellipse cx="14" cy="14" rx="11" ry="13" fill="none" stroke="#d9f04a" strokeWidth="2" />
          <g stroke="#d9f04a" strokeWidth="0.7" opacity="0.85">
            <line x1="4" y1="14" x2="25" y2="14" />
            <line x1="14" y1="2" x2="14" y2="27" />
            <line x1="7" y1="6" x2="22" y2="22" />
            <line x1="22" y1="6" x2="7" y2="22" />
          </g>
          <line x1="22" y1="22" x2="36" y2="36" stroke="#8a6a2a" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <div ref={ballRef} className="fixed top-0 left-0 w-3 h-3 rounded-full bg-ball z-[60] pointer-events-none"
        style={{ boxShadow: '0 0 10px #d9f04a' }} aria-hidden />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/game/TennisCursor.tsx
git commit -m "feat(game): TennisCursor with racquet+ball follow"
```

---

### Task 14: `BallField` (click-to-serve physics + collisions)

**Files:**
- Create: `components/game/BallField.tsx`

- [ ] **Step 1: Implement**

```tsx
// components/game/BallField.tsx
'use client';
import { useEffect, useRef } from 'react';
import { useGame } from './GameProvider';

type Ball = { x: number; y: number; vx: number; vy: number; bornAt: number; bounces: number; targetsHit: Set<string>; el: HTMLDivElement };

export function BallField() {
  const { classic, turbo, unlock } = useGame();
  const containerRef = useRef<HTMLDivElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const servedRef = useRef(false);

  useEffect(() => {
    if (classic) return;
    const container = containerRef.current!;
    const MAX_BALLS = 8;

    function spawn(x: number, y: number) {
      if (ballsRef.current.length >= MAX_BALLS) {
        const oldest = ballsRef.current.shift();
        oldest?.el.remove();
      }
      const speed = turbo ? 7 : 4.5;
      const angle = Math.random() * Math.PI * 2;
      const el = document.createElement('div');
      el.style.cssText = `position:fixed;left:0;top:0;width:14px;height:14px;border-radius:50%;background:#d9f04a;box-shadow:0 0 ${turbo ? 22 : 12}px #d9f04a;pointer-events:none;z-index:55`;
      container.appendChild(el);
      ballsRef.current.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, bornAt: performance.now(), bounces: 0, targetsHit: new Set(), el });
      if (!servedRef.current) { servedRef.current = true; unlock('server'); }
    }

    function onClick(e: PointerEvent) {
      const t = e.target as HTMLElement;
      if (t.closest('a, button, input, [role="button"]')) return; // don't hijack real clicks
      spawn(e.clientX, e.clientY);
    }
    window.addEventListener('pointerdown', onClick);

    function rectsOverlap(b: Ball, r: DOMRect) {
      return b.x + 7 > r.left && b.x - 7 < r.right && b.y + 7 > r.top && b.y - 7 < r.bottom;
    }

    let raf = 0;
    const tick = (now: number) => {
      const w = window.innerWidth, h = window.innerHeight;
      const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-target]'));
      const surviving: Ball[] = [];
      for (const b of ballsRef.current) {
        b.x += b.vx; b.y += b.vy;
        let bounced = false;
        if (b.x < 7)      { b.x = 7;     b.vx *= -1; bounced = true; }
        if (b.x > w - 7)  { b.x = w - 7; b.vx *= -1; bounced = true; }
        if (b.y < 7)      { b.y = 7;     b.vy *= -1; bounced = true; }
        if (b.y > h - 7)  { b.y = h - 7; b.vy *= -1; bounced = true; }
        if (bounced) b.bounces++;

        for (const t of targets) {
          const r = t.getBoundingClientRect();
          if (rectsOverlap(b, r)) {
            const key = (t.dataset.target || '') + ':' + r.left + ',' + r.top;
            if (!b.targetsHit.has(key)) {
              b.targetsHit.add(key);
              t.animate(
                [{ filter: 'brightness(1)' }, { filter: 'brightness(1.6) drop-shadow(0 0 8px #d9f04a)' }, { filter: 'brightness(1)' }],
                { duration: 320 }
              );
              if (b.targetsHit.size >= 3) unlock('net_shot');
            }
            // simple deflection
            const cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2;
            const dx = b.x - cx, dy = b.y - cy;
            if (Math.abs(dx) > Math.abs(dy)) b.vx = Math.sign(dx) * Math.abs(b.vx); else b.vy = Math.sign(dy) * Math.abs(b.vy);
          }
        }

        const age = now - b.bornAt;
        if (age >= 10000 && !b.targetsHit.has('__volley__')) { unlock('volley'); b.targetsHit.add('__volley__'); }
        if (b.bounces >= 3 || age > 12000) { b.el.remove(); continue; }

        b.el.style.transform = `translate(${b.x - 7}px, ${b.y - 7}px)`;
        surviving.push(b);
      }
      ballsRef.current = surviving;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointerdown', onClick);
      ballsRef.current.forEach(b => b.el.remove());
      ballsRef.current = [];
    };
  }, [classic, turbo, unlock]);

  return <div ref={containerRef} aria-hidden />;
}
```

- [ ] **Step 2: Commit**

```bash
git add components/game/BallField.tsx
git commit -m "feat(game): live ball physics, collisions, achievements"
```

---

### Task 15: Konami listener → turbo

**Files:**
- Create: `components/game/konami.ts`
- Create: `components/game/KonamiListener.tsx`

- [ ] **Step 1: Konami sequence detector**

```ts
// components/game/konami.ts
export const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];
export function matchKonami(history: string[]): boolean {
  if (history.length < KONAMI.length) return false;
  const tail = history.slice(-KONAMI.length);
  return KONAMI.every((k, i) => k === tail[i]);
}
```

- [ ] **Step 2: Listener component**

```tsx
// components/game/KonamiListener.tsx
'use client';
import { useEffect, useRef } from 'react';
import { useGame } from './GameProvider';
import { matchKonami } from './konami';

export function KonamiListener() {
  const { unlock, setTurbo } = useGame();
  const history = useRef<string[]>([]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      history.current.push(e.code);
      if (history.current.length > 20) history.current.shift();
      if (matchKonami(history.current)) { unlock('turbo'); setTurbo(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [unlock, setTurbo]);
  return null;
}
```

- [ ] **Step 3: Commit**

```bash
git add components/game/konami.ts components/game/KonamiListener.tsx
git commit -m "feat(game): konami unlocks turbo"
```

---

## Phase 6 — Content + secret modals + page wiring

### Task 16: Content files and secret components

**Files:**
- Create: `content/about.ts`
- Create: `content/projects.ts`
- Create: `components/secret/ShayariModal.tsx`
- Create: `components/secret/Gallery.tsx`
- Create: `content/secret-shayari.ts`
- Create: `content/secret-travel.ts`
- Create: `content/secret-sports.ts`

- [ ] **Step 1: About + projects**

```ts
// content/about.ts
export const ABOUT_LINES = [
  "I'm Sarvesh. I experiment with AI and build things that excite me.",
  "Joining Razorpay as a GTM AI Builder on 2026-05-06 — exactly the kind of role I was looking for.",
  "Multidisciplinary by training (UPSC prep, history, economics). Generalist who connects dots across domains.",
  "If you're building at the intersection of AI and business — let's talk.",
];
```

```ts
// content/projects.ts
export type Project = { slug: string; title: string; description: string; links?: { label: string; href: string }[] };
export const PROJECTS: Project[] = [
  { slug: 'ai-experiments', title: 'AI experiments', description: 'Turning rough ideas into working prototypes with Claude Code, Codex, and v0.' },
  { slug: 'gtm-x-ai',       title: 'GTM × AI',       description: 'How AI is changing go-to-market: positioning, outreach, product-led growth.' },
  { slug: 'find-tribe',     title: 'Looking for tribe', description: 'Talking to people building at the AI + business edge. Reach out — links above.' },
];
```

- [ ] **Step 2: Secret content**

```ts
// content/secret-shayari.ts
export const SHAYARI = [
  { text: "बेसब्र, बेखबर, बेइंतहां यू ही चलता जा रहा।\nकुछ पाने की आस लिए यू ही भटकता जा रहा।।", audio: '/audio/shayari-1.mp3' },
  { text: "उस हरकत-ए-शाम में तुम भी मत खो जाना\nउस मंज़र-ए-वतन में तुम भी मत भूल जाना", audio: '/audio/shayari-2.mp3' },
  { text: "उनके ईमान पर अर्ज़ करने की अब फ़ुर्सत नहीं है\nउनकी फ़ितरतों पर इशारा करने का अब खर्च नहीं है", audio: '/audio/shayari-3.mp3' },
];
```

```ts
// content/secret-travel.ts
export const TRAVEL_INDIA = [
  { src: '/images/photos/trip-2026/lakefront-dusk.jpg',   alt: 'Lakefront at dusk',  caption: 'Lakefront, dusk' },
  { src: '/images/photos/trip-2026/courtyard-lounge.jpg', alt: 'Courtyard lounge',   caption: 'Courtyard, afternoon' },
];
```

```ts
// content/secret-sports.ts
export const SPORTS = [
  { src: '/images/photos/tennis.jpg',     alt: 'Sarvesh playing tennis',  caption: 'Tennis, happy place' },
  { src: '/images/photos/cricket.jpg',    alt: 'Cricket at IPL',           caption: 'RCB forever' },
  { src: '/images/photos/tennis-duo.jpg', alt: 'Tennis with partner',     caption: 'Post-match smiles' },
];
```

- [ ] **Step 3: ShayariModal (inline list)**

```tsx
// components/secret/ShayariModal.tsx
'use client';
import { SHAYARI } from '@/content/secret-shayari';
import { useState } from 'react';

export function ShayariModal({ inline = false }: { inline?: boolean }) {
  const [playing, setPlaying] = useState<number | null>(null);
  return (
    <div className={inline ? 'space-y-4' : 'fixed inset-0 z-40 bg-bg/95 p-6 overflow-auto'}>
      {SHAYARI.map((s, i) => (
        <div key={i} className="border border-chrome rounded p-3" data-target={`shayari-${i}`}>
          <pre className="whitespace-pre-wrap text-fg/90 text-sm leading-relaxed">{s.text}</pre>
          <button
            onClick={() => {
              const a = new Audio(s.audio);
              setPlaying(i);
              a.play().catch(() => {});
              a.onended = () => setPlaying(null);
            }}
            className="mt-2 text-xs text-prompt hover:text-ball">
            {playing === i ? '◼ playing' : '▶ play'}
          </button>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Gallery (used for travel + sports)**

```tsx
// components/secret/Gallery.tsx
'use client';
import Image from 'next/image';
import { TRAVEL_INDIA } from '@/content/secret-travel';
import { SPORTS } from '@/content/secret-sports';

const SETS = { travel: TRAVEL_INDIA, sports: SPORTS };

export function Gallery({ which }: { which: 'travel' | 'sports' }) {
  const items = SETS[which];
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((it) => (
        <figure key={it.src} className="space-y-1" data-target={`photo-${which}`}>
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-chrome">
            <Image src={it.src} alt={it.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 240px" />
          </div>
          <figcaption className="text-xs text-muted">{it.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add content components/secret
git commit -m "feat: about/projects content + secret command components"
```

---

### Task 17: Wire `app/page.tsx` and `app/layout.tsx`

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Add providers to layout**

Replace `app/layout.tsx` body section so it wraps children with `GameProvider`, mounts `TennisCursor`, `BallField`, `KonamiListener`, `AchievementToast`:

```tsx
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/components/game/GameProvider";
import { TennisCursor } from "@/components/game/TennisCursor";
import { BallField } from "@/components/game/BallField";
import { KonamiListener } from "@/components/game/KonamiListener";
import { AchievementToast } from "@/components/game/AchievementToast";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400","500","600"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Sarvesh Khimesra · AI Builder",
  description: "AI builder. GTM × AI. Joining Razorpay 2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <body>
        <GameProvider>
          {children}
          <TennisCursor />
          <BallField />
          <KonamiListener />
          <AchievementToast />
        </GameProvider>
        <div className="scanlines" aria-hidden />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Rewrite `app/page.tsx`**

```tsx
// app/page.tsx
import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { CommandBlock } from "@/components/terminal/CommandBlock";
import { CommandInput } from "@/components/terminal/CommandInput";
import { ABOUT_LINES } from "@/content/about";
import { PROJECTS } from "@/content/projects";

export default function HomePage() {
  return (
    <TerminalWindow>
      <CommandBlock command="whoami" delay={0.0} id="whoami">
        <h1 className="text-prompt text-2xl md:text-3xl font-medium">sarvesh khimesra</h1>
        <p className="text-muted text-sm mt-1">ai builder · gtm × ai · razorpay '26</p>
      </CommandBlock>

      <CommandBlock command="cat about.md" delay={0.10} id="about">
        <div className="space-y-3 text-fg/90 text-sm leading-relaxed">
          {ABOUT_LINES.map((line, i) => <p key={i}>{line}</p>)}
        </div>
      </CommandBlock>

      <CommandBlock command="ls projects/" delay={0.20} id="projects">
        <ul className="space-y-2 text-sm">
          {PROJECTS.map(p => (
            <li key={p.slug} className="grid grid-cols-[160px_1fr] gap-3" data-target={`project-${p.slug}`}>
              <span className="text-prompt">{p.slug}/</span>
              <span><span className="text-fg">{p.title}</span> <span className="text-muted">— {p.description}</span></span>
            </li>
          ))}
        </ul>
      </CommandBlock>

      <CommandBlock command="contact --me" delay={0.30} id="contact">
        <ul className="flex flex-wrap gap-4 text-sm">
          <li><a data-target="social-li" href="https://www.linkedin.com/in/sarvesh-khimesra/" target="_blank" rel="noopener" className="text-prompt hover:text-ball underline decoration-dotted">linkedin</a></li>
          <li><a data-target="social-tw" href="https://x.com/SKhimesra"                       target="_blank" rel="noopener" className="text-prompt hover:text-ball underline decoration-dotted">twitter</a></li>
          <li><a data-target="social-ig" href="https://www.instagram.com/sarveshrf/"          target="_blank" rel="noopener" className="text-prompt hover:text-ball underline decoration-dotted">instagram</a></li>
        </ul>
      </CommandBlock>

      <CommandInput />

      <noscript>
        <p className="text-muted text-sm">Static fallback: see About, Projects, and the social links above. Game/cursor/secret commands need JavaScript.</p>
      </noscript>
    </TerminalWindow>
  );
}
```

- [ ] **Step 3: Run dev and click around**

```bash
npm run dev
```
Manually verify on http://localhost:3000:
- Page loads with terminal chrome and 4 command blocks.
- HUD shows `XP 10 · 🔥1` (first_contact unlocked, streak 1) within ~1s.
- Racquet follows the cursor; ball trails.
- Click on background → a yellow ball is served; bounces off walls.
- Type `help` then Enter → list appears.
- Type `shayari` → shayari list appears; toast pops with `+50 XP`.
- Type `xyzzy` → "command not found".
- Type `clear` → input history clears.
- Toggle `[no-game]` → cursor and ball vanish.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/page.tsx
git commit -m "feat: wire terminal page with providers, blocks, input"
```

---

## Phase 7 — Asset cleanup, mobile, build, deploy

### Task 18: Photo cleanup + Vercel-friendly image sizes

**Files:**
- Delete: every Ireland photo in `public/images/photos/`
- Verify present: `public/images/photos/trip-2026/{lakefront-dusk,courtyard-lounge}.jpg`, plus `tennis.jpg`, `tennis-duo.jpg`, `cricket.jpg`

- [ ] **Step 1: Delete Ireland photos**

```bash
cd /Users/sarveshkhimesra/sarvesh-portfolio/public/images/photos
rm -f IMG_6775.jpg IMG_7444.jpg IMG_7532.jpg IMG_7721.jpg IMG_7944.jpg IMG_7949.jpg IMG_8028.jpg IMG_8033.jpg IMG_8218.jpg IMG_8226.jpg IMG_8254.jpg IMG_8402.jpg IMG_8870.jpg IMG_2279.jpg ireland-group.jpg
ls
```
Expected listing: `cricket.jpg`, `tennis.jpg`, `tennis-duo.jpg`, and the `trip-2026/` folder.

- [ ] **Step 2: Allow remote images? (No — all local.)**

No `next.config.mjs` change needed; verify `images` config still allows local /public.

- [ ] **Step 3: Commit**

```bash
git add public/images/photos
git commit -m "chore(assets): drop ireland photos; trip-2026 set is the new travel gallery"
```

---

### Task 19: Mobile / reduced-motion / a11y polish

**Files:**
- Modify: `components/game/TennisCursor.tsx`, `components/game/BallField.tsx`, `app/globals.css`

- [ ] **Step 1: Bail out on touch and reduced motion**

In `TennisCursor.tsx`, at the top of the effect, add:
```ts
if (typeof window !== 'undefined' && (matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia('(hover: none) and (pointer: coarse)').matches)) return;
```
In `BallField.tsx`, add the same guard but **keep** click-to-spawn — touch users still get a ball, just without the cursor trail.

- [ ] **Step 2: Manual checks**

In Chrome DevTools, toggle "Emulate CSS prefers-reduced-motion: reduce" → cursor and ball trail are gone; clicks still serve a ball with no motion path (single fade). Toggle device emulation (iPhone) → OS cursor is visible, taps still serve.

- [ ] **Step 3: Commit**

```bash
git add components/game app/globals.css
git commit -m "feat(a11y): respect reduced-motion and touch devices"
```

---

### Task 20: Final build + Lighthouse + preview deploy

- [ ] **Step 1: Type check + build**

```bash
npm run lint
npm run build
```
Expected: no errors. If `next` complains about any orphaned import (deleted files), grep and fix:
```bash
grep -rn "BentoCard\|Polaroid\|notion\|GradientMesh" app components content || echo OK
```

- [ ] **Step 2: Local Lighthouse**

```bash
npm run start
```
Open http://localhost:3000 in Chrome Incognito → Lighthouse → run Mobile audit. Targets: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

- [ ] **Step 3: Preview deploy to Vercel**

```bash
npx vercel@latest
```
Choose the linked `sarveshkhimesra` project. After deploy completes, open the preview URL and smoke-test:
- All 4 command blocks render
- HUD increments XP when typing
- Cursor + ball work
- Type `shayari`, `play maafi`, `ls travel/india`, `ls sports`, then konami code → all behave per spec
- Toggle `[no-game]` → cursor/ball gone, content readable
- Hard-refresh → XP and achievements persist

- [ ] **Step 4: Promote to production (only after manual approval)**

```bash
npx vercel@latest --prod
```

- [ ] **Step 5: Final commit + tag**

```bash
git add -A
git commit --allow-empty -m "chore: terminal portfolio v1 shipped" && git tag terminal-v1
```

---

## Self-Review Notes

- **Spec coverage:** every spec section is implemented — visual system (Task 3), page structure (Task 17), tennis cursor (Tasks 13–14), gamification (Tasks 4–9, 14, 15), components & architecture (all of Phases 3–6), accessibility (Task 19), deployment (Task 20). Notion removal + asset cleanup (Tasks 2, 18). Streak storage (Task 4).
- **Placeholders:** none. Every step has either runnable code or an exact command.
- **Type consistency:** `AchievementId` defined in Task 5, reused in Task 6 (`CommandCtx`) and Task 7 (`GameProvider` action). `GameEvent` defined in Task 6, consumed in Task 7 (`dispatchEvent`) and Task 12 (`CommandInput` clear handler). `Command.run` returns `CommandOutput`, consumed by `CommandInput`'s history rendering.
- **Risks called out:** `BallField`'s use of `getBoundingClientRect()` per frame on every target is fine for ≤ 30 targets but should be cached if the count grows. The `next/dynamic` slot in `CommandInput` imports `SongPlayer` lazily, so it does not bloat first-load JS.
