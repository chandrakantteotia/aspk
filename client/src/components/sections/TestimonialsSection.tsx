import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Ramesh Chandra Sharma',
    role: 'Farmer',
    location: 'Dhaulana',
    content: 'ASPK4Hapur helped me get my land records corrected after 3 years of struggle. Their complaint system actually works, and the team follows up personally.',
    badge: 'Citizen',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 2,
    name: 'Sunita Devi',
    role: 'SHG Leader',
    location: 'Pilkhuwa',
    content: 'The women empowerment workshops changed our community. We started a tailoring unit, and 12 women now have steady income. This party actually listens to our needs.',
    badge: 'Women Wing',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 3,
    name: 'Aditya Kumar',
    role: 'College Student',
    location: 'Hapur City',
    content: 'As a youth volunteer, I\'ve seen the party work from inside. The transparency is real. Every decision is discussed openly, and volunteers have a real voice.',
    badge: 'Youth Wing',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 4,
    name: 'Kavita Singh',
    role: 'Teacher',
    location: 'Babugarh',
    content: 'The party\'s focus on primary education and infrastructure in rural schools has been remarkable. They don\'t just make promises; they follow up with action.',
    badge: 'Education',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 5,
    name: 'Mohammad Tariq',
    role: 'Local Businessman',
    location: 'Hapur Market',
    content: 'The grievance cell resolved our market waterlogging issue within a week. ASPK4Hapur acts like a true representative of the people, breaking the old political mold.',
    badge: 'Citizen',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 6,
    name: 'Priyanka Sharma',
    role: 'Healthcare Worker',
    location: 'Garhmukteshwar',
    content: 'The recent health camps organized by the party have brought essential medical services to our rural areas. It is refreshing to see leaders who genuinely care about our wellbeing.',
    badge: 'Medical Wing',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  }
];

export default function TestimonialsSection() {
  const [items, setItems] = useState(testimonials);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setItems((prev) => {
        const newArr = [...prev];
        const first = newArr.shift();
        if (first) newArr.push(first);
        return newArr;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [paused]);

  const nextSlide = () => {
    setItems((prev) => {
      const newArr = [...prev];
      const first = newArr.shift();
      if (first) newArr.push(first);
      return newArr;
    });
  };

  const prevSlide = () => {
    setItems((prev) => {
      const newArr = [...prev];
      const last = newArr.pop();
      if (last) newArr.unshift(last);
      return newArr;
    });
  };

  return (
    <section className="py-24 bg-slate-50" aria-labelledby="testimonials-heading">
      <div className="container-padded relative">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="section-label block mb-3 text-primary">Community Voices</span>
            <h2 id="testimonials-heading" className="font-display text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Stories of <span className="font-serif italic text-[var(--color-gold)] font-medium">Impact</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={prevSlide}
              className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div 
          className="w-full relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Slider Container */}
          <div className="overflow-hidden -mx-4 px-4 pb-12 pt-4">
            <motion.div layout className="flex gap-6">
              <AnimatePresence mode="popLayout">
                {items.map((t) => (
                  <motion.div 
                    key={t.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)", transition: { duration: 0.2 } }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] flex-shrink-0"
                  >
                    <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col h-full hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
                      <div className="text-5xl font-serif text-[var(--color-gold)] opacity-40 leading-none mb-2">"</div>
                      
                      <blockquote className="flex-1 text-[13.5px] text-slate-600 leading-relaxed font-medium mb-4 line-clamp-4">
                        {t.content}
                      </blockquote>
                      
                      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100/80">
                        <img
                          src={t.photo}
                          alt={t.name}
                          className="w-10 h-10 rounded-full object-cover shadow-sm"
                        />
                        <div>
                          <div className="font-display font-bold text-slate-900 text-[13px]">{t.name}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <span className="truncate max-w-[100px]">{t.role}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                            <span className="text-[9px] font-bold uppercase tracking-wider text-primary shrink-0">{t.badge}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
