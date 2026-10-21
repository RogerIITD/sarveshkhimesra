'use client';

import { motion, useDragControls, useMotionValue, useReducedMotion, type Variants } from 'framer-motion';
import type { RefObject } from 'react';
import type { AppMeta } from '@/content/os';

type Props = {
  app: AppMeta;
  x: number;
  y: number;
  z: number;
  /** centre of the icon the window grows out of, in desktop-area coordinates */
  origin: { x: number; y: number };
  focused: boolean;
  maximized: boolean;
  bounds: RefObject<HTMLElement>;
  onFocus: () => void;
  onClose: () => void;
  onToggleMax: () => void;
  onMove: (dx: number, dy: number) => void;
  children: React.ReactNode;
};

const EASE = [0.22, 1, 0.36, 1] as const;

// Outer layer: position + drag. Inner layer: the icon → window morph
// (translate from the icon, scale up, pill-shaped clip opening to a rectangle).
const morph: Variants = {
  closed: (o: { dx: number; dy: number }) => ({
    x: o.dx,
    y: o.dy,
    scale: 0.12,
    opacity: 0,
    clipPath: 'inset(35% 20% 35% 20% round 999px)',
    transition: { duration: 0.32, ease: [0.55, 0, 0.75, 0.2] },
  }),
  open: {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    clipPath: 'inset(0% 0% 0% 0% round 12px)',
    transition: { duration: 0.5, ease: EASE },
  },
};

export function Window(props: Props) {
  const { app, x, y, z, origin, focused, maximized, bounds, onFocus, onClose, onToggleMax, onMove, children } = props;
  const controls = useDragControls();
  const reduce = useReducedMotion();
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const area = bounds.current?.getBoundingClientRect();
  const frame = maximized
    ? { left: 8, top: 8, width: (area?.width ?? 1200) - 16, height: (area?.height ?? 800) - 16 }
    : { left: x, top: y, width: app.size.w, height: app.size.h };
  const custom = { dx: origin.x - (frame.left + frame.width / 2), dy: origin.y - (frame.top + frame.height / 2) };

  return (
    <motion.section
      role="dialog"
      aria-label={app.title}
      data-target={`window-${app.id}`}
      drag={!maximized}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragConstraints={bounds}
      dragElastic={0}
      onDragEnd={() => {
        onMove(dragX.get(), dragY.get());
        dragX.set(0);
        dragY.set(0);
      }}
      onPointerDown={onFocus}
      initial={reduce ? false : 'closed'}
      animate="open"
      exit={reduce ? undefined : 'closed'}
      custom={custom}
      variants={{ closed: {}, open: {} }}
      style={{ ...frame, x: dragX, y: dragY, zIndex: z, position: 'absolute', maxWidth: 'calc(100% - 16px)', maxHeight: 'calc(100% - 16px)' }}
    >
      <motion.div
        variants={morph}
        custom={custom}
        className={`h-full flex flex-col rounded-xl overflow-hidden border bg-panel/95 backdrop-blur-xl shadow-2xl transition-[border-color,box-shadow] ${
          focused ? 'border-line-strong shadow-black/60 ring-1 ring-accent/20' : 'border-line shadow-black/40'
        }`}
      >
        <header
          onPointerDown={(e) => controls.start(e)}
          onDoubleClick={onToggleMax}
          className={`flex items-center gap-3 px-3 h-9 shrink-0 border-b border-line select-none ${
            maximized ? '' : 'cursor-grab active:cursor-grabbing'
          } ${focused ? 'bg-panel-hi' : 'bg-panel'}`}
        >
          <div className="flex gap-1.5">
            <button aria-label={`Close ${app.label}`} onClick={onClose} onPointerDown={(e) => e.stopPropagation()} className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110" />
            <button aria-label="Maximize" onClick={onToggleMax} onPointerDown={(e) => e.stopPropagation()} className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-110" />
          </div>
          <span className="font-mono text-xs text-dim truncate">{app.title}</span>
          {focused && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--accent))]" />}
        </header>
        <div className="flex-1 min-h-0 overflow-auto">{children}</div>
      </motion.div>
    </motion.section>
  );
}
