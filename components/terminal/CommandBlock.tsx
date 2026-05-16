import { BlockReveal } from './BlockReveal';

type Props = {
  command: string;
  delay?: number;
  id?: string;
  children: React.ReactNode;
};

export function CommandBlock({ command, delay = 0, id, children }: Props) {
  return (
    <BlockReveal delay={delay}>
      <div className="space-y-3" data-target={id ? `block-${id}` : undefined}>
        <div className="flex items-baseline gap-2">
          <span className="text-prompt">$</span>
          <span className="text-fg">{command}</span>
        </div>
        <div className="pl-4 border-l border-chrome">{children}</div>
      </div>
    </BlockReveal>
  );
}
