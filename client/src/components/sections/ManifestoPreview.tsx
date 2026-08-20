import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Briefcase, Heart, Users, GraduationCap, Building2, ShieldCheck, Sparkles } from 'lucide-react';

const pillars = [
  { icon: GraduationCap, title: 'Education & Schools', highlight: 'Modern infrastructure, smart classrooms & free youth coaching' },
  { icon: Briefcase, title: 'Employment & Youth Jobs', highlight: 'Local industrial parks, skill hubs & startup funding' },
  { icon: Heart, title: 'Healthcare Access', highlight: '24/7 free medical aid, sub-district hospitals & ambulance service' },
  { icon: Users, title: 'Women Empowerment', highlight: 'SHG grants, safety corridors & leadership opportunities' },
  { icon: Building2, title: 'Infrastructure Development', highlight: 'Clean drinking water, modern roads & green urban spaces' },
  { icon: ShieldCheck, title: 'Social Justice & Equity', highlight: 'Transparent governance, citizen grievance resolution & dignity for all' },
];

export default function ManifestoPreview() {
  return (
    <section className="py-20 md:py-28 bg-[var(--color-primary)] relative overflow-hidden text-white" aria-labelledby="manifesto-heading">
      
      {/* Animated Ambient Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[#0006d4] to-[#000266] pointer-events-none" />
      
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-amber-400/15 blur-3xl pointer-events-none"
      />

      {/* Subtle Dot Pattern */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.6) 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />
      
      <div className="container-padded relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading & Call to Action */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15  border border-white/25 text-amber-300 text-xs font-bold uppercase tracking-widest mb-6 shadow-md">
                <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>Manifesto 2026 • जन-संकल्प</span>
              </div>

              <h2
                id="manifesto-heading"
                className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-[1.1] tracking-tight"
              >
                Our Vision for <br />
                <span className="text-amber-300 underline underline-offset-8 decoration-amber-400/60 decoration-4">
                  Hapur
                </span>
              </h2>

              <p className="text-white/85 text-base sm:text-lg lg:text-xl leading-relaxed font-medium mb-8 max-w-xl">
                राष्ट्रीय राजधानी क्षेत्र (मैरिज) के क्षेत्रीय पहलुओं के अंतर्गत सेक्टरों का विस्तार, औद्योगिक विकास और बेहतर नागरिक असोसिएशन पर केंद्रित है।

              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/manifesto"
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-[var(--color-primary)] font-extrabold rounded-lg border-2 border-white hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 text-base shadow-xl tracking-wide"
                  >
                    <span>Read Full Manifesto</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Animated Manifesto Pillars Cards */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative p-6 rounded-xl bg-[var(--color-primary)] border-2 border-white hover:bg-white hover:border-white transition-all duration-300  cursor-pointer shadow-lg hover:shadow-lg overflow-hidden flex flex-col justify-between"
              >
                {/* Glow Accent on Hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-[var(--color-primary)]/10 transition-colors pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/15 group-hover:bg-[var(--color-primary)] text-white group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-md shrink-0">
                      <pillar.icon className="w-6 h-6 group-hover:rotate-6 transition-transform duration-300" />
                    </div>
                    <span className="text-2xl font-extrabold font-display text-white/30 group-hover:text-[var(--color-primary)]/25 transition-colors">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-display text-white group-hover:text-[var(--color-primary)] transition-colors mb-2 leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-white/75 group-hover:text-slate-600 text-xs sm:text-sm leading-relaxed font-medium transition-colors">
                    {pillar.highlight}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 group-hover:border-slate-200 flex items-center justify-between text-xs font-bold text-amber-300 group-hover:text-[var(--color-primary)] transition-colors">
                  <span>Explore Policy</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
