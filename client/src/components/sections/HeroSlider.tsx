import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import img1 from '@/images/gallery-1.jpeg';
import img2 from '@/images/gallery-2.jpeg';
import img3 from '@/images/gallery-3.jpeg';
import img4 from '@/images/gallery-4.jpeg';

const SLIDES = [
  { src: img1, alt: 'ASPK4Hapur Rally' },
  { src: img2, alt: 'Community Service' },
  { src: img3, alt: 'Party Meeting' },
  { src: img4, alt: 'Public Event' },
];

const DURATION = 3800; // ms per slide

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused]   = useState(false);

  const next = useCallback(() => {
    setCurrent(i => (i + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, DURATION);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <div
      className="relative w-full h-[380px] md:h-[500px] overflow-hidden -mt-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Slides ── */}
      <AnimatePresence mode="sync">
        <motion.img
          key={current}
          src={SLIDES[current].src}
          alt={SLIDES[current].alt}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Top gradient — seamlessly blends into the hero above */}
      <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-white via-white/60 to-transparent z-10 pointer-events-none" />

      {/* Bottom gradient — blends into next section */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

      {/* Left/right vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(255,255,255,0.4)_100%)] z-10 pointer-events-none" />

      {/* Controls overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-7 gap-3">

        {/* Slide label */}
        <AnimatePresence mode="wait">
          <motion.span
            key={`lbl-${current}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35 }}
            className="text-white text-sm font-semibold tracking-wide px-3 py-1 rounded-lg bg-black/20 "
          >
            {SLIDES[current].alt}
          </motion.span>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="relative rounded-lg overflow-hidden focus:outline-none transition-all duration-300"
              style={{ width: i === current ? 32 : 18, height: 4 }}
            >
              {/* Track */}
              <span className="absolute inset-0 rounded-lg bg-white/40" />
              {/* Fill */}
              {i === current && (
                <motion.span
                  className="absolute inset-y-0 left-0 rounded-lg bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: DURATION / 1000, ease: 'linear' }}
                />
              )}
              {/* Inactive fill */}
              {i !== current && i < current && (
                <span className="absolute inset-0 rounded-lg bg-white/70" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={() => setCurrent(i => (i - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-lg bg-white/80  shadow flex items-center justify-center text-slate-700 hover:bg-white transition-colors"
        aria-label="Previous slide"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-lg bg-white/80  shadow flex items-center justify-center text-slate-700 hover:bg-white transition-colors"
        aria-label="Next slide"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
