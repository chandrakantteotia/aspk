import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface PageLoaderProps {
  className?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({ className = 'h-64' }) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Loader2 className="w-7 h-7 text-primary animate-spin" />
        </div>
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-primary/20"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
        />
      </div>
      <p className="text-sm text-slate-400 font-medium animate-pulse">Loading...</p>
    </div>
  );
};

export default PageLoader;
