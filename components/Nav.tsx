"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import MobileMenu from "./MobileMenu";

const links = [
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/now", label: "Now" },
];

export default function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-primary/10">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-heading text-xl text-secondary hover:text-primary transition-colors"
        >
          Sarvesh Khimesra
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`relative text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href))
                    ? "text-primary"
                    : "text-secondary"
                }`}
              >
                {link.label}
                {(pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href))) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <span className="block w-6 h-0.5 bg-secondary" />
          <span className="block w-6 h-0.5 bg-secondary" />
          <span className="block w-6 h-0.5 bg-secondary" />
        </button>
      </nav>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={links}
        pathname={pathname}
      />
    </header>
  );
}
