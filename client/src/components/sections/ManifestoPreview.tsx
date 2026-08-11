import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Briefcase, Heart, Star, Leaf, Cpu, Users, GraduationCap, Tractor, Scale, Building2 } from 'lucide-react';

const pillars = [
  { icon: GraduationCap, title: 'Education', highlight: 'Future-ready learning' },
  { icon: Briefcase, title: 'Employment', highlight: 'Jobs with dignity' },
  { icon: Heart, title: 'Healthcare', highlight: 'Healthy communities' },
  { icon: Users, title: 'Women Empowerment', highlight: 'Leadership at every level' },
];

export default function ManifestoPreview() {
  return (
    <section className="py-24 bg-[#0F172A] relative overflow-hidden" aria-labelledby="manifesto-heading">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <div className="container-padded relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2
                id="manifesto-heading"
                className="font-display font-bold text-5xl md:text-6xl text-white mb-6 leading-tight"
              >
                Our Vision for <br />
                <span className="text-warning">Hapur</span>
              </h2>
              <div className="w-20 h-1 bg-warning mb-8" />
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-lg mb-10">
                Every promise is a commitment. Every pillar is a plan. Our manifesto is built on actionable policies that put people at the center of development and progress.
              </p>
              
              <Link
                to="/manifesto"
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all hover:gap-4 hover:shadow-lg"
              >
                Read Full Manifesto
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-warning/50 transition-all duration-300 backdrop-blur-sm cursor-pointer"
              >
                <div className="text-4xl font-black font-display text-warning/20 group-hover:text-warning transition-colors w-12 text-center">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold font-display text-white mb-1 group-hover:text-warning transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {pillar.highlight}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-warning group-hover:text-dark text-white transition-all">
                  <pillar.icon className="w-5 h-5" />
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
