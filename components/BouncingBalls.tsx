// Ambient tennis balls rallying across the background. Pure CSS, so it costs nothing per frame.
const BALLS = [
  { left: '6%', bottom: '14%', run: '38vw', h: '22vh', t: '9s', b: '1.1s', size: 18, delay: '0s' },
  { left: '48%', bottom: '28%', run: '-30vw', h: '14vh', t: '7s', b: '0.85s', size: 13, delay: '-2s' },
  { left: '30%', bottom: '6%', run: '45vw', h: '30vh', t: '11s', b: '1.35s', size: 22, delay: '-5s' },
];

export function BouncingBalls({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden>
      {BALLS.map((b, i) => (
        <div
          key={i}
          className="ball-run absolute"
          style={{ left: b.left, bottom: b.bottom, animationDelay: b.delay, ['--run' as string]: b.run, ['--t' as string]: b.t, ['--h' as string]: b.h, ['--b' as string]: b.b }}
        >
          <span className="ball-shadow absolute left-0 -bottom-1 rounded-[50%] bg-black/60 blur-[2px]" style={{ width: b.size, height: b.size / 3, animationDelay: b.delay }} />
          <div className="ball-hop" style={{ animationDelay: b.delay }}>
            <svg className="ball-squash block" width={b.size} height={b.size} viewBox="0 0 20 20" style={{ animationDelay: b.delay }}>
              <circle cx="10" cy="10" r="9.5" fill="#d9f45a" />
              <path d="M2.2 4.6C6 6.6 6 13.4 2.2 15.4M17.8 4.6C14 6.6 14 13.4 17.8 15.4" fill="none" stroke="#fff" strokeWidth="1.3" opacity=".85" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
