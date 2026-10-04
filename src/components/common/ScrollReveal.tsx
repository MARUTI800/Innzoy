'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { enhanceMotion, scrollReveal, type RevealVariant } from '@/lib/motion';

export default function ScrollReveal({
  children, className = '', variant = 'fade-up', duration = 800, delay = 0, threshold = 0.14,
}: {
  children: ReactNode; className?: string; variant?: RevealVariant;
  duration?: number; delay?: number; threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    return enhanceMotion(element, ({ gsap }) => { scrollReveal(gsap, element, { variant, duration, delay, threshold }); });
  }, [variant, duration, delay, threshold]);
  return <div ref={ref} className={className}>{children}</div>;
}
