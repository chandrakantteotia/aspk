import React from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete?: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ 
        y: '-100%', 
        transition: { 
          duration: 1.2, 
          ease: [0.76, 0, 0.24, 1],
          delay: 0.2 // A small pause before sliding out
        } 
      }}
      onAnimationComplete={(definition) => {
        if (definition === 'exit' || (typeof definition === 'object' && definition.y === '-100%')) {
          onComplete?.();
        }
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A] overflow-hidden"
    >
      {/* Background glow effect */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-primary/10 blur-[100px] pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Luxury Logo Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold)] flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.2)] mb-6"
        >
          <span className="text-slate-900 text-xl sm:text-2xl font-black font-display tracking-tight">
            A4
          </span>
        </motion.div>

        {/* Brand Text */}
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex items-center text-2xl sm:text-3xl"
          >
            <span className="font-display font-bold tracking-tight text-white">ASPK</span>
            <span className="font-display font-medium tracking-tight text-[var(--color-gold)]">4Hapur</span>
          </motion.div>
        </div>

        {/* Minimal loading line */}
        <motion.div 
          className="mt-8 h-[1px] bg-white/20 overflow-hidden relative"
          initial={{ width: 0 }}
          animate={{ width: 140 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        >
          <motion.div 
            className="absolute inset-y-0 left-0 bg-[var(--color-gold)]"
            initial={{ width: '0%', x: '-100%' }}
            animate={{ width: '50%', x: '200%' }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "easeInOut",
              delay: 0.8 
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
