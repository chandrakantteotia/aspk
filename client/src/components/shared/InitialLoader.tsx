import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InitialLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Keep it on screen for exactly 2.5 seconds to let the luxury animation play
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="luxury-loader"
          initial={{ y: 0 }}
          exit={{ 
            y: '-100%', 
            transition: { 
              duration: 1.2, 
              ease: [0.76, 0, 0.24, 1] 
            } 
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B0F19] overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full bg-primary/10 blur-[120px] pointer-events-none"
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* Luxury Logo Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 flex items-center justify-center shadow-[0_0_50px_rgba(250,204,21,0.15)] mb-6"
            >
              <span className="text-[#0B0F19] text-2xl sm:text-3xl font-black font-display tracking-tight">
                A4
              </span>
            </motion.div>

            {/* Brand Text */}
            <div className="overflow-hidden mb-8">
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex items-center text-3xl sm:text-4xl"
              >
                <span className="font-display font-bold tracking-tight text-white">ASPK</span>
                <span className="font-display font-medium tracking-tight text-yellow-400">4Hapur</span>
              </motion.div>
            </div>

            {/* Minimal Premium Loading Line */}
            <motion.div 
              className="w-40 h-[2px] bg-white/10 overflow-hidden relative rounded-full"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 160, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-200 to-yellow-500 rounded-full"
                initial={{ width: '0%', x: '-100%' }}
                animate={{ width: '50%', x: '250%' }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.8, 
                  ease: "easeInOut",
                  delay: 1.0 
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
