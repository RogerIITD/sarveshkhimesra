# Terminal Portfolio Redesign — Design Spec

**Date:** 2026-05-16
**Owner:** Sarvesh Khimesra
**Target site:** sarveshkhimesra.vercel.app (Next.js project `sarvesh-portfolio`)

## 1. Overview

Replace the current bento-grid light-theme portfolio with a dark, terminal-styled AI Builder portfolio that gamifies the visit. The page reads as a terminal that auto-ran a sequence of commands on load and now sits at a blinking prompt. A tennis-themed cursor and click-to-serve ball physics sit on top. Reading, scrolling, typing, and clicking award XP and unlock achievements; secret commands reveal cut content (shayari, song, travel, sports) as easter eggs.

The redesign is a full page-level rebuild on the existing stack — Next.js 14 (App Router) + Tailwind + framer-motion + Vercel. No new framework dependencies.

## 2. Visual System

- **Palette**
  - `#0a0e0a` background (deep terminal black)
  - `#4cd964` primary (neon green prompt + headings)
  - `#d9f04a` accent (tennis-ball yellow — ball, XP counter, achievement highlights)
  - `#8d9b8d` secondary (muted grey for body text)
  - `#1f3a1f` chrome/border
- **Type:** JetBrains Mono via `next/font/google`. One font family throughout. Hierarchy is by weight (400/500/600) and color, not size jumps.
- **Layout:** Single terminal window, centered `max-w-[860px]` column on desktop, full-width on mobile. Window chrome at top with three dot buttons and `sarvesh@razorpay:~$` path. XP / streak HUD pinned top-right of the chrome.
- **Texture:** Very subtle horizontal scanline overlay (1px every 3px, ~2% opacity). Disabled when `prefers-reduced-motion: reduce`.
- **Cursor:** OS cursor hidden (`cursor: none` on `<html>`). Replaced by custom racquet + ball.

## 3. Page Structure

The page renders as if four commands have already run. Each output animates in with a brief block-level fade-up (160–240ms total per block — not a per-character typewriter).

```
sarvesh@razorpay:~$ whoami
{Hero — name, one-line pitch, status line for Razorpay start date}

sarvesh@razorpay:~$ cat about.md
{About — short paragraph, AI experimenter, GTM AI Builder, multidisciplinary}

sarvesh@razorpay:~$ ls projects/
{Projects — 3 expandable rows: AI Experiments, GTM × AI, Looking for tribe}

sarvesh@razorpay:~$ contact --me
{Contact — LinkedIn, Twitter/X, Instagram links}

sarvesh@razorpay:~$ _
{Blinking input — user can type commands here}
```

**Animations** are intentionally minimal: each command block fades + translates up by 8px on mount with a 60ms stagger. After mount, blocks are static — no idle motion that competes with the cursor/ball.

**Content sources**
- `content/about.md` — short prose (markdown, parsed at build time via remark or read as static string).
- `content/projects.ts` — typed array `{ slug, title, description, links?[] }`.
- All other commands (`help`, `clear`, secret commands) are wired in `components/game/commands.ts`.

## 4. Tennis Cursor Mechanics

- **Default state**
  - Racquet SVG (36×36, yellow strings, brown grip) follows the cursor with a light spring (lerp factor ~0.18 per frame, capped to 60fps via `requestAnimationFrame`).
  - A small tethered ball trails the racquet by ~18px on its own spring (lerp ~0.10).
- **Click-to-serve**
  - Clicking the page (not on a link/button) launches a new "live ball" from the racquet position with a random angle and speed (~3–5 px/frame).
  - Live balls obey gravity-free 2D physics, bounce off the viewport edges, and decay after 3 wall bounces or 8 seconds (whichever comes first).
- **Target collisions**
  - Any element with `data-target` is a hittable target — section headers, project rows, social links, the prompt cursor.
  - When a live ball overlaps a `data-target`, it counts as a hit: that element briefly flashes, the ball reverses direction, and the hit is recorded.
  - The 3-targets-in-one-serve achievement (`net_shot`) and the 10-second-alive achievement (`volley`) are evaluated by `BallField`.
- **Performance** Maximum 8 live balls at once; older balls are removed. Single `requestAnimationFrame` loop drives both the racquet follow and all live balls.
- **Mobile / touch** Cursor disabled. Tap-to-serve still works: each tap launches a ball from the tap point. Hover-based interactions (achievement tooltips) have tap equivalents.

## 5. Gamification Layer

### 5.1 HUD

