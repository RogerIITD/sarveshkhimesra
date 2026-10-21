import { Experience } from '@/components/Experience';
import { BIO, SOCIALS } from '@/content/os';

export default function HomePage() {
  return (
    <>
      <Experience />
      <noscript>
        <div style={{ padding: 24 }}>
          <h1>{BIO.name}</h1>
          <p>{BIO.title}</p>
          {BIO.lines.map((l) => (
            <p key={l}>{l}</p>
          ))}
          {SOCIALS.map((s) => (
            <a key={s.id} href={s.href} style={{ marginRight: 12 }}>
              {s.label}
            </a>
          ))}
        </div>
      </noscript>
    </>
  );
}
