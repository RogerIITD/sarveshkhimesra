'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from './GameProvider';

export function AchievementToast() {
  const { lastUnlock } = useGame();
  return (
    <div className="fixed bottom-3 right-3 left-3 sm:left-auto sm:bottom-4 sm:right-4 z-40 pointer-events-none flex justify-end" aria-live="polite">
      <AnimatePresence>
        {lastUnlock && (
          <motion.div
            key={lastUnlock.id}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="border border-prompt/40 bg-bg/95 backdrop-blur px-4 py-3 rounded-md shadow-[0_0_24px_rgba(76,217,100,0.18)] text-sm w-full sm:w-auto sm:max-w-xs"
          >
            <div className="text-prompt font-medium">✓ {lastUnlock.title}</div>
            <div className="text-muted text-xs mt-0.5">{lastUnlock.description}</div>
            <div className="text-ball text-xs mt-1">+{lastUnlock.xp} XP</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
