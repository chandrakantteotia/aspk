import React from 'react';
import { motion } from 'framer-motion';
import footerLogo from '@/images/footerlogo.png';

interface PageLoaderProps {
  className?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({ className = 'h-64' }) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3.5 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Outer Spinning Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
          className="w-14 h-14 rounded-full border-2 border-[#0004A3]/20 border-t-[#0004A3] border-r-blue-400"
        />
        {/* Inner Logo Badge */}
        <img
          src={footerLogo}
          alt="Loading..."
          className="absolute w-7 h-7 object-contain drop-shadow"
        />
      </div>
      <p className="text-xs text-[#0004A3] font-bold font-display tracking-widest uppercase animate-pulse">
        ASPK4HAPUR
      </p>
    </div>
  );
};

export default PageLoader;
