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

import gallery1 from '@/images/gallery-1.jpg';
import gallery2 from '@/images/gallery-2.jpg';
import gallery3 from '@/images/gallery-3.jpg';
import gallery4 from '@/images/gallery-4.jpg';

const GALLERY_IMAGES = [
  { src: gallery1, title: 'Public Rally & Ground Work' },
  { src: gallery2, title: 'Community Outreach' },
  { src: gallery3, title: 'Youth Empowerment' },
  { src: gallery4, title: 'Hapur Development Meeting' },
];

/* ─── Hero Horizontal Image Slider ─── */
function HeroImageSlider({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="w-full max-w-xl sm:max-w-2xl overflow-hidden py-1">
      <motion.div
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
        className="flex items-center gap-3.5 w-max"
      >
        {[...GALLERY_IMAGES, ...GALLERY_IMAGES, ...GALLERY_IMAGES].map((img, idx) => (
          <div
            key={idx}
            className="group relative w-44 sm:w-52 md:w-60 h-28 sm:h-34 md:h-38 rounded-xl overflow-hidden border-2 border-white/25 shadow-xl shrink-0 cursor-pointer"
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
      className="relative w-full overflow-hidden"
      aria-label="Hero section"
    >
      {/* ── Background Image establishing natural section height ── */}
      <div className="relative w-full">
        <picture>
          <source media="(max-width: 768px)" srcSet={heroPhone} />
          <motion.img
            src={heroDesktop}
            alt="ASPK4Hapur Hero Background"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full h-auto min-h-[520px] sm:min-h-[600px] lg:min-h-[700px] object-cover block"
          />
        </picture>

        {/* Dark gradient overlay tuned for right-side text readability */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/65 to-black/20 pointer-events-none" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

        {/* ── Content Overlay (Right-aligned) ── */}
        <div className="absolute inset-0 z-10 container-padded pt-24 sm:pt-36 pb-8 sm:pb-12 flex flex-col justify-center items-end text-right">
          <div className="max-w-2xl flex flex-col items-end text-right ml-auto">

            {/* Single Photo Animation Slider */}
            <div className="mb-4 sm:mb-5 w-full flex justify-end">
              <HeroImageSlider />
            </div>

            {/* Paragraph Text */}
            <p className="text-white/85 text-sm sm:text-lg leading-relaxed mb-5 sm:mb-6 max-w-xl font-medium text-right">
              Building a new era of transparent governance, community service, and true
              representation. Join the movement that listens to every citizen.
            </p>

            {/* CTA Buttons right-aligned */}
            <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4 mb-4">
              <Link
                to="/join"
                className="px-8 py-3.5 sm:px-9 sm:py-4 rounded-none border-2 border-white bg-[#0004A3] text-white font-bold hover:bg-white hover:text-[#0004A3] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 text-sm sm:text-base shadow-md"
              >
                Join
              </Link>
              <Link
                to="/donate"
                className="px-8 py-3.5 sm:px-9 sm:py-4 rounded-none border-2 border-white bg-white text-[#0004A3] font-bold hover:bg-[#0004A3] hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300 text-sm sm:text-base shadow-md"
              >
                Donate
              </Link>
            </div>

          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 1 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20 pointer-events-none"
        >
          <span className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-4 h-4 text-white/50" />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
