import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';

// Auto-import all inspiration images (image.png, image1.png, ..., image40.png) from src/images
const inspirationModules = import.meta.glob<{ default: string }>('@/images/image*.png', { eager: true });
const INSPIRATION_IMAGES: string[] = Object.values(inspirationModules).map(mod => mod.default);

export default function InspirationSection() {
  return (
    <section className="py-14 md:py-20 bg-slate-50/70 border-y border-slate-200/60 relative overflow-hidden">
      <div className="w-full overflow-hidden">
        
        {/* Section Header */}
        <div className="container-padded mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0004A3]/10 text-[#0004A3] text-xs font-bold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-[#0004A3]" />
            <span>Guiding Principles</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Our Inspiration
          </h2>
        </div>

        {/* 204px x 273px Cards Infinite Auto-Scrolling Slider */}
        <div className="w-full overflow-hidden py-2">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 45, ease: 'linear' }}
            className="flex items-center gap-5 w-max px-4 pointer-events-none"
          >
            {[...INSPIRATION_IMAGES, ...INSPIRATION_IMAGES].map((imgSrc, idx) => (
              <div
                key={idx}
                className="shrink-0 rounded-2xl overflow-hidden bg-white border-2 border-white shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer pointer-events-auto"
                style={{ width: '204px', height: '273px' }}
              >
                <img
                  src={imgSrc}
                  alt={`Inspiration ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
