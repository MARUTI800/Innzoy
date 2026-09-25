'use client';

import { useEffect, useRef, ReactNode } from 'react';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<any>(null);
  const tickerRef = useRef<any>(null);

  useEffect(() => {
    let isCleanedUp = false;

    const init = async () => {
      const Lenis = (await import('lenis')).default;
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      if (isCleanedUp) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.25,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.5,
      });

      lenisRef.current = lenis;

      // Synchronize Lenis scroll position with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);

      const tickerFn = (time: number) => {
        lenis.raf(time * 1000);
      };
      tickerRef.current = tickerFn;

      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);

      // Trigger initial update once initialized
      ScrollTrigger.refresh();
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      init();
    }

    return () => {
      isCleanedUp = true;
      if (tickerRef.current) {
        import('gsap').then(({ gsap }) => {
          gsap.ticker.remove(tickerRef.current);
        });
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  return <>{children}</>;
}
