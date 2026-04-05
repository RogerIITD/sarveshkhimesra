"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface SongPlayerProps {
  compact?: boolean;
}

export default function SongPlayer({ compact = false }: SongPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/audio/song.mp3");
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!audioRef.current || !barRef.current || !duration) return;
      const rect = barRef.current.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pct * duration;
    },
    [duration]
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause Maafi" : "Play Maafi"}
          className="w-10 h-10 rounded-full bg-primary text-white text-sm flex items-center justify-center hover:scale-110 transition-transform animate-pulse-glow flex-shrink-0"
        >
          {isPlaying ? "\u23F8" : "\u25B6"}
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-heading text-sm text-secondary truncate">Maafi</p>
          <p className="text-xs text-text/60">Sarvesh Khimesra</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center max-w-[380px] mx-auto">
      <div className="w-[200px] h-[200px] mx-auto mb-6 rounded-xl bg-chai/20 border border-white/10 flex items-center justify-center shadow-xl">
        <span className="text-6xl text-accent">{"\u266A"}</span>
      </div>
      <h3 className="font-heading text-3xl text-white mb-1">Maafi</h3>
      <p className="text-sm text-white/60 mb-6">by Sarvesh Khimesra</p>
      <div className="mb-6">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause Maafi" : "Play Maafi"}
          className="w-16 h-16 rounded-full bg-accent text-secondary text-2xl inline-flex items-center justify-center hover:scale-110 hover:bg-primary transition-all animate-pulse-glow"
        >
          {isPlaying ? "\u23F8" : "\u25B6"}
        </button>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-white/60 tabular-nums min-w-[32px]">
          {formatTime(currentTime)}
        </span>
        <div
          ref={barRef}
          onClick={handleSeek}
          className="flex-1 h-1 bg-white/20 rounded cursor-pointer relative"
        >
          <div
            className="h-full bg-accent rounded transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-white/60 tabular-nums min-w-[32px]">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
