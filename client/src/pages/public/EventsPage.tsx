import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, X, ArrowRight } from 'lucide-react';
import { getCollection, COLLECTIONS } from '@/firebase/firestore';
import { toast } from 'react-hot-toast';
import PageLoader from '@/components/shared/PageLoader';

interface PartyEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl: string;
  status: 'upcoming' | 'past';
}

const fallbackEvents: PartyEvent[] = [
  { id: '1', title: 'Town Hall Meeting: Citizen Voices', date: '2026-11-20', time: '10:00 AM', location: 'Main Auditorium, Hapur', description: 'Join our leaders to discuss the pressing issues of our city and propose solutions collaboratively.', imageUrl: 'https://images.unsplash.com/photo-1541872526845-8c769493a79d?auto=format&fit=crop&w=900&q=80', status: 'upcoming' },
  { id: '2', title: 'Youth Digital Literacy Drive', date: '2026-11-25', time: '02:00 PM', location: 'Community Center, Block A', description: 'A workshop aimed at improving digital skills among the youth to prepare them for future jobs.', imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953eb1f5bc?auto=format&fit=crop&w=900&q=80', status: 'upcoming' },
  { id: '3', title: 'Clean Hapur Campaign kickoff', date: '2026-10-10', time: '07:00 AM', location: 'City Square', description: 'A massive city-wide cleanliness drive.', imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=900&q=80', status: 'past' },
  { id: '4', title: 'Healthcare Access Seminar', date: '2026-09-15', time: '11:00 AM', location: 'District Hospital Grounds', description: 'Seminar on free health camps and insurance schemes.', imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80', status: 'past' },
];

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<PartyEvent[]>(fallbackEvents);
  const [loading, setLoading] = useState(true);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<PartyEvent | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getCollection(COLLECTIONS.EVENTS);
        if (data && data.length > 0) {
          setEvents(data as PartyEvent[]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Showing fallback events data.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  const pastEvents = events.filter(e => e.status === 'past');

  const handleRegisterClick = (e: PartyEvent) => {
    setSelectedEvent(e);
    setRegisterModalOpen(true);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Registration successful! We will contact you soon.');
    setRegisterModalOpen(false);
  };

  return (
    <main className="w-full bg-background min-h-screen pb-20 md:pb-28">
      <section className="bg-white py-20 md:py-28 border-b border-slate-100">
        <div className="container-padded text-center max-w-4xl mx-auto space-y-6">
          <span className="font-semibold tracking-widest uppercase text-sm text-primary">Get Involved</span>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-dark tracking-tight">Events & Campaigns</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">Join us in our on-ground efforts to bring change to Hapur.</p>
        </div>
      </section>

      <section className="container-padded py-20 md:py-28">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-dark">Upcoming Events</h2>
        </div>
        
        {loading ? (
          <PageLoader className="py-20" />
        ) : (
          <div className="space-y-8">
            {upcomingEvents.map((evt, i) => {
              const eventDate = new Date(evt.date);
              return (
                <motion.div 
                  key={evt.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden flex flex-col md:flex-row group transition-all duration-300 hover:shadow-premium"
                >
                  <div className="md:w-64 bg-slate-50 flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-slate-100">
                    <span className="text-xl font-bold text-primary uppercase tracking-widest">{eventDate.toLocaleString('en-US', { month: 'short' })}</span>
                    <span className="text-6xl font-display font-bold text-dark leading-none my-2">{eventDate.getDate()}</span>
                    <span className="text-slate-500 font-medium">{eventDate.getFullYear()}</span>
                  </div>
                  <div className="p-8 md:p-10 flex-grow flex flex-col justify-center">
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-dark mb-4 group-hover:text-primary transition-colors">{evt.title}</h3>
                    <div className="flex flex-wrap gap-6 text-sm text-slate-500 mb-6 font-medium">
                      <span className="flex items-center"><Clock className="w-4 h-4 mr-2 text-slate-400" /> {evt.time}</span>
                      <span className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-slate-400" /> {evt.location}</span>
                    </div>
                    <p className="text-slate-600 mb-8 line-clamp-2 text-lg">{evt.description}</p>
                    <button 
                      onClick={() => handleRegisterClick(evt)} 
                      className="mt-auto self-start inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-dark bg-slate-100 rounded-xl hover:bg-primary hover:text-white transition-all group-hover:shadow-button"
                    >
                      Register Now <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
            {upcomingEvents.length === 0 && <p className="text-slate-500 italic text-lg py-10">No upcoming events scheduled at the moment.</p>}
          </div>
        )}
      </section>

      <section className="container-padded py-10">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-dark mb-12">Past Highlights</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {pastEvents.map((evt, i) => (
            <motion.div 
              key={evt.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-card border border-slate-100 group"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img src={evt.imageUrl} alt={evt.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-dark text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-display font-bold text-dark mb-3 line-clamp-1">{evt.title}</h3>
                <p className="text-slate-600 line-clamp-2 leading-relaxed">{evt.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Register Modal */}
      <AnimatePresence>
        {registerModalOpen && selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-lg p-10 relative shadow-2xl"
            >
              <button onClick={() => setRegisterModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-dark transition-colors">
                <X className="w-6 h-6" />
              </button>
              <span className="text-warning font-semibold tracking-wider uppercase text-sm mb-2 block">Event Registration</span>
              <h3 className="text-3xl font-display font-bold text-dark mb-2 line-clamp-1">{selectedEvent.title}</h3>
              <p className="text-slate-500 mb-8 flex items-center gap-2"><Calendar className="w-4 h-4"/> {new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time}</p>
              
              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Full Name</label>
                  <input required type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white outline-none transition-all text-dark" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Email</label>
                  <input required type="email" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white outline-none transition-all text-dark" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Phone Number</label>
                  <input required type="tel" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white outline-none transition-all text-dark" placeholder="+91 XXXXXXXXXX" />
                </div>
                <button type="submit" className="w-full py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary/90 transition-all shadow-button mt-4">
                  Confirm Registration
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default EventsPage;
