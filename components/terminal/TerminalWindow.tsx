import { HUD } from '@/components/game/HUD';

type Props = { children: React.ReactNode };

export function TerminalWindow({ children }: Props) {
  return (
    <main className="min-h-screen w-full flex justify-center p-3 md:p-8">
      <section className="w-full max-w-[860px] border border-chrome rounded-lg overflow-hidden bg-bg shadow-[0_0_60px_rgba(76,217,100,0.06)]">
        <header className="flex items-center justify-between px-4 py-2 border-b border-chrome bg-[#0d130d]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" aria-hidden />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" aria-hidden />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" aria-hidden />
            <span className="ml-3 text-xs text-muted">sarvesh@razorpay:~$</span>
          </div>
          <HUD />
        </header>
        <div className="p-5 md:p-8 space-y-8" data-target="terminal-body">
          {children}
        </div>
      </section>
    </main>
  );
}
