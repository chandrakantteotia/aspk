import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import footerLogo from '@/images/footerlogo.png';

export default function InitialLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fast 1 second initial loader
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="main-loader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { 
              duration: 0.6, 
              ease: 'easeInOut' 
            } 
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#000324] overflow-hidden select-none"
        >
          {/* Background Ambient Glow */}
          <div className="absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full bg-[#0004A3]/30 blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center px-4 text-center">

            {/* Logo Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center p-3 shadow-xl mb-5"
            >
              <img
                src={footerLogo}
                alt="ASPK4Hapur Logo"
                className="w-full h-full object-contain"
              />
            </motion.div>

            {/* Brand Title */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
                ASPK4HAPUR
              </div>
              <p className="text-white/60 text-[11px] font-medium tracking-widest uppercase mt-1.5">
                People First. Nation First.
              </p>
            </motion.div>

            {/* Animated Loading Bar */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-36 h-1 rounded-full bg-white/10 overflow-hidden mt-6 relative"
            >
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
                className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"
              />
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
