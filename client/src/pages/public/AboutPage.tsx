import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Target, Eye, Shield, Users, Lightbulb, Heart, CheckCircle2,
  ArrowRight, Award, Sparkles, Building2, Quote, FileText, ChevronRight
} from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import heroDesktopImg from '@/images/herodesktop.png';

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    icon: Shield,
    title: 'Transparency',
    desc: 'Open governance, accessible public data, and complete clarity in policy execution.',
    badge: 'Core Ethos'
  },
  {
    icon: CheckCircle2,
    title: 'Accountability',
    desc: 'Taking full ownership for every pledge made and delivering measurable citizen results.',
    badge: 'Responsibility'
  },
  {
    icon: Users,
    title: 'Community First',
    desc: 'Empowering local voices and ensuring grassroots participation in district development.',
    badge: 'People-Centric'
  },
  {
    icon: Lightbulb,
    title: 'Digital Innovation',
    desc: 'Implementing modern digital tools for grievance redressal and smart civic solutions.',
    badge: 'Future-Ready'
  },
  {
    icon: Target,
    title: 'Unwavering Integrity',
    desc: 'Maintaining high moral standards and zero-tolerance against corruption.',
    badge: 'Trust'
  },
  {
    icon: Heart,
    title: 'Inclusive Progress',
    desc: 'Ensuring equal opportunity, dignity, and growth for every citizen across all demographics.',
    badge: 'Equality'
  },
];

const milestones = [
  {
    year: '2018',
    title: 'Foundation of the Movement',
    desc: 'ASPK4Hapur was formed with a grassroots mission to bring transparent, citizen-focused governance to the region.',
    tag: 'Origin'
  },
  {
    year: '2021',
    title: 'District Expansion',
    desc: 'Expanded organizational network across 10+ sub-districts and built a dedicated volunteer force of over 5,000 citizens.',
    tag: 'Growth'
  },
  {
    year: '2024',
    title: 'Digital Governance Launch',
    desc: 'Pioneered online public grievance submission and real-time complaint tracking systems for immediate administrative response.',
    tag: 'Innovation'
  },
  {
    year: '2026',
    title: 'Next-Gen Citizen Platform',
    desc: 'Unveiling a modern digital ecosystem integrating news, events, complaints, and direct citizen representation.',
    tag: 'Future'
  },
];

const commitments = [
  'Zero-tolerance for administrative delays in public services.',
  '100% digital tracking for every citizen grievance submitted.',
  'Regular open-house town halls with district leadership.',
  'Dedicated youth and women empowerment campaigns.'
];

