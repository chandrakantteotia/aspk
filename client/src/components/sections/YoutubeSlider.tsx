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
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [paused,  setPaused]  = useState(false);

  const next = useCallback(() => { setPlaying(false); setCurrent(i => (i + 1) % VIDEOS.length); }, []);
  const prev = useCallback(() => { setPlaying(false); setCurrent(i => (i - 1 + VIDEOS.length) % VIDEOS.length); }, []);

  useEffect(() => {
    if (playing || paused) return;
    const id = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [playing, paused, next]);

  return (
    <section className="relative z-10 py-10 bg-transparent">
      <div className="container-padded">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-1">Watch & Listen</p>
            <h2 className="font-display font-bold text-2xl text-slate-900">Latest Videos</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prev} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-400 transition-colors" aria-label="Previous">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={next} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-400 transition-colors" aria-label="Next">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video row — all in same direction */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {VIDEOS.map((v, i) => {
            const isActive = i === current;
            return (
              <motion.div
                key={v.id}
                onClick={() => { setCurrent(i); setPlaying(false); }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                animate={{ scale: isActive ? 1 : 0.97, opacity: isActive ? 1 : 0.55 }}
                transition={{ duration: 0.3 }}
                className={`relative rounded-xl overflow-hidden cursor-pointer group transition-shadow ${isActive ? 'ring-2 ring-primary shadow-[0_0_24px_rgba(0,87,255,0.4)]' : 'hover:opacity-80'}`}
                style={{ aspectRatio: '16/9' }}
              >
                {/* Thumbnail or iframe */}
                {isActive && playing ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                ) : (
                  <>
                    <img
                      src={thumb(v.id)}
                      alt={v.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Dark overlay */}
                    <div className={`absolute inset-0 transition-colors ${isActive ? 'bg-black/20' : 'bg-black/50'}`} />

                    {/* Play button */}
                    {isActive && (
                      <button
                        onClick={e => { e.stopPropagation(); setPlaying(true); }}
                        className="absolute inset-0 flex items-center justify-center"
                        aria-label="Play"
                      >
                        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 text-primary fill-primary ml-0.5" />
                        </div>
                      </button>
                    )}

                    {/* Title */}
                    <div className="absolute bottom-0 inset-x-0 px-2.5 py-2 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white text-[11px] font-semibold leading-tight line-clamp-1">{v.title}</p>
                    </div>

                    {/* Active indicator dot */}
                    {isActive && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />}
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {VIDEOS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setPlaying(false); }}
              className="rounded-full overflow-hidden transition-all duration-300 focus:outline-none"
              style={{ width: i === current ? 20 : 6, height: 3 }}
              aria-label={`Video ${i + 1}`}
            >
              <span className={`block w-full h-full rounded-full ${i === current ? 'bg-primary' : 'bg-slate-300'}`} />
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
