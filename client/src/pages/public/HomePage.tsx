import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroSection from '@/components/sections/HeroSection';
import YoutubeSlider from '@/components/sections/YoutubeSlider';
import SocialMediaFeedSection from '@/components/sections/SocialMediaFeedSection';
import NewsSection from '@/components/sections/NewsSection';
import InspirationSection from '@/components/sections/InspirationSection';
import EventsSection from '@/components/sections/EventsSection';
import ManifestoPreview from '@/components/sections/ManifestoPreview';

const HomePage: React.FC = () => {
  return (
    <main className="w-full overflow-x-hidden bg-background">
      <HeroSection />
      <YoutubeSlider />
      <SocialMediaFeedSection />
      <NewsSection />
      <InspirationSection />
      <EventsSection />
      <ManifestoPreview />
    </main>
  );
};

export default HomePage;
