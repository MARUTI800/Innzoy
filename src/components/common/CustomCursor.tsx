'use client';

import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState('');
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Only on desktop with fine pointer
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isDesktop || prefersReducedMotion) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const targetEl = e.target as HTMLElement | null;
      if (!targetEl) return;

      const cursorEl = targetEl.closest('[data-cursor]') as HTMLElement | null;
      if (cursorEl) {
        const val = cursorEl.getAttribute('data-cursor');
        if (val) {
          setCursorText(val.toUpperCase());
          setIsPointer(false);
          return;
        }
      }

      const interactive = targetEl.closest('a, button, input, select, textarea, [role="button"]');
      if (interactive) {
        setIsPointer(true);
        setCursorText('');
      } else {
        setIsPointer(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    // Animate cursor position with lerp for silky smoothness
    let raf: number;
    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(raf);
    };
  }, [isVisible]);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
        willChange: 'transform',
      }}
      aria-hidden="true"
    >
      <div
        className={`flex items-center justify-center -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FAF9F6] text-[#171715] transition-all duration-200 ease-out ${
          cursorText
            ? 'w-16 h-16'
            : isPointer
            ? 'w-4 h-4 opacity-70'
            : 'w-2 h-2 opacity-100'
        }`}
      >
        {cursorText && (
          <span className="font-mono text-[9px] font-semibold tracking-[0.22em] uppercase select-none text-center px-1">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
}
