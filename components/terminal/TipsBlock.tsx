'use client';

import { useGame } from '@/components/game/GameProvider';

const TIPS: { cmd: string; hint: string }[] = [
  { cmd: 'shayari',         hint: 'hindi poetry, in my voice' },
  { cmd: 'play maafi',      hint: 'a song i wrote' },
  { cmd: 'ls travel/india', hint: 'photos from a recent trip' },
  { cmd: 'ls sports',       hint: 'tennis + cricket' },
  { cmd: 'help',            hint: 'all visible commands' },
];

export function TipsBlock() {
  const { dispatchEvent } = useGame();

  return (
    <div className="space-y-3" data-target="block-tips">
      <div className="flex items-baseline gap-2">
        <span className="text-prompt">$</span>
        <span className="text-fg">tips</span>
      </div>
      <div className="pl-4 border-l border-chrome space-y-2">
        <p className="text-muted text-xs">click any of these — or type them at the prompt below.</p>
        <ul className="space-y-1.5">
          {TIPS.map((t) => (
            <li key={t.cmd} className="flex flex-wrap items-baseline gap-3 text-sm">
              <button
                onClick={() => dispatchEvent({ type: 'run', command: t.cmd })}
                className="text-ball border border-chrome hover:border-ball hover:bg-ball/10 px-2 py-0.5 rounded font-mono text-xs"
                data-target={`tip-${t.cmd.replace(/[^a-z]/gi, '-')}`}
              >
                {t.cmd}
              </button>
              <span className="text-muted text-xs">— {t.hint}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
