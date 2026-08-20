import React from 'react';
import { motion } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, Download, Heart, Leaf, Shield, BookOpen, Briefcase, Activity, Landmark, Wifi, Home, Bus, Scale } from 'lucide-react';

const pillars = [
  { id: '1', icon: Shield, title: 'Transparent Governance', summary: 'Eradicating corruption and ensuring open data for all citizens.', details: 'We are committed to implementing digital dashboards that track every rupee spent by the administration. Citizens will have full access to public records, fostering trust and eradicating systemic corruption. Regular audits will be published transparently.', status: 85 },
  { id: '2', icon: Briefcase, title: 'Employment & Youth', summary: 'Creating 50,000 new local jobs in the next 5 years.', details: 'By establishing modern IT parks and supporting local MSMEs, we will stimulate economic growth. Skill development centers will be set up in every block to ensure our youth are job-ready for the future economy. Special funds will be allocated for youth-led startups.', status: 40 },
  { id: '3', icon: Heart, title: 'Healthcare Access', summary: 'Universal healthcare coverage and upgrading primary health centers.', details: 'Every citizen deserves access to quality healthcare. We will upgrade all Primary Health Centers with modern equipment and ensure 24/7 doctor availability. A digital health card system will be rolled out to streamline patient care.', status: 60 },
  { id: '4', icon: BookOpen, title: 'Education Reform', summary: 'Modernizing public schools and integrating digital curriculums.', details: 'Public schools will receive significant infrastructure upgrades, including smart classrooms and modern labs. We are introducing a digital-first curriculum that emphasizes coding, critical thinking, and financial literacy from an early age.', status: 55 },
  { id: '5', icon: Leaf, title: 'Sustainable Environment', summary: 'Green initiatives, waste management, and renewable energy.', details: 'We pledge to increase the green cover of Hapur by 20% through aggressive plantation drives. A comprehensive solid waste management system will be implemented, and subsidies provided for residential solar panel installations.', status: 30 },
  { id: '6', icon: Activity, title: 'Sports & Wellness', summary: 'Building world-class sports complexes and promoting fitness.', details: 'To nurture local talent, state-of-the-art sports facilities will be developed. We will organize annual district-level tournaments to promote physical wellness and team spirit among the youth.', status: 70 },
  { id: '7', icon: Landmark, title: 'Cultural Heritage', summary: 'Preserving our history and promoting local arts.', details: 'Hapur has a rich cultural history that must be preserved. We will establish heritage walks, fund local artisans, and create cultural hubs to celebrate and protect our traditions for future generations.', status: 90 },
  { id: '8', icon: Wifi, title: 'Digital Infrastructure', summary: 'Free public Wi-Fi zones and 100% digital literacy.', details: 'To bridge the digital divide, free high-speed Wi-Fi will be provided in all public spaces. We are launching a massive campaign to achieve 100% digital literacy among adults in rural areas.', status: 50 },
  { id: '9', icon: Home, title: 'Housing for All', summary: 'Affordable housing schemes for the underprivileged.', details: 'Shelter is a basic human right. We will launch subsidized housing projects targeting lower-income families. Strict regulations will ensure quality construction and timely delivery of these homes.', status: 45 },
  { id: '10', icon: Bus, title: 'Transport & Roads', summary: 'Pothole-free roads and robust public transport system.', details: 'Our infrastructure master plan guarantees the repair and maintenance of all major roads. We will introduce a fleet of electric buses to provide eco-friendly, reliable, and affordable public transportation.', status: 65 },
  { id: '11', icon: Scale, title: 'Women Empowerment', summary: 'Equal opportunities, safety, and financial independence for women.', details: 'Women safety is our top priority. We will install smart surveillance and increase police patrolling in sensitive areas. Furthermore, interest-free micro-loans will be offered to women entrepreneurs.', status: 80 },
];

const ManifestoPage: React.FC = () => {
  return (
    <main className="w-full bg-background min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative py-28 md:py-36 bg-dark overflow-hidden flex items-center justify-center">
        <div className="container-padded relative z-10 text-center space-y-8 max-w-4xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-warning font-semibold tracking-widest uppercase text-sm"
          >
            Vision for the Future
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight"
          >
            Our Manifesto
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-300 leading-relaxed mx-auto max-w-2xl"
          >
            A comprehensive blueprint for the sustainable and inclusive development of Hapur.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-8"
          >
            <a 
              href="#" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-white text-white font-semibold rounded-xl hover:bg-white hover:text-dark transition-all duration-300"
            >
              <Download className="w-5 h-5" />
              Download PDF Version
            </a>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-padded py-20 md:py-28">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">The 11 Pillars</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-dark">Our Promises to You</h2>
          </div>

          <Accordion.Root type="single" collapsible className="space-y-6">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Accordion.Item 
                  value={pillar.id}
                  className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden"
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-6 text-left">
                        <div className="w-14 h-14 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <pillar.icon className="w-6 h-6 text-warning" strokeWidth={1.5} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-dark font-display">{pillar.title}</h3>
                          <p className="text-slate-500 text-sm mt-2">{pillar.summary}</p>
                        </div>
                      </div>
                      <ChevronDown className="w-6 h-6 text-slate-400 group-data-[state=open]:rotate-180 transition-transform duration-300 flex-shrink-0 ml-4" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
                    <div className="p-8 pt-0 border-t border-slate-100 mt-2">
                      <p className="text-slate-600 text-lg leading-relaxed py-6">
                        {pillar.details}
                      </p>
                      
                      {/* Progress Track */}
                      <div className="mt-4 pt-8 border-t border-slate-100">
                        <div className="flex justify-between items-end mb-4">
                          <div>
                            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-1">Status</span>
                            <span className="text-sm font-medium text-dark">Implementation Progress</span>
                          </div>
                          <span className="text-2xl font-bold text-primary font-display">{pillar.status}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <motion.div 
                            className="bg-primary h-2 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pillar.status}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              </motion.div>
            ))}
          </Accordion.Root>
        </div>
      </section>
    </main>
  );
};

export default ManifestoPage;
