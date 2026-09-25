'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image, { ImageProps } from 'next/image';

type RevealType = 'curtain-v' | 'curtain-h' | 'center' | 'crop';

interface EditorialImageProps extends Omit<ImageProps, 'className'> {
  revealType?: RevealType;
  containerClassName?: string;
  imageClassName?: string;
  delay?: number;
  threshold?: number;
}

export default function EditorialImage({
  revealType = 'curtain-v',
  containerClassName = '',
  imageClassName = '',
  delay = 100,
  threshold = 0.15,
  alt,
  ...imageProps
}: EditorialImageProps) {
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
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const getClipPath = () => {
    if (isInView) return 'inset(0% 0% 0% 0%)';
    switch (revealType) {
      case 'curtain-v':
        return 'inset(100% 0% 0% 0%)';
      case 'curtain-h':
        return 'inset(0% 100% 0% 0%)';
      case 'center':
        return 'inset(15% 15% 15% 15%)';
      case 'crop':
      default:
        return 'inset(12% 0% 12% 0%)';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${containerClassName}`}
      style={{
        clipPath: getClipPath(),
        transition: `clip-path 1200ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'clip-path',
      }}
    >
      <div
        className="w-full h-full relative"
        style={{
          transform: isInView ? 'scale(1)' : 'scale(1.08)',
          transition: `transform 1400ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          willChange: 'transform',
        }}
      >
        <Image
          alt={alt}
          className={`object-cover ${imageClassName}`}
          {...imageProps}
        />
      </div>
    </div>
  );
}
