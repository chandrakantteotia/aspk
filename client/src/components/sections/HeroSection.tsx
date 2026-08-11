import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useInView } from '@/hooks/useScroll';
import { useCountUp } from '@/hooks/useCountUp';

import heroDesktop from '@/images/hero-desktop.jpg';
import heroMobile from '@/images/hero-mobile.jpg';

/* ─── Cycling headline words ─── */
const CYCLING_WORDS = [
  { text: 'People',    color: 'text-white' },
  { text: 'Progress',  color: 'text-yellow-300' },
  { text: 'Change',    color: 'text-orange-300' },
  { text: 'Justice',   color: 'text-purple-300' },
  { text: 'Hapur',     color: 'text-blue-300' },
  { text: 'Community', color: 'text-green-300' },
];

/* ─── Stat card ─── */
function StatCard({ value, label, suffix = '', delay }: {
  value: number; label: string; suffix?: string; delay: number;
}) {
  const { ref, inView } = useInView(0.4);
  const count = useCountUp(value, 2000, 0, inView);
  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="bg-white/15 backdrop-blur-md p-6 rounded-2xl border border-white/25 w-full md:w-auto min-w-[180px]"
    >
      <div className="font-display font-bold text-3xl text-white mb-1">
        {count.toLocaleString('en-IN')}{suffix}
      </div>
      <div className="text-sm text-white/70 font-medium">{label}</div>
    </motion.div>
  );
}

/* ─── Main hero ─── */
export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY       = useTransform(scrollYProgress, [0, 0.8], [0, 80]);

  const [wordIdx, setWordIdx] = useState(0);

  /* Auto-cycle words (slightly offset from bg) */
  useEffect(() => {
    const id = setInterval(() => setWordIdx(i => (i + 1) % CYCLING_WORDS.length), 2600);
    return () => clearInterval(id);
  }, []);

  const cw = CYCLING_WORDS[wordIdx];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* ── Responsive Background Image ── */}
      <div className="absolute inset-0">
        <picture>
          <source media="(max-width: 768px)" srcSet={heroMobile} />
          <motion.img
            src={heroDesktop}
            alt="ASPK4Hapur Hero Background"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </picture>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* ── Content ── */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative z-10 container-padded pt-32 pb-24 flex-1 flex flex-col justify-center"
      >
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">

          {/* Left content */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--color-gold)] mb-5 inline-block">
                Official Platform 2026
              </span>
            </motion.div>

            {/* Animated headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-white mb-6"
            >
              {/* Cycling word line */}
              <span className="flex flex-wrap items-baseline gap-x-3 overflow-hidden">
                <span className="relative inline-block overflow-hidden font-bold" style={{ minWidth: '2ch' }}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={wordIdx}
                      initial={{ y: '110%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      exit={{ y: '-110%', opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={`block ${cw.color}`}
                    >
                      {cw.text}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="text-white font-bold">First.</span>
              </span>

              {/* Static second line with Serif touch */}
              <span className="block mt-1 sm:mt-2">
                <span className="font-serif italic text-[var(--color-gold-light)] font-normal">Hapur</span>
                <span className="font-bold text-white"> First.</span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 3.0, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-white/70 text-lg leading-relaxed mb-10 max-w-lg font-medium"
            >
              Building a new era of transparent governance, community service, and true
              representation. Join the movement that listens to every citizen.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 3.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                to="/join"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[var(--color-gold)] to-yellow-600 text-[#0F172A] font-bold hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 transition-all"
              >
                Join the Movement
              </Link>
              <Link
                to="/manifesto"
                className="px-8 py-4 rounded-full bg-white/5 text-white font-semibold border border-white/20 hover:bg-white/10 hover:-translate-y-0.5 backdrop-blur-md transition-all"
              >
                Our Manifesto
              </Link>
            </motion.div>
          </div>

          {/* Right: Stat cards */}
          <div className="relative h-auto md:h-[380px] lg:h-[460px] mt-12 md:mt-0 flex items-center justify-center lg:justify-end">
            <div className="w-full flex flex-col md:block relative max-w-sm gap-4">
              <div className="md:absolute top-0 right-0 lg:right-6 z-30">
                <StatCard value={14250} label="Active Members"      suffix="+" delay={3.4} />
              </div>
              <div className="md:absolute top-[38%] left-0 z-20">
                <StatCard value={8900}  label="Grievances Resolved" suffix="+" delay={3.6} />
              </div>
              <div className="md:absolute bottom-0 right-6 lg:right-14 z-10">
                <StatCard value={28}    label="Districts Covered"   suffix="+" delay={3.8} />
              </div>
            </div>
          </div>

        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
