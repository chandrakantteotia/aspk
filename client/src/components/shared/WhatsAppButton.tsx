import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER ?? '+91XXXXXXXXXX';
  const message = 'Hello! I have a question about ASPK4Hapur.';
  const url = `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2 }}
      className="fixed bottom-7 right-5 z-40 w-13 h-13 rounded-2xl bg-[#25D366] text-white shadow-premium flex items-center justify-center hover:-translate-y-1 hover:scale-105 transition-all"
      aria-label="Contact on WhatsApp"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <MessageCircle className="w-6 h-6 fill-current" />
      </motion.div>
      {/* Ping ring */}
      <span className="absolute inset-0 rounded-2xl bg-[#25D366] animate-ping opacity-30" />
    </motion.a>
  );
}
