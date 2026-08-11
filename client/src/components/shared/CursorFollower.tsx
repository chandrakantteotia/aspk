import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CursorFollower() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Only show on desktop
    setIsMobile(window.innerWidth < 1024 || 'ontouchstart' in window);

    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    let trailTimeout: ReturnType<typeof setTimeout>;
    const handleTrail = (e: MouseEvent) => {
      clearTimeout(trailTimeout);
      trailTimeout = setTimeout(() => setTrail({ x: e.clientX, y: e.clientY }), 80);
    };

    const handleHoverIn = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"]')) setIsHovering(true);
    };
    const handleHoverOut = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"]')) setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mousemove', handleTrail, { passive: true });
    document.addEventListener('mouseover', handleHoverIn);
    document.addEventListener('mouseout', handleHoverOut);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousemove', handleTrail);
      document.removeEventListener('mouseover', handleHoverIn);
      document.removeEventListener('mouseout', handleHoverOut);
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      {/* Small dot */}
      <motion.div
        className="fixed z-[9999] pointer-events-none w-2 h-2 rounded-full bg-primary mix-blend-difference"
        style={{ left: pos.x - 4, top: pos.y - 4 }}
        transition={{ type: 'spring', stiffness: 1000, damping: 50 }}
      />
      {/* Large ring */}
      <motion.div
        className="fixed z-[9998] pointer-events-none rounded-full border border-primary/30 mix-blend-difference transition-all duration-200"
        style={{
          left: trail.x - (isHovering ? 20 : 14),
          top: trail.y - (isHovering ? 20 : 14),
          width: isHovering ? 40 : 28,
          height: isHovering ? 40 : 28,
          backgroundColor: isHovering ? 'rgba(0,87,255,0.12)' : 'transparent',
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
      />
    </>
  );
}
