'use client';

import { useEffect, useRef } from 'react';
import Image, { type ImageProps } from 'next/image';
import { enhanceMotion, revealImage, type ImageRevealType } from '@/lib/motion';

interface EditorialImageProps extends Omit<ImageProps, 'className'> {
  revealType?: ImageRevealType;
  containerClassName?: string;
  imageClassName?: string;
  delay?: number;
  threshold?: number;
  parallax?: boolean;
  bookingOrigin?: string;
}

export default function EditorialImage({
  revealType = 'curtain-v', containerClassName = '', imageClassName = '', delay = 100,
  threshold = 0.15, parallax = false, bookingOrigin, alt, ...imageProps
}: EditorialImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;
    return enhanceMotion(container, ({ gsap }) => { revealImage(gsap, container, image, { revealType, delay, threshold, parallax }); });
  }, [revealType, delay, threshold, parallax, imageProps.src]);
  return <div ref={containerRef} data-booking-origin={bookingOrigin} className={'relative overflow-hidden ' + containerClassName}>
    <div ref={imageRef} className="w-full h-full relative">
      <Image alt={alt} className={'object-cover ' + imageClassName} {...imageProps} />
    </div>
  </div>;
}
