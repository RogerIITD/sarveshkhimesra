"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function HeroCard() {
  const fullText = "Hey, I'm Sarvesh";
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (charIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(fullText.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 80);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, fullText]);

  return (
    <div className="h-full bg-gradient-to-br from-secondary to-[#0f4c3a] text-bg p-8 flex flex-col justify-center relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 22px)",
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6">
        <div className="flex-1">
          <h1 className="font-heading text-3xl lg:text-4xl mb-3">
            {displayText}
            <span className="inline-block w-0.5 h-8 bg-accent ml-1 animate-pulse" />
          </h1>
          <p className="text-bg/85 text-base lg:text-lg leading-relaxed">
            A generalist who loves strategy, tech, and way too many interests.
          </p>
        </div>
        <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-2 border-bg/30 flex-shrink-0">
          <Image
            src="/images/photos/IMG_8028.jpg"
            alt="Sarvesh Khimesra"
            width={128}
            height={128}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
