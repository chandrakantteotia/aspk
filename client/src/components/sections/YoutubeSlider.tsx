import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

const VIDEOS = [
  { id: '2yk_3AVmc8I', title: 'Official Address' },
  { id: 'FrQiiT6rOKk', title: 'Community Rally' },
  { id: 'Tn4dvxMoFfs', title: 'Manifesto Launch' },
  { id: 'EonfRHprZrw', title: 'Grievance Drive' },
  { id: 'SeGEhCGsBhw', title: 'Youth Campaign' },
];

const SLIDE_INTERVAL = 6000;

function thumb(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export default function YoutubeSlider() {
  return (
    <section className="relative z-10 py-6 bg-transparent overflow-hidden">
      <div className="w-full overflow-hidden">
        <motion.div
          animate={{ x: ['-50%', '0%'] }}
          transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
          className="flex items-center gap-4 w-max pointer-events-none"
        >
          {[...VIDEOS, ...VIDEOS, ...VIDEOS].map((v, i) => (
            <a
              key={`${v.id}-${i}`}
              href={`https://www.youtube.com/watch?v=${v.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-64 sm:w-72 md:w-80 rounded-xl overflow-hidden cursor-pointer group shadow-lg shrink-0 border border-slate-200/80 bg-slate-900 block pointer-events-auto"
              style={{ aspectRatio: '16/9' }}
            >
              <img
                src={thumb(v.id)}
                alt={v.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 text-[#0004A3] fill-[#0004A3] ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 px-3 py-2 bg-gradient-to-t from-black/85 via-black/50 to-transparent">
                <p className="text-white text-xs font-semibold leading-tight line-clamp-1">{v.title}</p>
              </div>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
