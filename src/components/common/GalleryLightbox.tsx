'use client';

import { createContext, useContext, useState, useLayoutEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { enhanceMotion, loadMotion, MOTION, type GsapRuntime } from '@/lib/motion';
import '@/styles/gallery-atlas.css';
import '@/styles/gallery-transition.css';
import '@/styles/open-house-gallery.css';

interface LightboxItem {
  src: string;
  alt: string;
  caption?: string;
  location?: string;
}

interface GalleryContextType {
  openGallery: (items: LightboxItem[], startIndex?: number) => void;
  closeGallery: () => void;
}

interface GalleryOrigin {
  trigger: HTMLElement;
  gallery: HTMLElement | null;
  rect: DOMRect;
  source: string;
  preview: string;
  aspect: number;
}

interface GalleryPhotoSnapshot {
  source: string;
  preview: string;
}

type GalleryAnimation = gsap.core.Tween | gsap.core.Timeline;
type MotionContext = ReturnType<GsapRuntime['context']>;
const GalleryContext = createContext<GalleryContextType | null>(null);

/** Crop a uniformly scaled image frame to the original thumbnail's dimensions. */
function thumbnailGeometry(stage: DOMRect, thumbnail: DOMRect, aspect: number) {
  const imageWidth = Math.min(stage.width, stage.height * aspect);
  const imageHeight = imageWidth / aspect;
  const scale = Math.max(thumbnail.width / imageWidth, thumbnail.height / imageHeight);
  const horizontalCrop = Math.max(0, (stage.width - thumbnail.width / scale) / 2);
  const verticalCrop = Math.max(0, (stage.height - thumbnail.height / scale) / 2);
  return {
    x: thumbnail.left + thumbnail.width / 2 - stage.left - stage.width / 2,
    y: thumbnail.top + thumbnail.height / 2 - stage.top - stage.height / 2,
    scale,
    clipPath: `inset(${verticalCrop}px ${horizontalCrop}px ${verticalCrop}px ${horizontalCrop}px)`,
  };
}

function captureOrigin(source: string): GalleryOrigin | null {
  const focused = document.activeElement;
  if (!(focused instanceof HTMLElement)) return null;
  const trigger = focused.closest<HTMLElement>('button, a, [role="button"]') ?? focused;
  const image = trigger.querySelector('img');
  if (!image?.naturalWidth || !image.naturalHeight) return null;
  const rect = image.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  return {
    trigger,
    gallery: trigger.closest<HTMLElement>('.gallery-grid'),
    rect,
    source,
    preview: image.currentSrc || image.src,
    aspect: image.naturalWidth / image.naturalHeight,
  };
}

function returnThumbnail(origin: GalleryOrigin | null, source: string) {
  if (!origin) return null;
  const images = origin.gallery?.isConnected ? [...origin.gallery.querySelectorAll('button img')] : [];
  const matchingImage = images.find((image) => {
    const src = image.getAttribute('src');
    if (!src) return false;
    try { return (new URL(src, window.location.href).searchParams.get('url') ?? src) === source; }
    catch { return false; }
  });
  const trigger = matchingImage?.closest<HTMLElement>('button') ?? (source === origin.source ? origin.trigger : null);
  if (!trigger?.isConnected) return null;
  const rect = (matchingImage ?? trigger.querySelector('img') ?? trigger).getBoundingClientRect();
  const visible = rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
  return visible ? rect : null;
}

export function useGallery() {
  const context = useContext(GalleryContext);
  if (!context) throw new Error('useGallery must be used within a GalleryProvider');
  return context;
}

export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<LightboxItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const [outgoingPhoto, setOutgoingPhoto] = useState<GalleryPhotoSnapshot | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const incomingRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const originRef = useRef<GalleryOrigin | null>(null);
  const currentSourceRef = useRef<string | null>(null);
  const previousSourceRef = useRef<string | null>(null);
  const displayedPhotoRef = useRef<GalleryPhotoSnapshot | null>(null);
  const currentIndexRef = useRef(0);
  const directionRef = useRef(1);
  const wipeCleanupRef = useRef<(() => void) | null>(null);
  const animationRef = useRef<GalleryAnimation | null>(null);
  const exitContextRef = useRef<MotionContext | null>(null);
  const settleEntranceRef = useRef<(() => void) | null>(null);
  const cancelExitRef = useRef<(() => void) | null>(null);
  const isClosingRef = useRef(false);
  const sessionRef = useRef(0);
  const imageSessionRef = useRef(0);
  const touchStartRef = useRef<number | null>(null);
  const currentItem = items[currentIndex];
  currentSourceRef.current = currentItem?.src ?? null;
  currentIndexRef.current = currentIndex;

  const openGallery = useCallback((galleryItems: LightboxItem[], startIndex = 0) => {
    if (!galleryItems.length) return;
    const index = Math.max(0, Math.min(galleryItems.length - 1, Number.isFinite(startIndex) ? Math.floor(startIndex) : 0));
    sessionRef.current += 1;
    imageSessionRef.current += 1;
    animationRef.current?.kill();
    wipeCleanupRef.current?.();
    cancelExitRef.current?.();
    exitContextRef.current?.revert();
    exitContextRef.current = null;
    isClosingRef.current = false;
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    originRef.current = captureOrigin(galleryItems[index].src);
    displayedPhotoRef.current = originRef.current ? { source: galleryItems[index].src, preview: originRef.current.preview } : null;
    currentIndexRef.current = index;
    previousSourceRef.current = galleryItems[index].src;
    setOutgoingPhoto(null);
    setLoadedSource(null);
    setFailedSource(null);
    setItems(galleryItems);
    setCurrentIndex(index);
    setIsOpen(true);
  }, []);

  const closeGallery = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog?.open || isClosingRef.current) return;
    isClosingRef.current = true;
    const session = ++sessionRef.current;
    imageSessionRef.current += 1;
    animationRef.current?.kill();
    wipeCleanupRef.current?.();
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let closeDeadline: ReturnType<typeof setTimeout> | undefined;
    const isCurrent = () => sessionRef.current === session && dialogRef.current === dialog && dialog.isConnected;
    const finish = () => {
      if (!isCurrent()) return;
      if (closeDeadline !== undefined) clearTimeout(closeDeadline);
      animationRef.current?.kill();
      cancelExitRef.current?.();
      dialog.close();
      setIsOpen(false);
      setItems([]);
    };
    const reduced = () => { if (preference.matches) { animationRef.current?.kill(); finish(); } };
    preference.addEventListener('change', reduced);
    cancelExitRef.current = () => {
      preference.removeEventListener('change', reduced);
      if (closeDeadline !== undefined) clearTimeout(closeDeadline);
    };
    if (preference.matches) { finish(); return; }
    closeDeadline = setTimeout(finish, 1000);

    void loadMotion().then(({ gsap }) => {
      if (!isCurrent() || !dialog.open) return;
      if (preference.matches) { finish(); return; }
      const frame = frameRef.current;
      const stage = stageRef.current;
      const photo = frame?.querySelector<HTMLImageElement>('[data-gallery-current-photo]');
      const thumbnail = returnThumbnail(originRef.current, currentSourceRef.current ?? '');
      exitContextRef.current = gsap.context(() => {
        const timeline = gsap.timeline({ onComplete: finish });
        animationRef.current = timeline;
        timeline.to(dialog.querySelectorAll('[data-gallery-metadata]'), { opacity: 0, y: 5, duration: .16 }, 0);
        if (frame && stage && photo && photo.naturalWidth > 0 && photo.naturalHeight > 0 && thumbnail) {
          timeline.to(frame, {
            ...thumbnailGeometry(stage.getBoundingClientRect(), thumbnail, photo.naturalWidth / photo.naturalHeight),
            duration: .48, ease: 'power3.inOut',
          }, 0).to(dialog, { '--gallery-backdrop-alpha': 0, duration: .4, ease: 'power2.in' }, .08);
        } else {
          timeline.to(dialog, { opacity: 0, duration: .24, ease: 'power2.in' }, 0);
        }
      }, dialog);
    }).catch(finish);
  }, []);

  const changeImage = useCallback((index: number, direction: number) => {
    if (isClosingRef.current || index < 0 || index >= items.length || index === currentIndexRef.current) return;
    const photo = incomingRef.current?.querySelector<HTMLImageElement>('[data-gallery-current-photo]');
    const snapshot = photo?.complete && photo.naturalWidth > 0 && currentSourceRef.current
      ? { source: currentSourceRef.current, preview: photo.currentSrc || photo.src }
      : displayedPhotoRef.current;
    animationRef.current?.kill();
    wipeCleanupRef.current?.();
    settleEntranceRef.current?.();
    directionRef.current = direction < 0 ? -1 : 1;
    setOutgoingPhoto(snapshot?.source !== items[index].src ? snapshot : null);
    setLoadedSource(null);
    setFailedSource(null);
    imageSessionRef.current += 1;
    currentIndexRef.current = index;
    setCurrentIndex(index);
  }, [items]);

  const nextImage = useCallback(() => {
    if (items.length > 1) changeImage((currentIndexRef.current + 1) % items.length, 1);
  }, [changeImage, items.length]);
  const prevImage = useCallback(() => {
    if (items.length > 1) changeImage((currentIndexRef.current - 1 + items.length) % items.length, -1);
  }, [changeImage, items.length]);
  const selectImage = useCallback((index: number) => {
    changeImage(index, index < currentIndexRef.current ? -1 : 1);
  }, [changeImage]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    const frame = frameRef.current;
    const stage = stageRef.current;
    if (!dialog || !frame || !stage) return;
    const session = sessionRef.current;
    const previousOverflow = document.body.style.overflow;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const metadata = dialog.querySelectorAll<HTMLElement>('[data-gallery-metadata]');
    const origin = originRef.current;
    let entranceStarted = preference.matches;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
    const clearTimer = () => { if (fallbackTimer !== undefined) clearTimeout(fallbackTimer); };
    const settle = () => {
      entranceStarted = true;
      clearTimer();
      frame.style.removeProperty('transform');
      frame.style.removeProperty('clip-path');
      dialog.style.setProperty('--gallery-backdrop-alpha', '1');
      metadata.forEach((element) => { element.style.removeProperty('opacity'); element.style.removeProperty('transform'); });
    };
    settleEntranceRef.current = settle;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });

    // The already cached thumbnail paints this same frame until the larger image arrives.
    if (origin) frame.style.backgroundImage = `url(${JSON.stringify(origin.preview)})`;
    if (origin && !preference.matches) {
      const from = thumbnailGeometry(stage.getBoundingClientRect(), origin.rect, origin.aspect);
      frame.style.transform = `translate3d(${from.x}px, ${from.y}px, 0) scale(${from.scale})`;
      frame.style.clipPath = from.clipPath;
      dialog.style.setProperty('--gallery-backdrop-alpha', '.08');
      metadata.forEach((element) => { element.style.opacity = '0'; });
      fallbackTimer = setTimeout(() => {
        if (sessionRef.current === session && !isClosingRef.current) { entranceStarted = true; settle(); }
      }, 900);
    }

    const revertMotion = enhanceMotion(dialog, ({ gsap }) => {
      if (sessionRef.current !== session || isClosingRef.current || entranceStarted) return;
      entranceStarted = true;
      clearTimer();
      const timeline = gsap.timeline();
      animationRef.current = timeline;
      if (origin) {
        timeline.to(frame, { x: 0, y: 0, scale: 1, clipPath: 'inset(0px 0px 0px 0px)', duration: .72, ease: MOTION.revealEase, clearProps: 'transform,clipPath' }, 0)
          .to(dialog, { '--gallery-backdrop-alpha': 1, duration: .48, ease: MOTION.ease }, 0);
      } else {
        timeline.fromTo(dialog, { opacity: 0 }, { opacity: 1, duration: .35, ease: MOTION.ease, clearProps: 'opacity' }, 0);
      }
      timeline.fromTo(metadata, { opacity: 0, y: 8 }, { opacity: 1, y: 0, stagger: .05, duration: .32, ease: MOTION.ease, clearProps: 'opacity,transform' }, origin ? .28 : .1);
    });
    const reduced = () => { if (preference.matches && !isClosingRef.current) { animationRef.current?.kill(); settle(); } };
    preference.addEventListener('change', reduced);

    return () => {
      sessionRef.current += 1;
      clearTimer();
      animationRef.current?.kill();
      wipeCleanupRef.current?.();
      cancelExitRef.current?.();
      exitContextRef.current?.revert();
      exitContextRef.current = null;
      revertMotion();
      preference.removeEventListener('change', reduced);
      settleEntranceRef.current = null;
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (returnFocusRef.current?.isConnected) returnFocusRef.current.focus({ preventScroll: true });
      isClosingRef.current = false;
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen || !currentItem || previousSourceRef.current === currentItem.src || isClosingRef.current) return;
    previousSourceRef.current = currentItem.src;
    animationRef.current?.kill();
    settleEntranceRef.current?.();
    const frame = frameRef.current;
    const incoming = incomingRef.current;
    const image = incoming?.querySelector<HTMLImageElement>('[data-gallery-current-photo]');
    if (!frame || !incoming || !image) return;
    frame.style.removeProperty('background-image');
    const source = currentItem.src;
    const session = sessionRef.current;
    const imageSession = imageSessionRef.current;
    const direction = directionRef.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const captionLines = captionRef.current?.querySelectorAll<HTMLElement>('[data-gallery-caption-line]');
    let disposed = false;
    let started = false;
    let motionStarted = false;
    let completed = false;
    let revertMotion: (() => void) | undefined;
    let deadline: ReturnType<typeof setTimeout> | undefined;
    const isCurrent = () => !disposed && !isClosingRef.current && dialogRef.current?.open
      && sessionRef.current === session && imageSessionRef.current === imageSession && currentSourceRef.current === source;
    const clearStyles = () => {
      incoming.style.removeProperty('clip-path');
      image.style.removeProperty('transform');
      captionLines?.forEach((line) => line.style.removeProperty('transform'));
    };
    const settle = () => {
      if (!isCurrent()) return;
      completed = true;
      if (deadline !== undefined) clearTimeout(deadline);
      clearStyles();
      if (image.naturalWidth > 0) displayedPhotoRef.current = { source, preview: image.currentSrc || image.src };
      setOutgoingPhoto(null);
    };
    // Hold the cached outgoing photograph until the selected image can actually paint.
    if (!preference.matches) incoming.style.clipPath = direction > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)';
    const begin = () => {
      if (!isCurrent() || started || image.naturalWidth === 0) return;
      started = true;
      if (preference.matches) { settle(); return; }
      deadline = setTimeout(settle, 900);
      revertMotion = enhanceMotion(frame, ({ gsap }) => {
        if (!isCurrent() || motionStarted || completed) return;
        motionStarted = true;
        const outgoing = frame.querySelector('.gallery-wipe-outgoing img');
        const timeline = gsap.timeline({ onComplete: settle });
        animationRef.current = timeline;
        timeline.fromTo(incoming, {
          clipPath: direction > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)',
        }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .54, ease: 'power3.inOut', clearProps: 'clipPath' }, 0)
          .fromTo(image, { xPercent: direction * 2 }, { xPercent: 0, duration: .58, ease: MOTION.ease, clearProps: 'transform' }, 0);
        if (outgoing) timeline.to(outgoing, { xPercent: -direction * 1.2, duration: .54, ease: MOTION.ease }, 0);
        if (captionLines?.length) timeline.fromTo(captionLines, { yPercent: direction * 105 }, {
          yPercent: 0, duration: .36, stagger: .035, ease: MOTION.ease, clearProps: 'transform',
        }, .08);
      });
    };
    const reduced = () => {
      if (!preference.matches || !isCurrent()) return;
      animationRef.current?.kill();
      revertMotion?.();
      revertMotion = undefined;
      clearStyles();
      if (image.complete && image.naturalWidth > 0) settle();
    };
    image.addEventListener('load', begin);
    image.addEventListener('error', settle);
    preference.addEventListener('change', reduced);
    const cleanup = () => {
      if (disposed) return;
      disposed = true;
      if (deadline !== undefined) clearTimeout(deadline);
      image.removeEventListener('load', begin);
      image.removeEventListener('error', settle);
      preference.removeEventListener('change', reduced);
      revertMotion?.();
      clearStyles();
      if (wipeCleanupRef.current === cleanup) wipeCleanupRef.current = null;
    };
    wipeCleanupRef.current = cleanup;
    if (image.complete && image.naturalWidth > 0) begin();
    return cleanup;
  }, [currentItem?.src, isOpen]);

  const hasPreview = originRef.current?.source === currentItem?.src && !!originRef.current?.preview;
  const imageSession = imageSessionRef.current;

  return (
    <GalleryContext.Provider value={{ openGallery, closeGallery }}>
      {children}
      {isOpen && currentItem && (
        <dialog
          ref={dialogRef}
          className="gallery-lightbox gallery-lightbox-atlas gallery-lightbox-transition"
          aria-label="Property image gallery"
          aria-modal="true"
          aria-describedby="gallery-keyboard-instructions"
          data-lenis-prevent
          onCancel={(event) => { event.preventDefault(); closeGallery(); }}
          onClick={(event) => { if (event.target === event.currentTarget) closeGallery(); }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') { event.preventDefault(); nextImage(); }
            if (event.key === 'ArrowLeft') { event.preventDefault(); prevImage(); }
          }}
        >
          <p id="gallery-keyboard-instructions" className="sr-only">Use the left and right arrow keys to explore photos, or Escape to close the gallery.</p>
          <div className="gallery-lightbox-header">
            <div className="gallery-lightbox-identity" data-gallery-metadata><span>INNZOY</span><p>Hotels &amp; guest houses <span aria-hidden="true">/</span> Photography</p></div>
            <button ref={closeRef} type="button" onClick={closeGallery} className="gallery-lightbox-close" aria-label="Close fullscreen gallery">
              <span>Close</span><X size={20} aria-hidden="true" />
            </button>
          </div>
          <div className="gallery-lightbox-body">
            <aside className="gallery-lightbox-archive" aria-label="Gallery perspectives" data-gallery-metadata>
              <div className="gallery-lightbox-counter" aria-live="polite"><span>{String(currentIndex + 1).padStart(2, '0')}</span><small>of {String(items.length).padStart(2, '0')}</small></div>
              <div className="gallery-lightbox-contact-strip">{items.map((item, index) => <button type="button" key={`${item.src}-${index}`} onClick={() => selectImage(index)} aria-label={`View perspective ${index + 1}`} aria-pressed={index === currentIndex}>
                <span className="gallery-lightbox-thumbnail"><Image src={item.src} alt="" fill sizes="80px" /></span><span className="gallery-lightbox-thumbnail-number">{String(index + 1).padStart(2, '0')}</span>
              </button>)}</div>
            </aside>
          <div
            ref={stageRef}
            className="gallery-lightbox-image"
            onPointerDown={(event) => { if (event.pointerType === 'touch') touchStartRef.current = event.clientX; }}
            onPointerUp={(event) => {
              if (event.pointerType !== 'touch' || touchStartRef.current === null) return;
              const distance = event.clientX - touchStartRef.current;
              touchStartRef.current = null;
              if (distance < -50) nextImage();
              else if (distance > 50) prevImage();
            }}
            onPointerCancel={() => { touchStartRef.current = null; }}
          >
            {loadedSource !== currentItem.src && failedSource !== currentItem.src && !hasPreview && (
              <div className="gallery-lightbox-loading" role="status"><span>Opening perspective</span></div>
            )}
            <div ref={frameRef} className="gallery-shared-frame" data-gallery-wipe={!!outgoingPhoto}>
              {outgoingPhoto && <div className="gallery-wipe-outgoing" aria-hidden="true"><Image src={outgoingPhoto.preview} alt="" fill unoptimized className="gallery-lightbox-photo" /></div>}
              <div ref={incomingRef} className="gallery-wipe-incoming" data-gallery-ready={loadedSource === currentItem.src || failedSource === currentItem.src}>
              {failedSource === currentItem.src ? (
                <p className="gallery-lightbox-error" role="status">This photo could not be loaded. Try another perspective.</p>
              ) : (
                <Image
                  key={currentItem.src}
                  src={currentItem.src}
                  alt={currentItem.alt || 'Gallery perspective'}
                  fill
                  sizes="(max-width: 760px) 100vw, 85vw"
                  loading="eager"
                  className="gallery-lightbox-photo"
                  data-gallery-current-photo
                  onLoad={(event) => {
                    if (!dialogRef.current?.open || isClosingRef.current || imageSessionRef.current !== imageSession || currentSourceRef.current !== currentItem.src) return;
                    const photo = event.currentTarget;
                    displayedPhotoRef.current = { source: currentItem.src, preview: photo.currentSrc || photo.src };
                    setLoadedSource(currentItem.src);
                    frameRef.current?.style.removeProperty('background-image');
                  }}
                  onError={() => {
                    if (!dialogRef.current?.open || isClosingRef.current || imageSessionRef.current !== imageSession || currentSourceRef.current !== currentItem.src) return;
                    animationRef.current?.kill();
                    wipeCleanupRef.current?.();
                    settleEntranceRef.current?.();
                    frameRef.current?.style.removeProperty('background-image');
                    setOutgoingPhoto(null);
                    setFailedSource(currentItem.src);
                  }}
                />
              )}
              </div>
            </div>
          </div>
          </div>
          <div className="gallery-lightbox-footer" data-gallery-metadata>
            <div ref={captionRef} className="gallery-lightbox-caption"><p><span data-gallery-caption-line>{currentItem.caption}</span></p>{currentItem.location && <span><span data-gallery-caption-line>{currentItem.location} <span aria-hidden="true">/</span> Hyderabad</span></span>}</div>
            {items.length > 1 && (
              <div className="gallery-lightbox-navigation">
                <button type="button" onClick={prevImage} aria-label="Previous perspective"><ChevronLeft size={19} aria-hidden="true" /><span>Previous</span></button>
                <button type="button" onClick={nextImage} aria-label="Next perspective"><span>Next</span><ChevronRight size={19} aria-hidden="true" /></button>
              </div>
            )}
          </div>
        </dialog>
      )}
    </GalleryContext.Provider>
  );
}
