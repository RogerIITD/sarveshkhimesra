'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';

type Props = { text: string; progress: MotionValue<number>; from: number; to: number; className?: string };

// Scroll-scrubbed word-by-word reveal: each word sharpens out of a blur in turn.
export function Words({ text, progress, from, to, className }: Props) {
  const words = text.split(' ');
  const step = (to - from) / words.length;
  return (
    <p className={className}>
      {words.map((w, i) => (
        <Word key={i} word={w} progress={progress} start={from + i * step} end={from + (i + 1.6) * step} />
      ))}
    </p>
  );
}

function Word({ word, progress, start, end }: { word: string; progress: MotionValue<number>; start: number; end: number }) {
  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  const blur = useTransform(progress, [start, end], [8, 0]);
  const y = useTransform(progress, [start, end], [10, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  return (
    <motion.span style={{ opacity, filter, y }} className="inline-block mr-[0.25em]">
      {word}
    </motion.span>
  );
}

/** Fades/slides an element in over a progress window. */
export function Reveal({ progress, at, children, className, x = 0, y = 24 }: { progress: MotionValue<number>; at: [number, number]; children: React.ReactNode; className?: string; x?: number; y?: number }) {
  const opacity = useTransform(progress, at, [0, 1]);
  const tx = useTransform(progress, at, [x, 0]);
  const ty = useTransform(progress, at, [y, 0]);
  return (
    <motion.div style={{ opacity, x: tx, y: ty }} className={className}>
      {children}
    </motion.div>
  );
}
