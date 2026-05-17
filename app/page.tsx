import { TerminalWindow } from '@/components/terminal/TerminalWindow';
import { CommandBlock } from '@/components/terminal/CommandBlock';
import { CommandInput } from '@/components/terminal/CommandInput';
import { ABOUT_LINES } from '@/content/about';
import { PROJECTS } from '@/content/projects';

export default function HomePage() {
  return (
    <TerminalWindow>
      <CommandBlock command="whoami" delay={0.0} id="whoami">
        <h1 className="text-prompt text-2xl md:text-3xl font-medium">sarvesh khimesra</h1>
        <p className="text-muted text-sm mt-1">ai builder at razorpay</p>
      </CommandBlock>

      <CommandBlock command="cat about.md" delay={0.10} id="about">
        <div className="space-y-3 text-fg/90 text-sm leading-relaxed">
          {ABOUT_LINES.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </CommandBlock>

      <CommandBlock command="ls projects/" delay={0.20} id="projects">
        <ul className="space-y-2 text-sm">
          {PROJECTS.map((p) => (
            <li
              key={p.slug}
              className="grid grid-cols-[160px_1fr] gap-3"
              data-target={`project-${p.slug}`}
            >
              <span className="text-prompt">{p.slug}/</span>
              <span>
                <span className="text-fg">{p.title}</span>
                <span className="text-muted"> — {p.description}</span>
              </span>
            </li>
          ))}
        </ul>
      </CommandBlock>

      <CommandBlock command="contact --me" delay={0.30} id="contact">
        <ul className="flex flex-wrap gap-4 text-sm">
          <li>
            <a
              data-target="social-linkedin"
              href="https://www.linkedin.com/in/sarvesh-khimesra/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-prompt hover:text-ball underline decoration-dotted"
            >
              linkedin
            </a>
          </li>
          <li>
            <a
              data-target="social-twitter"
              href="https://x.com/SKhimesra"
              target="_blank"
              rel="noopener noreferrer"
              className="text-prompt hover:text-ball underline decoration-dotted"
            >
              twitter
            </a>
          </li>
          <li>
            <a
              data-target="social-instagram"
              href="https://www.instagram.com/sarveshrf/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-prompt hover:text-ball underline decoration-dotted"
            >
              instagram
            </a>
          </li>
        </ul>
      </CommandBlock>

      <CommandInput />

      <noscript>
        <p className="text-muted text-xs mt-8">
          static fallback: see whoami, about, projects, and the social links above. cursor / ball /
          secret commands need javascript.
        </p>
      </noscript>
    </TerminalWindow>
  );
}
