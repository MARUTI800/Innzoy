'use client';

import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { useGallery } from '@/components/common/GalleryLightbox';

interface Props { images: string[]; propertyName: string; region: string; }

export default function InteractiveGalleryGrid({ images, propertyName, region }: Props) {
  const { openGallery } = useGallery();
  const gallery = images.map((src, index) => ({ src, alt: `${propertyName} perspective ${index + 1}`, caption: `Perspective ${String(index + 1).padStart(2, '0')} · ${propertyName}`, location: region }));
  return <div className="gallery-grid open-gallery-sequence">
    {images.map((src, index) => <button key={`${src}-${index}`} type="button" onClick={(event) => { event.currentTarget.focus({ preventScroll: true }); openGallery(gallery, index); }} className={`open-gallery-view open-gallery-view-${index % 3}`} aria-haspopup="dialog" aria-label={`View ${propertyName} perspective ${index + 1} fullscreen`}>
      <span className="open-gallery-image"><Image src={src} alt={`${propertyName} perspective ${index + 1}`} fill sizes="(max-width: 480px) 100vw, (max-width: 760px) 46vw, 31vw" /></span>
      <span className="open-gallery-caption"><span className="open-gallery-number">{String(index + 1).padStart(2, '0')}</span><span>Perspective <small>{propertyName}<br />{region}</small></span><ArrowUpRight size={18} aria-hidden="true" /></span>
    </button>)}
  </div>;
}
