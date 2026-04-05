"use client";

import Image from "next/image";

const socials = [
  {
    href: "https://www.linkedin.com/in/sarvesh-khimesra/",
    icon: "/icons/linkedin.svg",
    label: "LinkedIn",
  },
  {
    href: "https://www.instagram.com/sarveshrf/",
    icon: "/icons/instagram.svg",
    label: "Instagram",
  },
  {
    href: "https://x.com/SKhimesra",
    icon: "/icons/twitter.svg",
    label: "Twitter",
  },
];

export default function SocialDock() {
  return (
    <nav
      aria-label="Social links"
      className="
        fixed left-6 top-1/2 -translate-y-1/2 z-40
        flex flex-col gap-5
        max-md:left-auto max-md:right-3 max-md:top-auto max-md:bottom-4
        max-md:translate-y-0 max-md:flex-row max-md:gap-3
        max-md:bg-bg/95 max-md:px-3 max-md:py-2 max-md:rounded-3xl
        max-md:shadow-md
      "
    >
      {socials.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className="
            flex items-center justify-center w-10 h-10 rounded-full
            bg-secondary/[0.08] opacity-50
            hover:opacity-100 hover:bg-primary/15 hover:scale-110
            transition-all duration-300
            max-md:opacity-80 max-md:w-9 max-md:h-9
          "
        >
          <Image
            src={social.icon}
            alt={social.label}
            width={20}
            height={20}
          />
        </a>
      ))}
    </nav>
  );
}
