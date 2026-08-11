import { useScrollProgress } from '@/hooks/useScroll';
import { motion } from 'framer-motion';

export default function ScrollProgress() {
  const progress = useScrollProgress();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-gradient-to-r from-primary via-accent to-primary origin-left"
      style={{ scaleX: progress }}
    />
  );
}
