import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCollection, COLLECTIONS, where, orderBy, limit } from '@/firebase/firestore';
import { firebaseServicesEnabled } from '@/firebase/config';
import type { PartyEvent } from '@/types';
import { formatDate } from '@/lib/utils';
import { Timestamp } from 'firebase/firestore';

const fallbackEvents: PartyEvent[] = [
  {
    id: '1',
    title: 'People First Town Hall',
    slug: 'town-hall-aug-2026',
    date: Timestamp.fromDate(new Date('2026-08-14')),
    location: 'Hapur City Auditorium',
    address: 'Civil Lines, Hapur',
    district: 'Hapur',
    type: 'Public Meet',
    description: 'Open town hall to hear your concerns and present our 100-day plan.',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80',
    registrationOpen: true,
    featured: true,
    published: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: '2',
    title: 'Women Empowerment Workshop',
    slug: 'women-workshop-aug-2026',
    date: Timestamp.fromDate(new Date('2026-08-18')),
    location: 'District Training Hall',
    address: 'Collectorate Road, Hapur',
    district: 'Hapur',
    type: 'Workshop',
    description: 'A full-day workshop on entrepreneurship, safety, and self-help group formation.',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
    registrationOpen: true,
    featured: false,
    published: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: '3',
    title: 'Youth Membership Drive',
    slug: 'youth-drive-aug-2026',
    date: Timestamp.fromDate(new Date('2026-08-22')),
    location: 'All Blocks, Hapur',
    address: 'Various Locations',
    district: 'Hapur',
    type: 'Campaign',
    description: 'Join ASPK4Hapur\'s youth wing and be part of the change generation.',
    imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=80',
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
      limit(4),
    ]).catch(() => fallbackEvents),
    placeholderData: fallbackEvents,
    enabled: remoteDataEnabled,
  });

  const list = remoteDataEnabled ? (query.data ?? fallbackEvents) : fallbackEvents;
  
  if (!list.length) return null;

  const featuredEvent = list.find(e => e.featured) || list[0];
  const regularEvents = list.filter(e => e.id !== featuredEvent.id).slice(0, 3);

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
    <section className="py-24 bg-gray-50 relative overflow-hidden" aria-labelledby="events-heading">
      <div className="container-padded relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-widest text-primary mb-4"
            >
              Upcoming Events
            </motion.p>
            <motion.h2
              id="events-heading"
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display font-bold text-4xl md:text-5xl text-dark"
            >
              Join the Movement
            </motion.h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-dark transition-colors uppercase tracking-wider"
          >
            View All Events
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Featured Event */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="lg:col-span-7 group block relative rounded-2xl overflow-hidden bg-white shadow-premium"
          >
            <Link to={`/events/${featuredEvent.slug}`} className="block relative h-full min-h-[400px]">
              <div className="absolute inset-0">
                <img src={featuredEvent.imageUrl} alt={featuredEvent.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent" />
              </div>
              
              <div className="absolute top-6 left-6 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center w-16 h-20 overflow-hidden">
                <div className="bg-primary text-white w-full text-center text-[10px] font-bold uppercase py-1 tracking-wider">
                  {featuredDate.month}
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-2xl font-black text-dark leading-none">{featuredDate.day}</span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
                    {featuredEvent.type}
                  </span>
                  {featuredEvent.registrationOpen && (
                    <span className="px-3 py-1 rounded-full bg-warning text-dark text-xs font-bold uppercase tracking-wider">
                      Register Now
                    </span>
                  )}
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 leading-tight group-hover:text-amber-100 transition-colors">
                  {featuredEvent.title}
                </h3>
                <div className="flex flex-wrap items-center gap-6 text-sm text-white/80 font-medium">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {featuredEvent.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    {formatDate(featuredDate.date)}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* List Events */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {regularEvents.map((event, i) => {
              const dateInfo = getEventDateInfo(event.date);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={`/events/${event.slug}`}
                    className="group flex gap-6 p-6 bg-white rounded-2xl border-l-4 border-transparent hover:border-primary shadow-sm hover:shadow-premium transition-all duration-300 h-full"
                  >
                    <div className="flex flex-col items-center justify-center shrink-0 w-16 h-16 rounded-xl bg-gray-50 group-hover:bg-primary/5 transition-colors">
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{dateInfo.month}</span>
                      <span className="text-2xl font-black text-dark leading-none">{dateInfo.day}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                        {event.type}
                      </div>
                      <h3 className="font-display font-bold text-xl text-dark mb-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[120px]">{event.location}</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
