'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export default function SongPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/audio/song.mp3');
    audioRef.current = audio;
    const onMeta = () => setDuration(audio.duration);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnd = () => { setIsPlaying(false); setCurrentTime(0); };
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnd);
      audio.src = '';
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { void audioRef.current.play(); setIsPlaying(true); }
  }, [isPlaying]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !barRef.current || !duration) return;
    const rect = barRef.current.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * duration;
  }, [duration]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="border border-chrome rounded p-4 max-w-md" data-target="song-player">
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause Maafi' : 'Play Maafi'}
          className="w-10 h-10 rounded-full border border-prompt text-prompt hover:bg-prompt/10 flex items-center justify-center shrink-0"
        >
          {isPlaying ? '◼' : '▶'}
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-fg text-sm">maafi</div>
          <div className="text-muted text-xs">by sarvesh khimesra</div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 text-xs text-muted">
        <span className="tabular-nums min-w-[32px]">{fmt(currentTime)}</span>
        <div ref={barRef} onClick={handleSeek} className="flex-1 h-1 bg-chrome rounded cursor-pointer relative">
          <div className="h-full bg-ball rounded" style={{ width: `${progress}%` }} />
        </div>
        <span className="tabular-nums min-w-[32px]">{fmt(duration)}</span>
      </div>
    </div>
  );
}
