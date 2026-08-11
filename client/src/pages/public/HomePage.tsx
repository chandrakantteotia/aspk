import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroSection from '@/components/sections/HeroSection';
import YoutubeSlider from '@/components/sections/YoutubeSlider';
import MarqueeSection from '@/components/sections/MarqueeSection';
import NewsSection from '@/components/sections/NewsSection';
import EventsSection from '@/components/sections/EventsSection';
import ManifestoPreview from '@/components/sections/ManifestoPreview';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import NewsletterSection from '@/components/sections/NewsletterSection';

const HomePage: React.FC = () => {
  return (
    <main className="w-full overflow-hidden bg-background">
      <HeroSection />
      <YoutubeSlider />
      <MarqueeSection />
      <NewsSection />
      <EventsSection />
      <ManifestoPreview />
      <TestimonialsSection />
      
      {/* New inline CTA donate section */}
      <section className="container-padded py-20 md:py-28 relative">
        <div className="bg-white rounded-3xl overflow-hidden shadow-card relative border border-slate-100 flex flex-col md:flex-row items-center">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          <div className="md:w-1/2 p-10 md:p-16 lg:p-24 relative z-10 flex flex-col items-start space-y-6">
            <span className="text-warning font-semibold tracking-wider uppercase text-sm">
              Support the Movement
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-dark tracking-tight">
              Your Contribution Makes a Difference
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed max-w-lg">
              Help us bring transparency, development, and progress to Hapur. Every donation powers our grassroots campaigns and community initiatives.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="pt-4"
            >
              <Link 
                to="/donate"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 hover:-translate-y-1 hover:shadow-button transition-all"
              >
                Donate Now
              </Link>
            </motion.div>
          </div>
          <div className="md:w-1/2 w-full h-64 md:h-full min-h-[400px] relative">
            <img 
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80" 
              alt="Community gathering" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
          </div>
        </div>
      </section>

      <NewsletterSection />
    </main>
  );
};

export default HomePage;
