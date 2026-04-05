"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const irelandPhotos = [
  { src: "/images/photos/IMG_8226.jpg", alt: "Irish village vibes" },
  { src: "/images/photos/IMG_8033.jpg", alt: "Sheep, lakes & solitude" },
  { src: "/images/photos/IMG_8254.jpg", alt: "Wild Atlantic coast" },
  { src: "/images/photos/IMG_8218.jpg", alt: "Murphy's Bar" },
  { src: "/images/photos/IMG_8402.jpg", alt: "Old Ireland" },
  { src: "/images/photos/ireland-group.jpg", alt: "Winter squad" },
  { src: "/images/photos/IMG_6775.jpg", alt: "Dublin at blue hour" },
  { src: "/images/photos/IMG_7532.jpg", alt: "Ice skating vibes" },
];

export default function PhotoCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (isPaused) return;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += 1;
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div
      ref={scrollRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      className="h-full overflow-x-auto overflow-y-hidden flex gap-3 p-4 scrollbar-hide"
      style={{ scrollBehavior: "smooth" }}
    >
      {irelandPhotos.map((photo) => (
        <div
          key={photo.src}
          className="flex-shrink-0 h-full aspect-[4/3] rounded-lg overflow-hidden"
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            width={300}
            height={225}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
