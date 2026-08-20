import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Clock, Calendar, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCollection, COLLECTIONS, where, orderBy, limit } from '@/firebase/firestore';
import { firebaseServicesEnabled } from '@/firebase/config';
import type { PartyEvent } from '@/types';
import { formatDate } from '@/lib/utils';
import { Timestamp } from 'firebase/firestore';

import gallery1 from '@/images/gallery-1.jpeg';
import gallery2 from '@/images/gallery-2.jpeg';
import gallery3 from '@/images/gallery-3.jpeg';
import gallery4 from '@/images/gallery-4.jpeg';

const fallbackEvents: PartyEvent[] = [
  {
    id: '1',
    title: 'People First Town Hall & Citizen Meet',
    slug: 'town-hall-aug-2026',
    date: Timestamp.fromDate(new Date('2026-08-14')),
    location: 'Hapur City Auditorium',
    address: 'Civil Lines, Hapur',
    district: 'Hapur',
    type: 'Public Town Hall',
    description: 'Open town hall to hear citizen concerns, present our 100-day development roadmap, and engage in direct Q&A.',
    imageUrl: gallery4,
    registrationOpen: true,
    featured: true,
    published: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: '2',
    title: 'Women Empowerment & Self-Reliance Drive',
    slug: 'women-workshop-aug-2026',
    date: Timestamp.fromDate(new Date('2026-08-18')),
    location: 'District Training Hall',
    address: 'Collectorate Road, Hapur',
    district: 'Hapur',
    type: 'Workshop',
    description: 'A full-day workshop on entrepreneurship, safety corridors, and self-help group financial support.',
    imageUrl: gallery2,
    registrationOpen: true,
    featured: false,
    published: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: '3',
    title: 'Youth Leadership & Career Summit',
    slug: 'youth-drive-aug-2026',
    date: Timestamp.fromDate(new Date('2026-08-22')),
    location: 'All Blocks, Hapur',
    address: 'Various Locations',
    district: 'Hapur',
    type: 'Campaign',
    description: 'Join ASPK4Hapur\'s youth wing and be part of the new generation leading community progress.',
    imageUrl: gallery3,
    registrationOpen: true,
    featured: false,
    published: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: '4',
    title: 'Hapur Cleanliness & Green Environment Drive',
    slug: 'hapur-green-drive-aug-2026',
    date: Timestamp.fromDate(new Date('2026-08-26')),
    location: 'Garhmukteshwar Road',
    address: 'Garh Road, Hapur',
    district: 'Hapur',
    type: 'Community Service',
    description: 'Community-led tree plantation and waste management drive across major wards.',
    imageUrl: gallery4,
    registrationOpen: true,
    featured: false,
    published: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: '5',
    title: 'Farmer Rights & Kisaan Support Rally',
    slug: 'kisaan-rally-sep-2026',
    date: Timestamp.fromDate(new Date('2026-09-02')),
    location: 'Dhaulana Mandi Grounds',
    address: 'Dhaulana, Hapur',
    district: 'Hapur',
    type: 'Kisaan Wing',
    description: 'Rally for fair crop pricing, canal irrigation facilities, and direct farmer welfare subsidies.',
    imageUrl: gallery1,
    registrationOpen: true,
    featured: false,
    published: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: '6',
    title: 'Free Medical Camp & Healthcare Drive',
    slug: 'health-camp-sep-2026',
    date: Timestamp.fromDate(new Date('2026-09-07')),
    location: 'Pilkhuwa Community Center',
    address: 'Pilkhuwa, Hapur',
    district: 'Hapur',
    type: 'Health Wing',
    description: 'Free health checkups, eye tests, and essential medicine distribution for rural families.',
    imageUrl: gallery2,
    registrationOpen: true,
    featured: false,
    published: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: '7',
    title: 'Primary Education & School Infrastructure Meet',
    slug: 'education-meet-sep-2026',
    date: Timestamp.fromDate(new Date('2026-09-12')),
    location: 'Babugarh Primary School',
    address: 'Babugarh, Hapur',
    district: 'Hapur',
    type: 'Education Wing',
    description: 'Public meeting to address primary school facilities, teacher recruitment, and student scholarships.',
    imageUrl: gallery3,
    registrationOpen: true,
    featured: false,
    published: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: '8',
    title: 'Digital Governance & Grievance Portal Launch',
    slug: 'digital-portal-sep-2026',
    date: Timestamp.fromDate(new Date('2026-09-18')),
    location: 'ASPK Party Headquarters',
    address: 'Delhi Road, Hapur',
    district: 'Hapur',
    type: 'IT & Media Cell',
    description: 'Launch of automated complaint tracking system for rapid public grievance resolution.',
    imageUrl: gallery4,
    registrationOpen: true,
    featured: false,
    published: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: '9',
    title: 'Small Business & Local Trader Conclave',
    slug: 'trader-conclave-sep-2026',
    date: Timestamp.fromDate(new Date('2026-09-24')),
    location: 'Hapur Grain Market Hall',
    address: 'Grain Market, Hapur',
    district: 'Hapur',
    type: 'Traders Wing',
    description: 'Discussion on tax simplification, market security, and infrastructure support for local shops.',
    imageUrl: gallery1,
    registrationOpen: true,
    featured: false,
    published: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: '10',
    title: 'Gram Panchayat Outreach & Rozgar Mela',
    slug: 'rozgar-mela-sep-2026',
    date: Timestamp.fromDate(new Date('2026-09-28')),
    location: 'Simbhaoli Block Grounds',
    address: 'Simbhaoli, Hapur',
    district: 'Hapur',
    type: 'Rural Wing',
    description: 'Connecting local youth with vocational skills and employment opportunities across Hapur district.',
    imageUrl: gallery2,
    registrationOpen: true,
    featured: false,
    published: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

export default function EventsSection() {
  const remoteDataEnabled = firebaseServicesEnabled;
  const query = useQuery({
    queryKey: ['events', 'home'],
    queryFn: () => getCollection<PartyEvent>(COLLECTIONS.EVENTS, [
      where('published', '==', true),
      orderBy('date', 'asc'),
      limit(10),
    ]).catch(() => fallbackEvents),
    placeholderData: fallbackEvents,
    enabled: remoteDataEnabled,
  });

  const list = remoteDataEnabled ? (query.data ?? fallbackEvents) : fallbackEvents;
  
  if (!list.length) return null;

  const featuredEvent = list.find(e => e.featured) || list[0];
  const sideEvents = list.filter(e => e.id !== featuredEvent.id);

  const getEventDateInfo = (dateObj: any) => {
    const date = dateObj?.toDate ? dateObj.toDate() : new Date(dateObj as unknown as string);
    return {
      date,
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(),
    };
  };

  const featuredDate = getEventDateInfo(featuredEvent.date);

  return (
    <section className="py-20 md:py-28 bg-slate-50 relative overflow-hidden" aria-labelledby="events-heading">
      {/* Custom CSS for seamless vertical marquee scrolling */}
      <style>{`
        @keyframes verticalScrollMarquee {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }
        .animate-vertical-events {
          animation: verticalScrollMarquee 15s linear infinite;
        }
        .animate-vertical-events:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="container-padded relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider mb-3">
              <Calendar className="w-3.5 h-3.5 fill-[var(--color-primary)]" />
              <span>Upcoming Public Schedule</span>
            </div>
            <h2
              id="events-heading"
              className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight"
            >
              Join the <span className="text-[var(--color-primary)]">Movement</span>
            </h2>
          </div>

          <Link
            to="/events"
            className="group inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:text-[#000270] transition-colors uppercase tracking-wider"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Single Full-Width Featured Event Card */}
        <div className="w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full group relative rounded-xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-200/20 hover:border-[var(--color-primary)] transition-all duration-300 flex flex-col justify-end min-h-[420px] sm:min-h-[500px] md:min-h-[550px] lg:min-h-[600px]"
          >
            <div className="absolute inset-0 w-full h-full">
              <img
                src={featuredEvent.imageUrl}
                alt={featuredEvent.title}
                className="w-full h-full object-cover object-center md:object-[center_20%] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
            </div>
            
            {/* Floating Date Badge */}
            <div className="absolute top-6 left-6 z-10 bg-white rounded-xl shadow-xl flex flex-col items-center justify-center w-16 h-20 overflow-hidden border border-slate-100 shrink-0">
              <div className="bg-[var(--color-primary)] text-white w-full text-center text-[10px] font-extrabold uppercase py-1 tracking-wider">
                {featuredDate.month}
              </div>
              <div className="flex-1 flex items-center justify-center">
                <span className="text-2xl font-extrabold text-slate-900 leading-none">{featuredDate.day}</span>
              </div>
            </div>

            {/* Card Content Overlay */}
            <div className="relative z-10 p-5 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex-1 w-full">
                  <Link to={`/events/${featuredEvent.slug}`} className="block">
                    <div className="flex flex-wrap items-center gap-2.5 mb-3">
                      <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-white/20">
                        {featuredEvent.type}
                      </span>
                      {featuredEvent.registrationOpen && (
                        <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider shadow-sm">
                          Open For All
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold !text-white mb-2 sm:mb-3 leading-tight transition-colors">
                      {featuredEvent.title}
                    </h3>
                    
                    <p className="text-white/80 text-sm md:text-base line-clamp-2 font-medium leading-relaxed mb-4 sm:mb-6">
                      {featuredEvent.description}
                    </p>
                  </Link>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-white/90 font-semibold pt-4 border-t border-white/15">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                      {featuredEvent.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      {formatDate(featuredDate.date)}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 w-full md:w-auto mt-2 md:mt-0">
                  <Link
                    to="/join"
                    className="w-full text-center px-8 py-3.5 rounded-lg border border-transparent bg-[var(--color-primary)] text-white font-bold hover:bg-[#000270] transition-all duration-300 text-sm sm:text-base shadow-lg hover:-translate-y-1"
                  >
                    Join the Movement
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
