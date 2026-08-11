import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Twitter, Facebook, Instagram, Mail } from 'lucide-react';
import { getCollection, COLLECTIONS } from '@/firebase/firestore';
import { toast } from 'react-hot-toast';
import PageLoader from '@/components/shared/PageLoader';

interface Member {
  id: string;
  name: string;
  role: string;
  wing: string;
  bio: string;
  photoUrl: string;
  socials?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    email?: string;
  };
}

const wings = ['All', 'National', 'State', 'District', 'Youth Wing', 'Women\'s Wing'];

const getWingColor = (wing: string) => {
  switch(wing) {
    case 'National': return 'bg-blue-100 text-blue-700';
    case 'State': return 'bg-emerald-100 text-emerald-700';
    case 'District': return 'bg-purple-100 text-purple-700';
    case 'Youth Wing': return 'bg-amber-100 text-amber-700';
    case 'Women\'s Wing': return 'bg-pink-100 text-pink-700';
    default: return 'bg-slate-100 text-slate-700';
  }
};

const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getCollection(COLLECTIONS.PARTY_MEMBERS);
        if (data && data.length > 0) {
          setMembers(data as Member[]);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        toast.error('Failed to load live members.');
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const filteredMembers = activeTab === 'All' 
    ? members 
    : members.filter(m => m.wing === activeTab);

  return (
    <main className="w-full bg-background min-h-screen pb-20 md:pb-28">
      {/* Hero */}
      <section className="bg-white py-20 md:py-28 border-b border-slate-100">
        <div className="container-padded text-center max-w-4xl mx-auto space-y-6">
          <span className="font-semibold tracking-widest uppercase text-sm text-primary">Leadership</span>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-dark tracking-tight">Our Party Members</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">Meet the dedicated individuals working tirelessly for the progress of Hapur.</p>
        </div>
      </section>

      {/* Tabs */}
      <section className="container-padded py-16">
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {wings.map(wing => (
            <button
              key={wing}
              onClick={() => setActiveTab(wing)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === wing 
                  ? 'bg-dark text-white shadow-button' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {wing}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <PageLoader className="py-20" />
        ) : filteredMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-bold text-dark font-display mb-2">No members found</h3>
            <p className="text-slate-500">The leadership directory is currently being updated.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredMembers.map((member, i) => (
                <motion.div
                  key={member.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                  className="bg-white rounded-2xl overflow-hidden shadow-card border border-slate-100 group hover:shadow-premium transition-all duration-300 flex flex-col hover:-translate-y-1"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-50">
                    <img 
                      src={member.photoUrl} 
                      alt={member.name} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-dark/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col relative bg-white">
                    <div className={`absolute -top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm ring-2 ring-white ${getWingColor(member.wing)}`}>
                      {member.wing}
                    </div>
                    
                    <h3 className="text-xl font-bold text-dark font-display mb-1 truncate">{member.name}</h3>
                    <p className="text-primary font-semibold mb-3 text-[11px] tracking-wider uppercase truncate">{member.role}</p>
                    
                    <p className="text-slate-600 leading-relaxed mb-4 flex-grow text-xs line-clamp-4">{member.bio}</p>
                    
                    <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-100">
                      {member.socials?.twitter && (
                        <a href={member.socials.twitter} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 transition-colors"><Twitter className="w-3.5 h-3.5" /></a>
                      )}
                      {member.socials?.facebook && (
                        <a href={member.socials.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#4267B2] hover:bg-[#4267B2]/10 transition-colors"><Facebook className="w-3.5 h-3.5" /></a>
                      )}
                      {member.socials?.instagram && (
                        <a href={member.socials.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#E1306C] hover:bg-[#E1306C]/10 transition-colors"><Instagram className="w-3.5 h-3.5" /></a>
                      )}
                      {member.socials?.email && (
                        <a href={`mailto:${member.socials.email}`} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-dark hover:bg-slate-200 transition-colors"><Mail className="w-3.5 h-3.5" /></a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </main>
  );
};

export default MembersPage;
