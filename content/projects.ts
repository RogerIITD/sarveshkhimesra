export type Project = {
  slug: string;
  title: string;
  description: string;
};

export const PROJECTS: Project[] = [
  {
    slug: 'ai-experiments',
    title: 'AI experiments',
    description: 'Turning rough ideas into working prototypes with Claude Code, Codex, and v0.',
  },
  {
    slug: 'gtm-x-ai',
    title: 'GTM × AI',
    description: 'How AI is changing go-to-market: positioning, outreach, product-led growth.',
  },
  {
    slug: 'find-tribe',
    title: 'looking for tribe',
    description: 'Talking to people building at the AI + business edge. Reach out — links above.',
  },
];
