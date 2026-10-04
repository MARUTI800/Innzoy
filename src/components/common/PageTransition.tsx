'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { enhanceMotion, MOTION } from '@/lib/motion';

/** Entrance only: links, browser history, filter queries, and scrolling remain native. */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const previousPath = useRef(pathname);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const direction = pathname.split('/').length < previousPath.current.split('/').length ? -1 : 1;
    previousPath.current = pathname;
    return enhanceMotion(element, ({ gsap, ScrollTrigger }) => {
      // The home hero owns its choreography, including returns via browser history.
      if (pathname !== '/') gsap.fromTo(element, { x: direction * 8 }, {
        x: 0, duration: .36, ease: MOTION.ease,
        clearProps: 'transform', immediateRender: false,
        onComplete: () => ScrollTrigger.refresh(),
      });
      ScrollTrigger.refresh();
    });
  }, [pathname]);
  return <div ref={ref} className="page-transition">{children}</div>;
}
