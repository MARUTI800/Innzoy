/** Shared lazy motion runtime. Everything remains readable before enhancement. */
export type GsapRuntime = typeof import('gsap')['gsap'];
export type MotionRuntime = { gsap: GsapRuntime; ScrollTrigger: typeof import('gsap/ScrollTrigger')['ScrollTrigger'] };
export type RevealVariant = 'fade-up' | 'clip-up' | 'scale-in' | 'fade-in';
export type ImageRevealType = 'curtain-v' | 'curtain-h' | 'center' | 'crop';

export const MOTION = { ease: 'power3.out', revealEase: 'expo.out', short: 0.32, entrance: 0.8, image: 1.15 } as const;

/** One collection response: crop, name and factual metadata acknowledge selection together. */
export function replaceSelection(gsap: GsapRuntime, options: {
  image: string; name: string; metadata: string; price: string; direction: number; layered?: boolean;
}) {
  const direction = options.direction < 0 ? -1 : 1;
  const timeline = gsap.timeline();
  timeline.fromTo(options.image, {
    clipPath: direction > 0 ? `inset(0% 0% 0% ${options.layered ? 100 : 12}%)` : `inset(0% ${options.layered ? 100 : 12}% 0% 0%)`, xPercent: direction * (options.layered ? 3 : 1.5), scale: options.layered ? 1.035 : 1,
  }, { clipPath: 'inset(0% 0% 0% 0%)', xPercent: 0, scale: 1, duration: options.layered ? .7 : .48, ease: MOTION.revealEase, clearProps: 'clipPath,transform' }, 0)
    .fromTo(options.name, { yPercent: direction * 105 }, { yPercent: 0, duration: .36, ease: MOTION.ease, clearProps: 'transform' }, .02)
    .fromTo(options.metadata, { x: direction * 7 }, { x: 0, duration: .3, ease: MOTION.ease, clearProps: 'transform' }, .02)
    .fromTo(options.price, { y: direction * 5 }, { y: 0, duration: .24, ease: MOTION.ease, clearProps: 'transform' }, .04);
  return timeline;
}
let runtimePromise: Promise<MotionRuntime> | null = null;
export function loadMotion(): Promise<MotionRuntime> {
  if (!runtimePromise) runtimePromise = Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
    .then(([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    }).catch((error: unknown) => { runtimePromise = null; throw error; });
  return runtimePromise;
}
export function prefersReducedMotion() {
  return typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Owns this enhancement's animations/triggers; live preference changes revert it. */
export function enhanceMotion(scope: Element, animate: (runtime: MotionRuntime) => void) {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let context: ReturnType<GsapRuntime['context']> | undefined;
  let disposed = false;
  let generation = 0;
  const update = () => {
    const current = ++generation;
    context?.revert();
    context = undefined;
    if (preference.matches || disposed) return;
    void loadMotion().then((runtime) => {
      if (disposed || current !== generation || preference.matches || !scope.isConnected) return;
      context = runtime.gsap.context(() => {}, scope);
      try { context.add(() => animate(runtime)); }
      catch { context.revert(); context = undefined; }
    }).catch(() => { /* The unenhanced document is already visible and usable. */ });
  };
  update();
  preference.addEventListener('change', update);
  return () => {
    disposed = true;
    generation += 1;
    preference.removeEventListener('change', update);
    context?.revert();
  };
}

const scrollStart = (threshold: number) => `top ${Math.round((1 - Math.min(0.6, Math.max(0.08, threshold))) * 100)}%`;
/** Existing component delay/duration props use milliseconds. Call within gsap.context. */
export function scrollReveal(gsap: GsapRuntime, target: Element, options: {
  variant?: RevealVariant; duration?: number; delay?: number; threshold?: number;
} = {}) {
  const { variant = 'fade-up', duration = 800, delay = 0, threshold = 0.14 } = options;
  const mobile = window.matchMedia('(max-width: 767px)').matches;
  const from: gsap.TweenVars = { opacity: 0 };
  if (variant === 'fade-up') from.y = mobile ? 12 : 22;
  if (variant === 'scale-in') from.scale = 0.985;
  if (variant === 'clip-up') { from.y = 16; from.clipPath = 'inset(0% 0% 16% 0%)'; }
  return gsap.fromTo(target, from, {
    opacity: 1, y: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0%)',
    duration: Math.max(0.3, duration / 1000) * (mobile ? 0.8 : 1), delay: Math.max(0, delay / 1000),
    ease: MOTION.ease, immediateRender: false, clearProps: 'opacity,transform,clipPath',
    scrollTrigger: { trigger: target, start: scrollStart(threshold), once: true },
  });
}
export function revealImage(gsap: GsapRuntime, mask: Element, image: Element, options: {
  revealType?: ImageRevealType; delay?: number; threshold?: number; parallax?: boolean;
} = {}) {
  const { revealType = 'curtain-v', delay = 100, threshold = 0.15, parallax = false } = options;
  const clips: Record<ImageRevealType, string> = {
    'curtain-v': 'inset(24% 0% 0% 0%)', 'curtain-h': 'inset(0% 22% 0% 0%)',
    center: 'inset(9% 9% 9% 9%)', crop: 'inset(10% 0% 10% 0%)',
  };
  const canParallax = parallax && window.matchMedia('(min-width: 900px) and (pointer: fine)').matches;
  const duration = window.matchMedia('(max-width: 767px)').matches ? 0.8 : MOTION.image;
  const timeline = gsap.timeline({ delay: Math.max(0, delay / 1000), scrollTrigger: { trigger: mask, start: scrollStart(threshold), once: true } });
  timeline.fromTo(mask, { clipPath: clips[revealType] }, {
    clipPath: 'inset(0% 0% 0% 0%)', duration, ease: MOTION.revealEase,
    immediateRender: false, clearProps: 'clipPath',
  }, 0).fromTo(image, { scale: 1.08 }, {
    scale: canParallax ? 1.06 : 1, duration: duration + 0.15, ease: MOTION.ease,
    immediateRender: false, ...(canParallax ? {} : { clearProps: 'transform' }),
  }, 0);
  if (canParallax) gsap.fromTo(image, { yPercent: -2.2 }, {
    yPercent: 2.2, ease: 'none', immediateRender: false,
    scrollTrigger: { trigger: mask, start: 'top bottom', end: 'bottom top', scrub: 0.7 },
  });
  return timeline;
}

/** Restrained pointer response; native cursors and keyboard interaction remain. */
export function attachMagneticInteractions(gsap: GsapRuntime) {
  type Magnetic = { element: HTMLElement; box: DOMRect; context: ReturnType<GsapRuntime['context']>; x: ReturnType<GsapRuntime['quickTo']>; y: ReturnType<GsapRuntime['quickTo']> };
  let active: Magnetic | undefined;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reset = () => { active?.context.revert(); active = undefined; };
  const move = (event: PointerEvent) => {
    if (!fine.matches || reduced.matches || event.pointerType !== 'mouse') { reset(); return; }
    const element = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-magnetic]') : null;
    if (!element || element.matches(':disabled, [aria-disabled="true"]')) { reset(); return; }
    if (active?.element !== element) {
      reset();
      const context = gsap.context(() => {}, element);
      context.add(() => {
        active = { element, box: element.getBoundingClientRect(), context,
          x: gsap.quickTo(element, 'x', { duration: 0.35, ease: MOTION.ease }),
          y: gsap.quickTo(element, 'y', { duration: 0.35, ease: MOTION.ease }),
        };
      });
    }
    if (!active) return;
    const { box } = active;
    active.x(Math.max(-7, Math.min(7, (event.clientX - box.left - box.width / 2) * 0.09)));
    active.y(Math.max(-5, Math.min(5, (event.clientY - box.top - box.height / 2) * 0.12)));
  };
  const leave = (event: PointerEvent) => {
    if (!active || (event.relatedTarget instanceof Node && active.element.contains(event.relatedTarget))) return;
    reset();
  };
  document.addEventListener('pointermove', move, { passive: true });
  document.addEventListener('pointerout', leave, { passive: true });
  window.addEventListener('blur', reset);
  window.addEventListener('scroll', reset, { passive: true });
  fine.addEventListener('change', reset);
  reduced.addEventListener('change', reset);
  return () => {
    reset();
    document.removeEventListener('pointermove', move);
    document.removeEventListener('pointerout', leave);
    window.removeEventListener('blur', reset);
    window.removeEventListener('scroll', reset);
    fine.removeEventListener('change', reset);
    reduced.removeEventListener('change', reset);
  };
}