Pinned to the top-right of the terminal chrome:

```
XP 240  ·  🔥3  ·  [no-game]
```

- `XP 240` — current XP, animates with a count-up when XP changes.
- `🔥3` — visit streak. On every page load, compare `localStorage.khimesra.streak.lastVisitUTC` to today's UTC date: if it equals yesterday, increment streak; if it equals today, no change; otherwise reset to 1. Stored as `{ count, lastVisitUTC }` under `khimesra.streak.v1`.
- `[no-game]` — toggles classic mode (hides cursor, balls, XP, achievements). Persists per device.

### 5.2 Achievement registry

Each achievement is `{ id, title, description, xp, predicate }`. Predicates are evaluated on the relevant event (scroll, click, command-typed, ball-hit, target-hit) and fire at most once per device.

| id              | trigger                                              | XP  |
| --------------- | ---------------------------------------------------- | --- |
| `first_contact` | page first loaded                                    | 10  |
| `inspector`     | first character typed in the prompt input            | 15  |
| `server`        | first ball served (click or tap)                     | 15  |
| `volley`        | keep a single live ball alive ≥10s                   | 25  |
| `net_shot`      | one ball hits 3 distinct `data-target`s              | 30  |
| `read_it_all`   | every section header scrolled past at least once     | 20  |
| `connector`     | all 3 social links clicked                           | 20  |
| `shayari_open`  | `shayari` command run                                | 50  |
| `maafi_played`  | `play maafi` command run                             | 50  |
| `travel_seen`   | `ls travel` or `ls travel/india` command run         | 50  |
| `sports_seen`   | `ls sports` command run                              | 50  |
| `turbo`         | konami code entered                                  | 75  |

XP and unlocked achievements persist in localStorage under `khimesra.game.v1`. Achievement unlocks pop a toast (bottom-right, ~3 s) with the title, XP gain, and a green flash on the HUD counter.

### 5.3 Command parser

The input prompt accepts:

- **Visible commands:** `help`, `clear`, `reset`, `whoami`, `cat about.md`, `ls projects/`, `contact --me`, `theme classic` / `theme game`.
- **Secret commands (case-insensitive, tab-completion off so they stay hidden):**
  - `shayari` — opens a modal listing the 3 Hindi poems with audio players (assets retained from current site).
  - `play maafi` — embeds the existing "Maafi" song player inline as a new command block.
  - `ls travel` and `ls travel/india` — show the 2 India photos (`lakefront-dusk.jpg`, `courtyard-lounge.jpg`) as a small gallery. (No Ireland section in v2.)
  - `ls sports` — show tennis + cricket photos as a small gallery.
  - `↑↑↓↓←→←→ba` — turbo mode (faster balls, golden trail, persisted).
- **Unknown command:** prints `command not found: <input>. type 'help'.`

`help` lists only visible commands. Secret commands are discovered by exploration.

### 5.4 Classic mode

Toggled via `[no-game]` link or `theme classic` command. When on:

- OS cursor visible, racquet hidden, no live balls.
- HUD shows only `[game]` toggle.
- Achievements still tracked silently (no toasts), so toggling back on doesn't lose progress.
- Persists in localStorage under `khimesra.classic = true`.

## 6. Components & Architecture

```
app/
  page.tsx                  ← terminal layout, renders the 4 command blocks
  layout.tsx                ← font + GameProvider + global theme classes
  globals.css               ← reset, scanline overlay, cursor:none on html
content/
  about.md                  ← prose
  projects.ts               ← typed list { slug, title, description }
  secret/
    shayari.ts              ← 3 Hindi poems (text + audio src)
    travel-india.ts         ← 2 India photos (src + alt + caption)
    sports.ts               ← tennis/cricket photo list
components/terminal/
  TerminalWindow.tsx        ← chrome (dots, path, HUD slot, children)
  CommandBlock.tsx          ← prompt line + animated body
  CommandInput.tsx          ← bottom input, calls commandRegistry.run(input)
  BlockReveal.tsx           ← intersection-observer driven block fade-up
components/game/
  TennisCursor.tsx          ← racquet follow loop (rAF, lerp)
  BallField.tsx             ← live ball physics + collision with [data-target]
  AchievementToast.tsx      ← toast UI rendered from GameProvider state
  HUD.tsx                   ← XP + streak + classic toggle
  GameProvider.tsx          ← React context: { xp, achievements, classic, addXp, unlock, toggleClassic }
  achievements.ts           ← registry (typed array)
  commands.ts               ← command registry { name, hidden, run(args, ctx) }
  konami.ts                 ← global key listener
  storage.ts                ← localStorage read/write with schema version
content rendered via the registries — adding a project or a secret command is a one-file change.
```

