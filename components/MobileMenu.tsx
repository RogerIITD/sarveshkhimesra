"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  pathname: string;
}

export default function MobileMenu({
  open,
  onClose,
  links,
  pathname,
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-50"
            onClick={onClose}
          />

          {/* Slide-in panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-72 bg-bg z-50 shadow-2xl p-8 flex flex-col"
          >
            <button
              onClick={onClose}
              className="self-end text-secondary text-2xl mb-8"
              aria-label="Close menu"
            >
              &times;
            </button>

            <nav className="flex flex-col gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`text-xl font-heading transition-colors ${
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href))
                      ? "text-primary"
                      : "text-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
