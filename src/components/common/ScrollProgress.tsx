'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = window.scrollY / totalScroll;
        setProgress(Math.min(1, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[1.5px] z-50 pointer-events-none bg-transparent"
    >
      <div
        className="h-full bg-[#171715]/40 transition-transform duration-75 ease-out origin-left"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
