'use client';

import { useEffect, type ReactNode } from 'react';
import type Lenis from 'lenis';
import { attachMagneticInteractions, loadMotion, type MotionRuntime } from '@/lib/motion';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    let lenis: Lenis | undefined;
    let runtime: MotionRuntime | undefined;
    let ticker: ((time: number) => void) | undefined;
    let removeMagnetic: (() => void) | undefined;
    let disposed = false;
    let generation = 0;
    const stop = () => {
      if (ticker && runtime) runtime.gsap.ticker.remove(ticker);
      ticker = undefined;
      lenis?.destroy();
      lenis = undefined;
      removeMagnetic?.();
      removeMagnetic = undefined;
    };
    const update = () => {
      const current = ++generation;
      stop();
      if (reduced.matches || !fine.matches || disposed) return;
      void Promise.all([import('lenis'), loadMotion()]).then(([{ default: LenisConstructor }, loaded]) => {
        if (disposed || current !== generation || reduced.matches || !fine.matches) return;
        runtime = loaded;
        lenis = new LenisConstructor({
          duration: 0.8, easing: (value: number) => 1 - Math.pow(1 - value, 3),
          smoothWheel: true, syncTouch: false, autoRaf: false,
          prevent: (node) => !!node.closest('[data-lenis-prevent], dialog, [role="dialog"]'),
          virtualScroll: () => document.body.style.overflow !== 'hidden' && document.documentElement.style.overflow !== 'hidden',
        });
        const instance = lenis;
        lenis.on('scroll', loaded.ScrollTrigger.update);
        ticker = (time: number) => instance.raf(time * 1000);
        loaded.gsap.ticker.add(ticker);
        removeMagnetic = attachMagneticInteractions(loaded.gsap);
        loaded.ScrollTrigger.refresh();
      }).catch(() => { if (current === generation) stop(); });
    };
    update();
    reduced.addEventListener('change', update);
    fine.addEventListener('change', update);
    return () => {
      disposed = true;
      generation += 1;
      reduced.removeEventListener('change', update);
      fine.removeEventListener('change', update);
      stop();
    };
  }, []);
  return <>{children}</>;
}