export default function AboutPage() {
  const timelineRef = useRef<HTMLDivElement>(null);

  const districtCount = useCountUp(28, 1500);
  const volunteerCount = useCountUp(14250, 2000);
  const grievanceCount = useCountUp(8900, 2000);
  const eventCount = useCountUp(1260, 2000);

  useEffect(() => {
    if (!timelineRef.current) return;
    const items = timelineRef.current.querySelectorAll('.timeline-item');

    items.forEach((item) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
          },
        }
      );
    });
  }, []);

  return (
    <main className="w-full bg-slate-50 min-h-screen text-slate-900 overflow-x-hidden">
      {/* ── 1. Hero Section (White Background & Mobile Responsive) ── */}
      <section className="relative pt-36 sm:pt-36 lg:pt-40 pb-16 sm:pb-20 lg:pb-28 bg-white border-b border-slate-200/80 text-slate-900 overflow-hidden">
        {/* Subtle Background Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-50/80 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-5 w-60 sm:w-80 h-60 sm:h-80 bg-amber-50/80 rounded-full blur-3xl pointer-events-none" />

        <div className="container-padded relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-[1.18] sm:leading-[1.15] text-slate-900"
              >
                Building a Transparent & Digitally Empowered <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-blue-700 to-blue-900">Hapur</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal"
              >
                ASPK4Hapur is dedicated to transforming district governance through modern technology, absolute public transparency, and relentless community advocacy.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4"
              >
                <Link
                  to="/join"
                  className="px-6 sm:px-7 py-3.5 rounded-full bg-[var(--color-primary)] hover:bg-blue-900 text-white font-bold text-sm shadow-[0_4px_20px_rgba(0,4,163,0.3)] transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                >
                  <span>Join Our Movement</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/manifesto"
                  className="px-6 sm:px-7 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Read Manifesto</span>
                </Link>
              </motion.div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative mx-auto max-w-md lg:max-w-none rounded-xl sm:rounded-xl overflow-hidden p-2 sm:p-2.5 bg-slate-100 border border-slate-200 shadow-xl"
              >
                <img
                  src={heroDesktopImg}
                  alt="ASPK4Hapur Leadership & Community Rallies"
                  className="w-full h-64 sm:h-88 lg:h-96 object-cover rounded-xl sm:rounded-xl filter brightness-105 contrast-105"
                />

                {/* Floating Badge overlay */}
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 p-3 sm:p-4 rounded-xl sm:rounded-xl bg-slate-900/90  border border-slate-800 text-white flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-yellow-300 shrink-0">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider">Trusted by Citizens</p>
                      <p className="text-xs sm:text-sm font-bold text-white">Serving Hapur with Honor</p>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs font-extrabold text-yellow-400 bg-yellow-400/10 px-2 sm:px-2.5 py-1 rounded-md border border-yellow-400/20 whitespace-nowrap">
                    Est. 2018
                  </span>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. Impact & Stats Bar ── */}
      <section className="relative z-20 -mt-8 sm:-mt-10 container-padded">
        <div className="bg-white rounded-xl sm:rounded-xl shadow-xl border border-slate-200/80 p-5 sm:p-8 lg:p-10 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          
          <div className="flex flex-col items-center text-center p-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-xl bg-blue-50 text-[var(--color-primary)] flex items-center justify-center mb-2 sm:mb-3">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 tracking-tight">
              {districtCount}+
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px] sm:text-xs mt-1">
              Active Zones & Wards
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-2 pt-4 sm:pt-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 sm:mb-3">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 tracking-tight">
              {volunteerCount.toLocaleString()}+
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px] sm:text-xs mt-1">
              Registered Volunteers
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-2 pt-4 lg:pt-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 sm:mb-3">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 tracking-tight">
              {grievanceCount.toLocaleString()}+
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px] sm:text-xs mt-1">
              Grievances Resolved
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-2 pt-4 lg:pt-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2 sm:mb-3">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 tracking-tight">
              {eventCount.toLocaleString()}
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px] sm:text-xs mt-1">
              Community Campaigns
            </p>
          </div>

        </div>
      </section>

      {/* ── 3. Mission & Vision Split View ── */}
      <section className="container-padded py-16 sm:py-24 lg:py-28">
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-12 sm:mb-16">
          <span className="text-[var(--color-primary)] font-extrabold tracking-widest uppercase text-xs bg-blue-50 px-4 py-1.5 rounded-full inline-block">
            Our Strategic Purpose
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Driven by Purpose, Dedicated to Results
          </h2>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg">
            We are committed to modernizing public administration and empowering every resident of Hapur with reliable representation.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          
          {/* Mission Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-white p-6 sm:p-10 rounded-xl sm:rounded-xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 sm:w-32 h-28 sm:h-32 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            
            <div className="space-y-5 sm:space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-md">
                  <Target className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="text-4xl sm:text-5xl font-extrabold font-display text-slate-200 group-hover:text-[var(--color-primary)]/20 transition-colors">
                  01
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-3xl font-display font-bold text-slate-900 mb-2 sm:mb-3">Our Mission</h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  To serve the people of Hapur by resolving local grievances promptly, fostering transparent digital governance, and creating sustainable development programs across health, education, and infrastructure.
                </p>
              </div>

              {/* Commitments List */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                {commitments.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Vision Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="group relative bg-white p-6 sm:p-10 rounded-xl sm:rounded-xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 sm:w-32 h-28 sm:h-32 bg-yellow-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

            <div className="space-y-5 sm:space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                  <Eye className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="text-4xl sm:text-5xl font-extrabold font-display text-slate-200 group-hover:text-amber-500/20 transition-colors">
                  02
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-3xl font-display font-bold text-slate-900 mb-2 sm:mb-3">Our Vision</h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  A prosperous, clean, and technologically advanced Hapur where every citizen has equal access to administrative support, economic opportunities, and a safe, modern community environment.
                </p>
              </div>

              {/* Commitments List */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                {commitments.slice(2, 4).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── 4. Visionary Message Spotlight ── */}
      <section className="bg-gradient-to-r from-slate-900 via-[var(--color-primary)] to-slate-900 text-white py-16 sm:py-20 lg:py-24 relative overflow-hidden">
        <div className="container-padded relative z-10 max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10  border border-white/20 flex items-center justify-center mx-auto text-yellow-300">
            <Quote className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>

          <blockquote className="text-xl sm:text-3xl lg:text-4xl font-display font-bold leading-snug sm:leading-tight text-white tracking-tight px-2">
            "Governance is not about holding power; it is about serving the people with complete honesty, speed, and open accountability."
          </blockquote>

          <div className="pt-1 sm:pt-2">
            <p className="text-base sm:text-lg font-bold text-yellow-300">ASPK4Hapur Core Leadership Council</p>
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-300 font-semibold mt-1">Dedicated to Hapur District Progress</p>
          </div>
        </div>
      </section>

      {/* ── 5. Core Values Grid ── */}
      <section className="container-padded py-16 sm:py-24 lg:py-28 bg-slate-50">
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-12 sm:mb-16">
          <span className="text-[var(--color-primary)] font-extrabold tracking-widest uppercase text-xs bg-blue-50 px-4 py-1.5 rounded-full inline-block">
            Our Foundations
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Core Guiding Values
          </h2>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg">
            The unshakeable ethics that direct our decisions and actions every single day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {values.map((val, idx) => (
            <motion.div
              key={val.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white rounded-xl sm:rounded-xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-xl bg-blue-50 text-[var(--color-primary)] flex items-center justify-center">
                    <val.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-2.5 sm:px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                    {val.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 mb-2">{val.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{val.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 6. Milestone Journey Timeline ── */}
      <section className="container-padded py-16 sm:py-24 lg:py-28 bg-white border-t border-slate-200/60">
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-14 sm:mb-20">
          <span className="text-[var(--color-primary)] font-extrabold tracking-widest uppercase text-xs bg-blue-50 px-4 py-1.5 rounded-full inline-block">
            Our Evolution
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Key Historical Milestones
          </h2>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg">
            A timeline of continuous service, growth, and administrative impact in Hapur.
          </p>
        </div>

        <div ref={timelineRef} className="max-w-4xl mx-auto relative pl-4 sm:pl-0 space-y-8 sm:space-y-12">
          {/* Vertical Connecting Line for Desktop */}
          <div className="hidden sm:block absolute left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-[var(--color-primary)] via-blue-300 to-amber-400 -translate-x-1/2 rounded-full" />
          
          {/* Mobile Vertical Connecting Line */}
          <div className="sm:hidden absolute left-4 top-2 bottom-2 w-0.5 bg-blue-200 rounded-full" />

          {milestones.map((ms, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={ms.year}
                className={`timeline-item flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-8 ${
                  isEven ? 'sm:flex-row-reverse' : ''
                }`}
              >
                {/* Content Box */}
                <div className="w-full sm:w-[45%] pl-6 sm:pl-0">
                  <div className="bg-slate-50 border border-slate-200/90 rounded-xl sm:rounded-xl p-5 sm:p-8 shadow-sm hover:shadow-md transition-shadow relative">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-2xl sm:text-3xl font-extrabold font-display text-[var(--color-primary)]">{ms.year}</span>
                      <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider bg-blue-100 text-[var(--color-primary)] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                        {ms.tag}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 mb-2">{ms.title}</h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{ms.desc}</p>
                  </div>
                </div>

                {/* Center Node Indicator for Desktop */}
                <div className="hidden sm:flex z-10 w-10 h-10 rounded-full bg-[var(--color-primary)] text-yellow-300 items-center justify-center border-4 border-white shadow-md shrink-0">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
                </div>

                {/* Empty Spacer */}
                <div className="hidden sm:block w-[45%]" />
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 7. Call To Action Banner ── */}
      <section className="container-padded py-12 sm:py-20 lg:py-24">
        <div className="relative rounded-xl sm:rounded-xl bg-gradient-to-r from-[var(--color-primary)] via-blue-900 to-slate-950 text-white p-6 sm:p-12 lg:p-16 overflow-hidden shadow-lg">
          {/* Ambient Background Circles */}
          <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 sm:w-80 h-60 sm:h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
              Ready to Shape the Future of Hapur Together?
            </h2>
            <p className="text-slate-300 text-sm sm:text-lg leading-relaxed">
              Whether you want to volunteer, voice your grievance, or support our community initiatives, your participation makes a real difference.
            </p>

            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/join"
                className="px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-yellow-400 hover:bg-yellow-300 text-[var(--color-primary)] font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-95"
              >
                <span>Become a Member</span>
                <ChevronRight className="w-4 h-4" />
              </Link>

              <Link
                to="/contact"
                className="px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm  transition-all flex items-center justify-center gap-2"
              >
                <span>Get in Touch</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
