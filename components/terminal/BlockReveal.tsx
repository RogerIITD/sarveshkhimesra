'use client';

import { motion, useReducedMotion } from 'framer-motion';

type Props = {
  children: React.ReactNode;
  delay?: number;
};

export function BlockReveal({ children, delay = 0 }: Props) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay }}
    >
      {children}
    </motion.div>
  );
}
