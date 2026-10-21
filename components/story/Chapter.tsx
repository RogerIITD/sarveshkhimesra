'use client';

import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';

export type Enter = 'none' | 'pill' | 'circle';

type Props = {
  id: string;
  /** scroll length in screens while pinned (≥ 2; the first one is the entry wipe) */
  screens: number;
  enter: Enter;
  background: string;
  accent: string; // "r g b"
  z: number;
  /** the final chapter isn't covered by a following wipe, so its content runs to the end */
  last?: boolean;
  /** extra classes on the pinned screen (e.g. a themed cursor) */
  className?: string;
  onProgress?: (id: string, entered: boolean, done: boolean) => void;
  children: (content: MotionValue<number>) => React.ReactNode;
};

// A full-screen chapter that stays pinned while you scroll. It overlaps the
// previous chapter's last two screens, so it can clip in on top of it while
// that one is still pinned (pill rising from the bottom, or a growing circle).
export function Chapter({ id, screens, enter, background, accent, z, last = false, className = '', onProgress, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const entryEnd = enter === 'none' ? 0 : 1 / screens;
  const entry = useTransform(scrollYProgress, [0, entryEnd || 0.0001], [enter === 'none' ? 1 : 0, 1]);
  // Content finishes as the next chapter's wipe begins (it covers our last screen).
  const contentEnd = last ? 1 : (screens - 1) / screens;
  const content = useTransform(scrollYProgress, [entryEnd, contentEnd], [0, 1]);

  const clipPath = useTransform(entry, (e) => {
    const r = 1 - e;
    if (enter === 'circle') return `circle(${e * 80}% at 50% 55%)`;
    if (enter === 'pill') return `inset(${r * 100}% ${r * 22}% 0% ${r * 22}% round ${r * 480}px ${r * 480}px 0px 0px)`;
    return 'none';
  });

  // While waiting to wipe in, this chapter overlaps the previous one: let clicks through until it's on screen.
  const pointerEvents = useTransform(entry, (e) => (e > 0.98 ? 'auto' : 'none'));

  useMotionValueEvent(scrollYProgress, 'change', (p) => onProgress?.(id, p >= entryEnd / 2, p >= 0.999));

  return (
    <section
      ref={ref}
      id={`chapter-${id}`}
      className="relative pointer-events-none"
      style={{ height: `${(screens + 1) * 100}svh`, marginTop: enter === 'none' ? 0 : '-200svh', zIndex: z }}
    >
      <motion.div
        className={`sticky top-0 h-[100svh] overflow-hidden ${className}`}
        style={{ clipPath, background, pointerEvents, ['--accent' as string]: accent }}
      >
        {children(content)}
      </motion.div>
    </section>
  );
}
