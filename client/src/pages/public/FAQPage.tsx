import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, Search, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  { id: '1', category: 'General', q: 'What is ASPK4Hapur?', a: 'ASPK4Hapur is a political movement dedicated to the sustainable and transparent development of Hapur district, focusing on infrastructure, education, and community welfare.' },
  { id: '2', category: 'General', q: 'How can I volunteer?', a: 'You can volunteer by visiting our Join page and filling out the membership application. Indicate your interest in volunteering in the final step.' },
  { id: '3', category: 'Membership', q: 'Is there a membership fee?', a: 'Basic membership is free. However, active members can choose to contribute voluntarily through our donation portal.' },
  { id: '4', category: 'Membership', q: 'Can I join multiple wings?', a: 'Yes, depending on your eligibility (e.g., Youth Wing or Women\'s Wing), you can be part of specific groups while retaining your general membership.' },
  { id: '5', category: 'Complaints', q: 'How do I track my grievance?', a: 'Once you submit a complaint on our Complaints page, you will receive a unique tracking ID. You can enter this ID on the same page to check real-time status updates.' },
  { id: '6', category: 'Complaints', q: 'Who handles the complaints?', a: 'Our dedicated volunteer task force reviews complaints, categorizes them, and forwards them to the respective local authorities for rapid resolution.' },
  { id: '7', category: 'Donations', q: 'Are donations tax-deductible?', a: 'Yes, contributions made to ASPK4Hapur are eligible for tax deductions under Section 80GGC of the Income Tax Act.' },
  { id: '8', category: 'Donations', q: 'What payment methods are accepted?', a: 'We accept UPI, Credit/Debit cards, and direct Bank Transfers via our secure payment gateway.' },
];

const categories = ['All', 'General', 'Membership', 'Complaints', 'Donations'];

const FAQPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesSearch = faq.q.toLowerCase().includes(search.toLowerCase()) || faq.a.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeTab === 'All' || faq.category === activeTab;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeTab]);

  return (
    <main className="w-full bg-background min-h-screen pb-20 md:pb-28">
      {/* Premium Hero */}
      <section className="relative py-24 md:py-32 bg-white border-b border-slate-100 flex flex-col items-center text-center">
        <div className="container-padded relative z-10 space-y-8">
          <span className="font-semibold tracking-widest uppercase text-sm text-warning">Support Center</span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-bold text-dark tracking-tight"
          >
            How can we help you?
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mt-10 relative"
          >
            <div className="relative flex items-center shadow-card rounded-xl bg-white border border-slate-100 group focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
              <Search className="absolute left-6 w-6 h-6 text-slate-400 group-focus-within:text-primary transition-colors" strokeWidth={2} />
              <input 
                type="text" 
                placeholder="Search for questions..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-16 pr-6 py-5 rounded-xl border-none text-lg outline-none bg-transparent text-dark placeholder:text-slate-400"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="container-padded py-16 md:py-20">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === cat 
                  ? 'bg-dark text-white shadow-button' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="max-w-3xl mx-auto min-h-[400px]">
          {filteredFaqs.length === 0 ? (
            <div className="text-center text-slate-500 py-20 flex flex-col items-center">
              <Search className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-xl">No questions found matching your search.</p>
            </div>
          ) : (
            <Accordion.Root type="multiple" className="space-y-4">
              <AnimatePresence>
                {filteredFaqs.map((faq, i) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Accordion.Item 
                      value={faq.id}
                      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                    >
                      <Accordion.Header>
                        <Accordion.Trigger className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group text-left">
                          <span className="font-display font-bold text-dark text-xl group-hover:text-primary transition-colors">{faq.q}</span>
                          <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors flex-shrink-0 ml-4">
                            <ChevronDown className="w-5 h-5 text-slate-500 group-hover:text-primary group-data-[state=open]:rotate-180 transition-transform duration-300" strokeWidth={2} />
                          </div>
                        </Accordion.Trigger>
                      </Accordion.Header>
                      <Accordion.Content className="overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
                        <div className="p-6 pt-0 text-slate-600 text-lg leading-relaxed border-t border-slate-100 mt-2">
                          <p className="pt-4">{faq.a}</p>
                        </div>
                      </Accordion.Content>
                    </Accordion.Item>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Accordion.Root>
          )}
        </div>

        {/* Still have questions CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mt-24 bg-white border border-slate-200 rounded-xl p-12 text-center relative overflow-hidden shadow-card"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-lg blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center mb-8">
              <MessageCircle className="w-10 h-10 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-dark mb-4">Still have questions?</h3>
            <p className="text-slate-600 mb-10 text-lg max-w-lg">Can't find the answer you're looking for? Please chat to our friendly team.</p>
            <Link to="/contact" className="px-10 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 hover:-translate-y-1 hover:shadow-button transition-all text-lg">
              Contact Us
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default FAQPage;
