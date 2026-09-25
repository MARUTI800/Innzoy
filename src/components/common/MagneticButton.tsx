'use client';

import React, { useRef, useState, useEffect } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  strength?: number; // max movement in pixels, e.g. 6px
  as?: 'button' | 'div';
  [key: string]: any;
}

export default function MagneticButton({
  children,
  className = '',
  onClick,
  strength = 6,
  as: Component = 'button',
  ...rest
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    setIsTouch(
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouch || !buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = (clientX - centerX) / (width / 2);
    const deltaY = (clientY - centerY) / (height / 2);

    setPosition({
      x: Math.max(-strength, Math.min(strength, deltaX * strength)),
      y: Math.max(-strength, Math.min(strength, deltaY * strength)),
    });
  };

  const handleMouseEnter = () => {
    if (isTouch) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Component
      ref={buttonRef as any}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-block ${className}`}
      style={{
        transform: !isTouch
          ? `translate3d(${position.x}px, ${position.y}px, 0)`
          : 'none',
        transition: isHovered
          ? 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)'
          : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}
