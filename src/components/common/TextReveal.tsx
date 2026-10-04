'use client';

import { useEffect, useRef } from 'react';
import { enhanceMotion, MOTION } from '@/lib/motion';

interface TextRevealProps {
  lines: string[];
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  threshold?: number;
}

export default function TextReveal({
  lines, as: Component = 'h2', className = '', lineClassName = '', delay = 100, stagger = 120, threshold = 0.2,
}: TextRevealProps) {
  const ref = useRef<HTMLHeadingElement & HTMLDivElement>(null);
  const textKey = JSON.stringify(lines);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    return enhanceMotion(element, ({ gsap }) => {
      const mobile = window.matchMedia('(max-width: 767px)').matches;
      gsap.fromTo(element.querySelectorAll('[data-reveal-line]'), { yPercent: 110 }, {
        yPercent: 0, duration: mobile ? 0.65 : MOTION.entrance + 0.15, ease: MOTION.revealEase,
        delay: Math.max(0, delay / 1000), stagger: Math.max(0, stagger / 1000) * (mobile ? 0.75 : 1),
        immediateRender: false, clearProps: 'transform',
        scrollTrigger: { trigger: element, start: 'top ' + Math.round((1 - Math.max(0.08, Math.min(0.6, threshold))) * 100) + '%', once: true },
      });
    });
  }, [textKey, delay, stagger, threshold]);
  return <Component ref={ref} className={className}>
    <span className="sr-only">{lines.join(' ')}</span>
    {lines.map((line, index) => <span key={index + '-' + line} className="block overflow-hidden py-0.5" aria-hidden="true">
      <span data-reveal-line className={'block ' + lineClassName}>{line}</span>
    </span>)}
  </Component>;
}
