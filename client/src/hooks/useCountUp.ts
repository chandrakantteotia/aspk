import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Animated count-up hook.
 * Returns the current display value.
 */
export function useCountUp(
  target: number,
  duration = 2000,
  start = 0,
  shouldStart = true
): number {
  const [count, setCount] = useState(start);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(start + (target - start) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    },
    [target, duration, start]
  );

  useEffect(() => {
    if (!shouldStart) return;
    startTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate, shouldStart]);

  return count;
}
