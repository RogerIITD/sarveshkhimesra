'use client';

import 'lenis/dist/lenis.css';
import Lenis from 'lenis';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SarveshOS } from '@/components/os/SarveshOS';
import { SocialLinks } from '@/components/SocialLinks';
import { NowPlaying } from '@/components/NowPlaying';
import { CHAPTERS, Story } from '@/components/story/Story';
import type { AppId } from '@/content/os';
import { track } from '@/lib/track';
import { useBackLayer } from '@/lib/useBackLayer';

type Mode = 'story' | 'os';

// Landing = scroll story (five chapters). The last chapter boots into sarvesh-os.
export function Experience() {
  const [mode, setMode] = useState<Mode>('story');
  const [active, setActive] = useState<string>('hello');
  const { scrollYProgress } = useScroll();
  const lenis = useRef<Lenis | null>(null);

  // Deep links (/?open=maafi) skip the story.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('open')) setMode('os');
  }, []);

  // Smooth scrolling while in the story; the OS owns the screen otherwise.
  useEffect(() => {
    document.documentElement.classList.toggle('os-mode', mode === 'os');
    if (mode !== 'story' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const l = new Lenis({ autoRaf: true, lerp: 0.09 });
    lenis.current = l;
    return () => {
      l.destroy();
      lenis.current = null;
    };
  }, [mode]);

  const enterOS = useCallback((via: 'scroll' | 'skip' | 'button') => {
    track({ name: 'enter_os', via });
    setMode('os');
  }, []);

  // A chapter's section starts where its wipe begins; land one screen later, once it fully covers the screen.
  const goToChapter = (id: string) => {
    const el = document.getElementById(`chapter-${id}`);
    if (!el) return;
    const top = id === 'hello' ? 0 : el.offsetTop + window.innerHeight;
    if (lenis.current) lenis.current.scrollTo(top, { duration: 1.4 });
    else window.scrollTo({ top, behavior: 'smooth' });
  };

  // a button in the story can boot straight into one app (e.g. "more shayaris" → shayari.app)
  const [launch, setLaunch] = useState<AppId | null>(null);
  const openFromStory = useCallback(
    (id: AppId) => {
      setLaunch(id);
      enterOS('button');
    },
    [enterOS],
  );

  const backToStory = useCallback(() => {
    setMode('story');
    setLaunch(null);
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, []);
  // back button on the desktop returns to the story (not for deep links, which start on the desktop)
  const [fromStory, setFromStory] = useState(false);
  useEffect(() => {
    if (mode === 'os' && !new URLSearchParams(window.location.search).get('open')) setFromStory(true);
    if (mode === 'story') setFromStory(false);
  }, [mode]);
  useBackLayer(mode === 'os' && fromStory, backToStory);

  return (
    <>
      {mode === 'story' && (
        <>
          <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between gap-4 px-4 md:px-8 h-14 font-mono text-xs text-white [text-shadow:0_1px_8px_rgb(0_0_0/0.8)]">
            <span className="font-semibold">◆ sarvesh</span>
            <span className="hidden md:inline lg:hidden opacity-90">{CHAPTERS.find((c) => c.id === active)?.label}</span>
            <nav aria-label="Chapters" className="hidden lg:flex gap-5">
              {CHAPTERS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => goToChapter(c.id)}
                  className={`transition-opacity ${active === c.id ? 'opacity-100' : 'opacity-40 hover:opacity-80'}`}
                >
                  {c.label}
                </button>
              ))}
            </nav>
            <button onClick={() => enterOS('skip')} className="px-3 py-1.5 rounded-full border border-white/50 bg-black/30 backdrop-blur hover:bg-white hover:text-black transition-colors" data-target="skip-to-desktop">
              skip to desktop ⌘ →
            </button>
          </header>
          <motion.div className="fixed top-0 left-0 right-0 h-px z-50 bg-white/70 origin-left" style={{ scaleX: scrollYProgress }} />
          {/* socials stay on screen through every chapter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="fixed z-50 left-6 bottom-0 hidden md:flex flex-col items-center gap-5 text-white/70"
          >
            <SocialLinks where="story" size={18} className="flex flex-col gap-5" linkClassName="hover:text-white [filter:drop-shadow(0_1px_4px_rgb(0_0_0/0.8))]" />
            <span className="w-px h-20 bg-white/30" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="fixed z-50 right-4 bottom-4 md:hidden rounded-full border border-white/20 bg-black/50 backdrop-blur px-3.5 py-2.5 text-white/85"
          >
            <SocialLinks where="story" size={17} className="flex gap-4" />
          </motion.div>
          <Story onActive={setActive} onEnterOS={() => enterOS('scroll')} onOpenApp={openFromStory} />
        </>
      )}

      <AnimatePresence>
        {mode === 'os' && (
          <motion.div
            key="os"
            className="fixed inset-0 z-[60]"
            initial={{ clipPath: 'inset(100% 18% 0% 18% round 480px 480px 0px 0px)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)' }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            <SarveshOS onStory={backToStory} launch={launch} />
          </motion.div>
        )}
      </AnimatePresence>
      <NowPlaying mode={mode} />
    </>
  );
}
