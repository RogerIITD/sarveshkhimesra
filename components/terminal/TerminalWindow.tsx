import { HUD } from '@/components/game/HUD';

type Props = { children: React.ReactNode };

export function TerminalWindow({ children }: Props) {
  return (
    <main className="min-h-screen w-full flex justify-center p-2 md:p-8">
      <section className="w-full max-w-[860px] min-w-0 border border-chrome rounded-lg overflow-hidden bg-bg shadow-[0_0_60px_rgba(76,217,100,0.06)]">
        <header className="px-3 sm:px-4 py-2 border-b border-chrome bg-[#0d130d] flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] shrink-0" aria-hidden />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] shrink-0" aria-hidden />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] shrink-0" aria-hidden />
            <span className="ml-2 text-[11px] sm:text-xs text-muted truncate">sarvesh@razorpay:~$</span>
          </div>
          <HUD />
        </header>
        <div className="p-4 sm:p-5 md:p-8 space-y-6 sm:space-y-8 min-w-0" data-target="terminal-body">
          {children}
        </div>
      </section>
    </main>
  );
}
