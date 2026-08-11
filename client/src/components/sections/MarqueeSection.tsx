import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { Landmark } from 'lucide-react';

const items = [
  '28 Districts',
  '14,250+ Members',
  '8,900 Grievances Resolved',
  '100% Transparency',
  'People First',
  'Hapur First',
  'Jan Seva 2026',
];

function MarqueeRow() {
  const ref = useRef<HTMLDivElement>(null);
  const doubled = [...items, ...items, ...items, ...items];

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const totalWidth = el.scrollWidth / 2;
    gsap.to(el, {
      x: -totalWidth,
      duration: 40,
      ease: 'none',
      repeat: -1,
    });
    return () => { gsap.killTweensOf(el); };
  }, []);

  return (
    <div className="overflow-hidden h-[80px] flex items-center bg-[#FEF3C7]">
      <div ref={ref} className="flex items-center gap-8" style={{ width: 'max-content' }}>
        {doubled.map((item, i) => (
          <React.Fragment key={`${item}-${i}`}>
            <div className="flex items-center text-dark font-display text-xl font-bold uppercase tracking-wider whitespace-nowrap">
              {item}
            </div>
            <Landmark className="w-5 h-5 text-warning shrink-0" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default function MarqueeSection() {
  return (
    <section className="overflow-hidden border-y border-amber-200">
      <MarqueeRow />
    </section>
  );
}