### Files removed from the current project

- `app/blog/*`, `app/now/*`, `app/template.tsx`
- `lib/notion.ts` and all notion calls (Notion blog + now page are cut)
- `components/BentoCard.tsx`, `BentoGrid.tsx`, `HeroCard.tsx`
- `components/Polaroid.tsx`, `PhotoCarousel.tsx`, `BlogList.tsx`, `FilterBar.tsx`, `PostCard.tsx`
- `components/Nav.tsx`, `MobileMenu.tsx`, `GradientMesh.tsx`, `SocialDock.tsx`, `PageTransition.tsx`, `ShareButton.tsx`, `ShayariText.tsx`
- `components/ShayariCard.tsx` — replaced by a lighter inline list inside the secret modal
- `components/SongPlayer.tsx` — **kept**, lazy-imported only when `play maafi` runs

### Assets

- Existing audio (`public/audio/shayari-1.mp3`, `shayari-2.mp3`, `shayari-3.mp3`, `song.mp3`) — kept.
- Existing photos in `public/images/photos/` — `tennis.jpg`, `tennis-duo.jpg`, `cricket.jpg` kept. All Ireland photos (`IMG_6775.jpg`, `IMG_7444.jpg`, `IMG_7532.jpg`, `IMG_7721.jpg`, `IMG_7944.jpg`, `IMG_7949.jpg`, `IMG_8028.jpg`, `IMG_8033.jpg`, `IMG_8218.jpg`, `IMG_8226.jpg`, `IMG_8254.jpg`, `IMG_8402.jpg`, `IMG_8870.jpg`, `IMG_2279.jpg`, `ireland-group.jpg`) deleted.
- New: `public/images/photos/trip-2026/lakefront-dusk.jpg`, `public/images/photos/trip-2026/courtyard-lounge.jpg` (already in place).
- Icons in `public/icons/` (linkedin.svg, twitter.svg, instagram.svg) — kept.

## 7. Stack & Dependencies

- **Keep:** Next.js 14, React 18, Tailwind 3, framer-motion 12, TypeScript.
- **Add:** none. JetBrains Mono via `next/font/google`. localStorage is native.
- **Remove:** `@notionhq/client`, `@tailwindcss/typography`.
- **Build target:** All routes are static; no server-side fetches remain. `next build` produces a fully static output.

## 8. Accessibility & Fallbacks

- **Reduced motion** (`prefers-reduced-motion: reduce`): disables scanline overlay, type-on animation (content appears instantly), ball trail, and live-ball physics (click still serves but the ball appears at the target and disappears with a brief fade — no motion path). Achievements still fire.
- **Keyboard navigation**: all interactive elements (social links, project rows, prompt input, classic-mode toggle) are reachable by Tab, with a 2px `#d9f04a` focus ring. The prompt input is the natural keyboard entry point.
- **Touch / mobile**: cursor disabled; tap-to-serve enabled; HUD and toasts repositioned to bottom for thumb reach; prompt remains keyboard-accessible.
- **Screen readers**: terminal blocks use semantic headings (`h1`/`h2`); the prompt input has an `aria-label="Enter command"`; achievement toasts use `aria-live="polite"`. Game canvas/cursor are `aria-hidden="true"`.
- **No-JS fallback**: a plain `<noscript>` block renders hero, about, projects, contact as a static dark-theme page so scrapers and recruiters with JS off still see content.

## 9. Performance & Deployment

- **Bundle:** target ≤ 60kB JS first-load (excluding font). framer-motion is already in the dep tree; everything else is lightweight.
- **Lighthouse:** aim for ≥ 95 on Performance, Accessibility, Best Practices, SEO.
- **Vercel:** continue deploying to the existing `sarveshkhimesra` Vercel project. No env vars needed (Notion is removed).
- **Analytics:** keep the existing Vercel + Google Analytics setup if present; no new analytics added.

## 10. Out of Scope (v2 candidates, not now)

- Multiplayer/leaderboard XP comparison.
- Real tennis mini-game (Pong-style brick break against project tiles).
- Server-persisted progress (currently localStorage only).
- Blog / writing routes — fully removed; can return as a separate decision.
- Internationalization — content is English + occasional Hindi inline.

## 11. Open Questions

None at design lock. Anything that surfaces during planning will be tracked in the implementation plan.
