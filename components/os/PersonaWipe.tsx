'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Persona } from '@/content/personas';
import { useScramble } from './useScramble';

type Props = { persona: Persona; origin: { x: number; y: number }; onCovered: () => void; onDone: () => void };

// Circle wipe from the click point → headline decodes → curtain lifts.
export function PersonaWipe({ persona, origin, onCovered, onDone }: Props) {
  const [phase, setPhase] = useState<'expand' | 'hold' | 'lift'>('expand');
  const headline = useScramble(persona.headline, 520, phase !== 'expand');
  const at = `${origin.x}px ${origin.y}px`;

  return (
    <motion.div
      className="fixed inset-0 z-[1500] flex items-center justify-center"
      style={{ background: persona.wipe }}
      initial={{ clipPath: `circle(0px at ${at})`, y: 0 }}
      animate={
        phase === 'expand'
          ? { clipPath: `circle(150% at ${at})` }
          : phase === 'lift'
            ? { y: '-100%' }
            : {}
      }
      transition={phase === 'lift' ? { duration: 0.6, ease: [0.76, 0, 0.24, 1] } : { duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
      onAnimationComplete={() => {
        if (phase === 'expand') {
          onCovered();
          setPhase('hold');
          setTimeout(() => setPhase('lift'), 750);
        } else if (phase === 'lift') onDone();
      }}
      aria-hidden
    >
      <div className="text-center px-6">
        <p className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: `rgb(${persona.accent})` }}>
          {persona.glyph} switching to {persona.label}
        </p>
        <h2
          className={`mt-4 text-4xl md:text-6xl font-semibold tracking-tight text-ink ${
            persona.font === 'hindi' ? 'font-hindi' : persona.font === 'mono' ? 'font-mono' : 'font-sans'
          }`}
        >
          {phase === 'expand' ? ' ' : headline}
        </h2>
      </div>
      <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: `rgb(${persona.accent} / 0.6)` }} />
    </motion.div>
  );
}
