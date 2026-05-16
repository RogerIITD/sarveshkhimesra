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
  {
    name: 'help',
    describe: 'list visible commands',
    run: () => ({
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
        '  reset             wipe saved progress',
        '  help              this list',
      ].join('\n'),
    }),
  },
  {
    name: 'whoami',
    describe: 'who am i',
    run: () => ({ kind: 'component', body: 'whoami' }),
  },
  {
    name: 'cat',
    describe: 'cat <file>',
    run: (args) =>
      args[0] === 'about.md'
        ? { kind: 'component', body: 'about' }
        : { kind: 'error', body: `cat: ${args.join(' ') || '(no file)'}: no such file` },
  },
  {
    name: 'contact',
    describe: 'contact --me',
    run: (args) =>
      args[0] === '--me'
        ? { kind: 'component', body: 'contact' }
        : { kind: 'error', body: `contact: try 'contact --me'` },
  },
  {
    name: 'clear',
    describe: 'clear the screen',
    run: (_a, ctx) => {
      ctx.emit({ type: 'clear' });
      return { kind: 'text', body: '' };
    },
  },
  {
    name: 'theme',
    describe: 'theme classic | theme game',
    run: (args, ctx) => {
      if (args[0] === 'classic') {
        ctx.emit({ type: 'theme', mode: 'classic' });
        return { kind: 'text', body: 'theme: classic' };
      }
      if (args[0] === 'game') {
        ctx.emit({ type: 'theme', mode: 'game' });
        return { kind: 'text', body: 'theme: game' };
      }
      return { kind: 'error', body: `theme: expected 'classic' or 'game'` };
    },
  },
  {
    name: 'reset',
    describe: 'wipe progress',
    run: (_a, ctx) => {
      ctx.emit({ type: 'reset' });
      return { kind: 'text', body: 'progress wiped.' };
    },
  },
  // Hidden — not listed in help
  {
    name: 'ls',
    hidden: true,
    describe: 'ls <dir>',
    run: (args, ctx) => {
      const dir = args[0] ?? '';
      if (dir.startsWith('projects')) return { kind: 'component', body: 'projects' };
      if (dir.startsWith('travel')) {
        ctx.unlock('travel_seen');
        ctx.emit({ type: 'open-gallery', key: 'travel' });
        return { kind: 'component', body: 'gallery:travel' };
      }
      if (dir.startsWith('sports')) {
        ctx.unlock('sports_seen');
        ctx.emit({ type: 'open-gallery', key: 'sports' });
        return { kind: 'component', body: 'gallery:sports' };
      }
      return { kind: 'error', body: `ls: ${dir || '(no dir)'}: no such directory` };
    },
  },
  {
    name: 'shayari',
    hidden: true,
    describe: 'open shayari',
    run: (_a, ctx) => {
      ctx.unlock('shayari_open');
      ctx.emit({ type: 'open-shayari' });
      return { kind: 'component', body: 'shayari' };
    },
  },
  {
    name: 'play',
    hidden: true,
    describe: 'play <track>',
    run: (args, ctx) => {
      if (args[0] === 'maafi') {
        ctx.unlock('maafi_played');
        ctx.emit({ type: 'open-song' });
        return { kind: 'component', body: 'song:maafi' };
      }
      return { kind: 'error', body: `play: unknown track '${args.join(' ')}'` };
    },
  },
];

const BY_NAME = new Map(COMMAND_REGISTRY.map((c) => [c.name, c]));

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
