type PhotoRect = { left: number; top: number; width: number; height: number };

export type BookingPhotoTransition = {
  propertyId: string;
  src: string;
  objectPosition: string;
  readonly active: boolean;
  enter: (dialog: HTMLDialogElement) => void;
  cancel: () => void;
};

/** Match the arrival's six-vertex architectural mask without changing path topology. */
export function bookingPhotoRectangle(clipPath: string) {
  if (clipPath.startsWith('polygon(') && clipPath.slice(8, -1).split(',').length === 6) {
    return 'polygon(0% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 100%, 0% 100%)';
  }
  if (clipPath.startsWith('inset(')) return 'inset(0% 0% 0% 0%)';
  return 'none';
}

function visibleArea(rect: PhotoRect) {
  return Math.max(0, Math.min(rect.left + rect.width, window.innerWidth) - Math.max(rect.left, 0))
    * Math.max(0, Math.min(rect.top + rect.height, window.innerHeight) - Math.max(rect.top, 0));
}

/** Capture only a loaded, visible photograph belonging to the requested hotel. */
export function captureBookingPhoto(propertyId?: string, trigger?: HTMLElement): BookingPhotoTransition | null {
  if (!propertyId || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  const section = trigger?.closest('section');
  const frames = [...document.querySelectorAll<HTMLElement>('[data-booking-origin]')]
    .filter(frame => frame.dataset.bookingOrigin === propertyId && !frame.closest('dialog'))
    .map(frame => ({ frame, rect: frame.getBoundingClientRect(), image: frame.querySelector<HTMLImageElement>('img'), style: getComputedStyle(frame) }))
    .filter(item => item.image?.complete && item.image.naturalWidth > 0 && item.image.currentSrc
      && item.rect.width >= 44 && item.rect.height >= 44 && visibleArea(item.rect) >= 44 * 44
      && item.style.visibility !== 'hidden' && Number(item.style.opacity) > 0)
    .sort((a, b) => Number(b.frame.closest('section') === section) - Number(a.frame.closest('section') === section) || visibleArea(b.rect) - visibleArea(a.rect));
  const source = frames[0];
  if (!source?.image) return null;

  const imageRect = source.image.getBoundingClientRect();
  const imageStyle = getComputedStyle(source.image);
  const bridge = document.createElement('div');
  bridge.className = 'bk-photo-continuity';
  bridge.setAttribute('aria-hidden', 'true');
  bridge.dataset.bookingPhotoBridge = propertyId;
  Object.assign(bridge.style, { left: `${source.rect.left}px`, top: `${source.rect.top}px`, width: `${source.rect.width}px`, height: `${source.rect.height}px`, clipPath: source.style.clipPath });
  const photograph = document.createElement('img');
  photograph.src = source.image.currentSrc;
  photograph.alt = '';
  photograph.draggable = false;
  Object.assign(photograph.style, { left: `${imageRect.left - source.rect.left}px`, top: `${imageRect.top - source.rect.top}px`, width: `${imageRect.width}px`, height: `${imageRect.height}px`, objectFit: imageStyle.objectFit, objectPosition: imageStyle.objectPosition });
  bridge.append(photograph);
  document.body.append(bridge);

  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let disposed = false;
  let entered = false;
  let destination: HTMLElement | null = null;
  const animations: Animation[] = [];
  let animationFrame = 0;
  const cancel = () => {
    if (disposed) return;
    disposed = true;
    clearTimeout(expiry);
    cancelAnimationFrame(animationFrame);
    animations.forEach(animation => animation.cancel());
    bridge.remove();
    destination?.removeAttribute('data-photo-reframing');
    preference.removeEventListener('change', cancel);
    window.removeEventListener('resize', cancel);
    window.removeEventListener('pointerdown', cancel, true);
    window.removeEventListener('keydown', cancel, true);
    destination?.closest('dialog')?.removeEventListener('scroll', cancel);
  };
  // A failed or slow lazy import must never leave a photograph stranded above the page.
  const expiry = setTimeout(cancel, 2500);
  preference.addEventListener('change', cancel);
  window.addEventListener('resize', cancel);
  window.addEventListener('pointerdown', cancel, true);
  window.addEventListener('keydown', cancel, true);

  return {
    propertyId, src: source.image.currentSrc, objectPosition: imageStyle.objectPosition,
    get active() { return !disposed; },
    cancel,
    enter(dialog) {
      if (disposed || entered || !dialog.open || preference.matches) { if (!entered) cancel(); return; }
      entered = true;
      destination = [...dialog.querySelectorAll<HTMLElement>('[data-booking-photo]')]
        .find(frame => frame.dataset.bookingPhoto === propertyId && frame.getClientRects().length > 0 && visibleArea(frame.getBoundingClientRect()) > 0) ?? null;
      const targetImage = destination?.querySelector<HTMLImageElement>('img');
      if (!destination || !targetImage || typeof bridge.animate !== 'function') { cancel(); return; }
      // Native modal dialogs own the top layer. Reparent the same bridge, never a second clone.
      dialog.append(bridge);
      bridge.style.zIndex = '5';
      destination.dataset.photoReframing = 'true';
      dialog.addEventListener('scroll', cancel, { passive: true });
      animationFrame = requestAnimationFrame(() => {
        if (disposed || !destination?.isConnected || !dialog.open) { cancel(); return; }
        const target = destination.getBoundingClientRect();
        const targetStyle = getComputedStyle(targetImage);
        const timing: KeyframeAnimationOptions = { duration: 560, easing: 'cubic-bezier(.22,.72,.22,1)', fill: 'forwards' };
        try {
          const frameMotion = bridge.animate([
            { left: `${source.rect.left}px`, top: `${source.rect.top}px`, width: `${source.rect.width}px`, height: `${source.rect.height}px`, clipPath: source.style.clipPath },
            { left: `${target.left}px`, top: `${target.top}px`, width: `${target.width}px`, height: `${target.height}px`, clipPath: bookingPhotoRectangle(source.style.clipPath) },
          ], timing);
          animations.push(frameMotion, photograph.animate([
            { left: `${imageRect.left - source.rect.left}px`, top: `${imageRect.top - source.rect.top}px`, width: `${imageRect.width}px`, height: `${imageRect.height}px`, objectPosition: imageStyle.objectPosition },
            { left: '0px', top: '0px', width: `${target.width}px`, height: `${target.height}px`, objectPosition: targetStyle.objectPosition },
          ], timing));
          void frameMotion.finished.then(cancel).catch(() => {});
        } catch { cancel(); }
      });
    },
  };
}
