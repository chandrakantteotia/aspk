import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Eye, Shield, Users, Lightbulb, Heart, CheckCircle2 } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';

gsap.registerPlugin(ScrollTrigger);

const values = [
  { icon: Shield, title: 'Transparency', desc: 'Open governance and clear communication.' },
  { icon: CheckCircle2, title: 'Accountability', desc: 'Taking responsibility for every action.' },
  { icon: Users, title: 'Community', desc: 'Building stronger bonds among citizens.' },
  { icon: Lightbulb, title: 'Innovation', desc: 'Modern solutions for classic problems.' },
  { icon: Target, title: 'Integrity', desc: 'Unwavering moral principles.' },
  { icon: Heart, title: 'Inclusivity', desc: 'A place for everyone in our progress.' },
];

const milestones = [
  { year: '2018', title: 'Foundation', desc: 'ASPK4Hapur was established with a vision for change.' },
  { year: '2021', title: 'District Growth', desc: 'Expanded our operations to cover 10+ districts.' },
  { year: '2024', title: 'Digital Transformation', desc: 'Launched comprehensive digital governance tools.' },
  { year: '2026', title: 'Enterprise Platform', desc: 'Rolling out the ultimate citizen platform.' },
];

const AboutPage: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const volunteerCount = useCountUp(14250, 2000);
  const grievanceCount = useCountUp(8900, 2000);
  const eventCount = useCountUp(1260, 2000);

  useEffect(() => {
    if (!timelineRef.current) return;
    const items = timelineRef.current.querySelectorAll('.timeline-item');
    
    items.forEach((item, i) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          },
        }
      );
    });
  }, []);

  return (
    <main className="w-full bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-white overflow-hidden flex items-center justify-center border-b border-slate-100">
        <div className="container-padded relative z-10 text-center space-y-6 max-w-4xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-warning font-semibold tracking-wider uppercase text-sm mb-4 block"
          >
            The Movement
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold text-dark tracking-tight leading-tight"
          >
            About ASPK4Hapur
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mt-6"
          >
            Dedicated to transforming Hapur through transparent governance and community-driven initiatives.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container-padded py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative"
          >
            <span className="text-8xl font-display font-bold text-slate-100 absolute -top-8 -left-6 z-0 group-hover:text-primary/5 transition-colors duration-500">01</span>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-dark flex items-center gap-4">
                Our Mission
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                To empower the citizens of Hapur by ensuring their voices are heard and providing actionable, transparent governance. We strive to solve everyday problems with innovative solutions and relentless dedication.
              </p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative"
          >
            <span className="text-8xl font-display font-bold text-slate-100 absolute -top-8 -left-6 z-0 group-hover:text-primary/5 transition-colors duration-500">02</span>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-dark flex items-center gap-4">
                Our Vision
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                A thriving, modern Hapur where every citizen has equal access to opportunities, resources, and representation. We envision a future built on the pillars of integrity, community, and continuous progress.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-y border-slate-100 py-16 md:py-20">
        <div className="container-padded">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 text-center">
            <div className="space-y-3 px-4">
              <div className="text-5xl md:text-6xl font-bold font-display text-primary tracking-tight">28</div>
              <div className="text-slate-500 font-medium uppercase tracking-wider text-xs md:text-sm">Districts</div>
            </div>
            <div className="space-y-3 px-4">
              <div className="text-5xl md:text-6xl font-bold font-display text-primary tracking-tight">{volunteerCount}+</div>
              <div className="text-slate-500 font-medium uppercase tracking-wider text-xs md:text-sm">Volunteers</div>
            </div>
            <div className="space-y-3 px-4">
              <div className="text-5xl md:text-6xl font-bold font-display text-primary tracking-tight">{grievanceCount}+</div>
              <div className="text-slate-500 font-medium uppercase tracking-wider text-xs md:text-sm">Grievances Resolved</div>
            </div>
            <div className="space-y-3 px-4">
              <div className="text-5xl md:text-6xl font-bold font-display text-primary tracking-tight">{eventCount}</div>
              <div className="text-slate-500 font-medium uppercase tracking-wider text-xs md:text-sm">Events Hosted</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="container-padded py-20 md:py-28 bg-background">
        <div className="text-center space-y-4 mb-20">
          <span className="text-warning font-semibold tracking-wider uppercase text-sm">Our Ethics</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-dark">Core Values</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white p-10 rounded-2xl border border-slate-100 shadow-card flex flex-col items-start ${i % 2 === 0 ? 'lg:translate-y-8' : ''}`}
            >
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                <value.icon className="w-7 h-7 text-dark" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-display font-bold text-dark mb-4">{value.title}</h3>
              <p className="text-slate-600 leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="container-padded py-20 md:py-28 bg-white border-t border-slate-100">
        <div className="text-center space-y-4 mb-20">
          <span className="text-warning font-semibold tracking-wider uppercase text-sm">Our Journey</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-dark">Party Timeline</h2>
        </div>
        
        <div ref={timelineRef} className="max-w-3xl mx-auto space-y-16">
          {milestones.map((ms, i) => (
            <div key={ms.year} className="timeline-item flex flex-col md:flex-row gap-8 md:gap-16 items-start group">
              <div className="md:w-1/3 pt-2">
                <span className="text-5xl md:text-6xl font-display font-bold text-warning tracking-tighter opacity-80 group-hover:opacity-100 transition-opacity">
                  {ms.year}
                </span>
              </div>
              <div className="md:w-2/3 border-l-2 border-slate-100 pl-8 pb-8">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-dark mb-4">{ms.title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed">{ms.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
