"use client";

import { motion } from "framer-motion";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

export default function BentoCard({
  children,
  className = "",
  index = 0,
}: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.1,
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 12px 40px rgba(26, 39, 68, 0.15)",
      }}
      className={`bg-card rounded-2xl shadow-md overflow-hidden transition-shadow ${className}`}
    >
      {children}
    </motion.div>
  );
}
