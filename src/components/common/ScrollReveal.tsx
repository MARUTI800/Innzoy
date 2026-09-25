'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

type RevealVariant = 'fade-up' | 'clip-up' | 'scale-in' | 'fade-in';

export default function ScrollReveal({
  children,
  className = '',
  variant = 'fade-up',
  duration = 800,
  delay = 0,
  threshold = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: RevealVariant;
  duration?: number;
  delay?: number;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isRevealed) {
          if (delay > 0) {
            setTimeout(() => setIsRevealed(true), delay);
          } else {
            setIsRevealed(true);
          }
        }
      });
    },
    [delay, isRevealed]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin: '0px 0px -60px 0px',
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect, threshold]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'fade-in':
        return {
          opacity: isRevealed ? 1 : 0,
          transform: 'none',
        };
      case 'scale-in':
        return {
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed ? 'scale(1)' : 'scale(0.96)',
        };
      case 'clip-up':
        return {
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed ? 'translateY(0)' : 'translateY(48px)',
        };
      case 'fade-up':
      default:
        return {
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed ? 'translateY(0)' : 'translateY(36px)',
        };
    }
  };

  const { opacity, transform } = getVariantStyles();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity,
        transform,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
