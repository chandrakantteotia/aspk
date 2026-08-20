import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useInView } from '@/hooks/useScroll';
import { useCountUp } from '@/hooks/useCountUp';

import heroDesktop from '@/images/herodesktop.png';
import heroPhone from '@/images/herophone.png';
import heroJoin from '@/images/herojoin.png';

/* ─── Cycling headline words ─── */
const CYCLING_WORDS = [
  { text: 'People', color: 'text-white' },
  { text: 'Progress', color: 'text-yellow-300' },
  { text: 'Change', color: 'text-orange-300' },
  { text: 'Justice', color: 'text-purple-300' },
  { text: 'Hapur', color: 'text-blue-300' },
  { text: 'Community', color: 'text-green-300' },
];

import gallery1 from '@/images/gallery-1.jpeg';
import gallery2 from '@/images/gallery-2.jpeg';
import gallery3 from '@/images/gallery-3.jpeg';
import gallery4 from '@/images/gallery-4.jpeg';

const GALLERY_IMAGES = [
  { src: gallery1, title: 'Public Rally & Ground Work' },
  { src: gallery2, title: 'Community Outreach' },
  { src: gallery3, title: 'Youth Empowerment' },
  { src: gallery4, title: 'Hapur Development Meeting' },
];

/* ─── Hero Horizontal Image Slider ─── */
function HeroImageSlider({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="w-full max-w-lg sm:max-w-xl overflow-hidden py-1">
      <motion.div
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
        className="flex items-center gap-3 w-max"
      >
        {[...GALLERY_IMAGES, ...GALLERY_IMAGES, ...GALLERY_IMAGES].map((img, idx) => (
          <div
            key={idx}
            className="group relative w-36 sm:w-44 md:w-52 h-24 sm:h-28 md:h-32 rounded-xl overflow-hidden border-2 border-white/25 shadow-xl shrink-0 cursor-pointer"
          >
            <img
              src={img.src}
              alt={img.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5">
              <span className="text-xs font-semibold text-white line-clamp-1">{img.title}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Main hero ─── */
export default function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden min-h-[100dvh] min-h-[760px] sm:min-h-[600px] lg:min-h-[700px]"
      aria-label="Hero section"
    >
      {/* ── Background Image establishing natural section height ── */}
      <div className="relative w-full min-h-[100dvh] min-h-[760px] sm:min-h-[600px] lg:min-h-[700px]">
        <picture>
          <source media="(max-width: 768px)" srcSet={heroPhone} />
          <motion.img
            src={heroDesktop}
            alt="ASPK4Hapur Hero Background"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full h-full min-h-[100dvh] min-h-[760px] sm:min-h-[600px] lg:min-h-[700px] object-cover block"
          />
        </picture>

        {/* Dark gradient overlay tuned for left-side text readability on desktop & top gradient on mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black/20 sm:bg-gradient-to-r sm:from-black/90 sm:via-black/65 sm:to-black/20 pointer-events-none" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

        {/* ── Content Overlay (Top on mobile, left-aligned on desktop) ── */}
        <div className="absolute inset-0 z-10 container-padded pt-28 sm:pt-36 pb-14 sm:pb-12 flex flex-col justify-start sm:justify-center items-center sm:items-start text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl flex flex-col items-center sm:items-start text-center sm:text-left mx-auto sm:ml-0 sm:mr-auto w-full h-full sm:h-auto"
          >

            {/* Single Photo Animation Slider */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mb-3 sm:mb-5 w-full flex justify-center sm:justify-start"
            >
              <HeroImageSlider />
            </motion.div>

            {/* Paragraph Text */}
            <motion.p
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="text-white/90 text-base sm:text-xl leading-relaxed mb-6 sm:mb-8 max-w-xl font-medium text-center sm:text-left px-4 sm:px-0"
            >
              सशक्तिकरण महाअभियान के अंतर्गत युवाओं को सामाजिक, आर्थिक, राजनीतिक, शैक्षणिक, सांस्कृतिक रूप से सशक्त कर आत्मविश्वासी बनाकर उनको उज्जवल भविष्य की ओर अग्रसर करना है|
            </motion.p>

            {/* CTA Buttons - Center aligned horizontally on all screens */}
            <motion.div
              initial={{ opacity: 0, y: -35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-auto sm:mt-0 flex flex-row items-center justify-center sm:justify-start gap-2 sm:gap-4 mb-16 sm:mb-3 w-full sm:w-auto px-4 sm:px-0"
            >
              <Link
                to="/join"
                className="w-full flex-1 sm:flex-initial text-center px-2 sm:px-8 py-3 sm:py-3.5 rounded-lg border border-transparent bg-primary text-white font-semibold hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-button transition-all duration-300 text-[13px] sm:text-base shadow-sm cursor-pointer whitespace-nowrap"
              >
                Join the Party
              </Link>
              <Link
                to="/donate"
                className="w-full flex-1 sm:flex-initial text-center px-2 sm:px-8 py-3 sm:py-3.5 rounded-lg border border-white/20 bg-white/10 text-white font-semibold hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300 text-[13px] sm:text-base cursor-pointer whitespace-nowrap"
              >
                Support Us
              </Link>
            </motion.div>

          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20 pointer-events-none"
        >
          <span className="text-[10px] text-white/60 font-bold uppercase tracking-[0.2em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-4 h-4 text-white/60" />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
