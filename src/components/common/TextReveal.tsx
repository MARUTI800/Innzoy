'use client';

import React, { useRef, useEffect, useState } from 'react';

interface TextRevealProps {
  lines: string[];
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  className?: string;
  lineClassName?: string;
  delay?: number; // base delay in ms
  stagger?: number; // stagger between lines in ms
  threshold?: number;
}

export default function TextReveal({
  lines,
  as: Component = 'h2',
  className = '',
  lineClassName = '',
  delay = 100,
  stagger = 140,
  threshold = 0.2,
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Component ref={containerRef as any} className={className}>
      {lines.map((line, idx) => (
        <span key={idx} className="block overflow-hidden py-0.5">
          <span
            className={`block transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${lineClassName}`}
            style={{
              transform: isInView ? 'translate3d(0, 0, 0)' : 'translate3d(0, 108%, 0)',
              transitionDelay: `${delay + idx * stagger}ms`,
              willChange: 'transform',
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </Component>
  );
}
