'use client';

import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      const progress = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
      if (ref.current) ref.current.style.transform = 'scaleX(' + progress + ')';
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const resize = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(schedule);
    resize?.observe(document.body);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    update();
    return () => {
      window.cancelAnimationFrame(frame);
      resize?.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);
  return <div aria-hidden="true" className="fixed top-0 left-0 right-0 h-[1.5px] z-50 pointer-events-none bg-transparent">
    <div ref={ref} className="h-full bg-[#171715]/40 origin-left" style={{ transform: 'scaleX(0)' }} />
  </div>;
}
