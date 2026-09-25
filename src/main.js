import './styles/variables.css';
import './styles/base.css';
import './styles/editorial.css';

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { REVIEWS } from './data/properties.js';
import { initNavigation } from './components/navigation.js';
import { initCustomCursor } from './components/cursor.js';
import { initPropertyModal } from './components/propertyModal.js';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ==========================================================================
// 01. SMOOTH SCROLL (LENIS + GSAP TICKER — Single RAF Only)
// ==========================================================================
const lenis = new Lenis({
  duration: prefersReducedMotion ? 0 : 1.1,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: !prefersReducedMotion,
  touchMultiplier: 1.5,
});

// Sync Lenis with GSAP's single ticker — NO separate requestAnimationFrame
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ==========================================================================
// 02. PRELOADER ENTRANCE CHOREOGRAPHY (1.5s total)
// ==========================================================================
function initPreloader() {
  const preloader = document.querySelector('#preloader');
  const numEl = document.querySelector('#preloaderNum');
  const barEl = document.querySelector('#preloaderBar');

  if (!preloader || !numEl || !barEl) return;

  const finishPreloader = () => {
    preloader.style.display = 'none';
    lenis.start();
    ScrollTrigger.refresh();
  };

  if (prefersReducedMotion) {
    numEl.textContent = '100';
    barEl.style.width = '100%';
    finishPreloader();
    return;
  }

  lenis.stop();

  const counter = { val: 0 };
  const tl = gsap.timeline({
    onComplete: () => {
      gsap.to(preloader, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.9,
        ease: 'power4.inOut',
        onComplete: finishPreloader,
      });
    }
  });

  gsap.set(preloader, { clipPath: 'inset(0 0 0% 0)' });

  tl.to(counter, {
    val: 100,
    duration: 1.2,
    ease: 'power2.inOut',
    onUpdate: () => {
      const current = Math.floor(counter.val);
      numEl.textContent = current < 10 ? `0${current}` : `${current}`;
      barEl.style.width = `${current}%`;
    }
  });
}

// ==========================================================================
// 03. SCENE 00: THE MORPHING LENS HERO (240vh Sticky Viewport + GSAP Scrub)
// ==========================================================================
function initHeroScrub() {
  const heroStage = document.querySelector('.hero-stage');
  const heroAperture = document.querySelector('#heroAperture');
  const heroMedia = document.querySelector('#heroMedia');
  const wordLeft = document.querySelector('#heroWordLeft');
  const wordRight = document.querySelector('#heroWordRight');
  const wordCenter = document.querySelector('#heroWordCenter');
  const metaStrip = document.querySelector('#heroMetaStrip') || document.querySelector('.hero-meta-strip');

  if (!heroStage || !heroAperture || !heroMedia) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: heroStage,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.8,
    }
  });

  // 1. Text splits up LEFT and RIGHT and slowly drifts down below the photo:
  if (wordLeft) {
    tl.to(wordLeft, {
      x: '-22vw',
      y: '18vh',
      opacity: 0.1,
      ease: 'power1.inOut',
      duration: 0.9,
    }, 0);
  }

  if (wordRight) {
    tl.to(wordRight, {
      x: '22vw',
      y: '18vh',
      opacity: 0.1,
      ease: 'power1.inOut',
      duration: 0.9,
    }, 0);
  }

  if (wordCenter) {
    tl.to(wordCenter, {
      y: '22vh',
      opacity: 0.1,
      ease: 'power1.inOut',
      duration: 0.85,
    }, 0);
  }

  // 2. Photo comes UP from below and expands into full bleed over the text:
  tl.fromTo(heroAperture, {
    top: '66%',
    yPercent: 0,
    width: '38vw',
    height: '46vh',
    borderRadius: 14,
  }, {
    top: '50%',
    yPercent: -50,
    width: '100vw',
    height: '100vh',
    borderRadius: 0,
    ease: 'power1.inOut',
    duration: 1,
  }, 0);

  // 3. Photo zooms smoothly inside as it expands ("photo zooms and etc"):
  tl.fromTo(heroMedia, {
    scale: 1.05,
  }, {
    scale: 1.2,
    ease: 'none',
    duration: 1,
  }, 0);

  // 4. Meta strip fades out gently
  if (metaStrip) {
    tl.to(metaStrip, {
      opacity: 0,
      y: 16,
      ease: 'none',
      duration: 0.35,
    }, 0.15);
  }
}

// ==========================================================================
// 04. MANIFESTO REVEAL (Subtle parallax on image)
// ==========================================================================
function initManifestoParallax() {
  const img = document.querySelector('#manifestoImg');
  if (!img) return;

  gsap.to(img, {
    yPercent: -12,
    ease: 'none',
    scrollTrigger: {
      trigger: '.manifesto-scene',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    }
  });
}

// ==========================================================================
// 05. HYDERABAD APERTURE PORTAL (260vh Sticky Viewport + Mid-Letter Zoom)
// ==========================================================================
function initHyderabadAperture() {
  const apertureStage = document.querySelector('.aperture-stage');
  const apertureWord = document.querySelector('#apertureWord');
  const apertureTagline = document.querySelector('#apertureTagline');
  const nextWindow = document.querySelector('#apertureNextWindow');
  const windowImg = document.querySelector('#apertureWindowImg');
  const windowCard = document.querySelector('#apertureWindowCard');

  if (!apertureStage || !apertureWord) return;

  // Center transform origin directly on the mid alphabet ('R' at 50% 50%)
  gsap.set(apertureWord, { scale: 1, transformOrigin: '50% 50%', opacity: 1 });
  if (nextWindow) gsap.set(nextWindow, { opacity: 0 });
  if (windowImg) gsap.set(windowImg, { scale: 1.18 });
  if (windowCard) gsap.set(windowCard, { opacity: 0, y: 40 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: apertureStage,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.8,
    }
  });

  // 1. Tagline fades out early as the zoom initiates
  if (apertureTagline) {
    tl.to(apertureTagline, {
      opacity: 0,
      y: 20,
      duration: 0.25,
      ease: 'power1.in',
    }, 0);
  }

  // 2. Zoom deeply into the middle alphabet ('R') of "HYDERABAD"
  // "when I scroll hyderabad it shoud zoom into hyderabad in mid alphabet"
  tl.to(apertureWord, {
    scale: 42,
    ease: 'power2.in',
    duration: 0.8,
  }, 0);

  // 3. As we penetrate through the middle letter (around 42% scrub),
  // reveal the Next Window portal! ("and zoom to the next window ykwim")
  if (nextWindow) {
    tl.fromTo(nextWindow, {
      opacity: 0,
    }, {
      opacity: 1,
      ease: 'power2.out',
      duration: 0.45,
    }, 0.42);
  }

  // 4. Subtle zoom on the revealed window image for cinematic parallax
  if (windowImg) {
    tl.to(windowImg, {
      scale: 1.05,
      ease: 'none',
      duration: 0.6,
    }, 0.4);
  }

  // 5. The Next Window sanctuary card glides smoothly into view
  if (windowCard) {
    tl.to(windowCard, {
      opacity: 1,
      y: 0,
      ease: 'power2.out',
      duration: 0.35,
    }, 0.65);
  }

  // 6. Blown-up word finishes passing out of view
  tl.to(apertureWord, {
    opacity: 0,
    duration: 0.2,
    ease: 'none',
  }, 0.68);
}

// ==========================================================================
// 06. PINNED MONOLITH PROPERTY TAKEOVER (420vh Sticky + Clip-Path Scrub)
// ==========================================================================
function initMonolithsScrub() {
  const monolithsStage = document.querySelector('.monoliths-stage');
  const slides = document.querySelectorAll('.monolith-slide');

  if (!monolithsStage || slides.length < 2) return;

  // Set initial clip-path: first slide fully visible, rest clipped from bottom
  gsap.set(slides[0], { clipPath: 'inset(0% 0% 0% 0%)' });
  for (let i = 1; i < slides.length; i++) {
    gsap.set(slides[i], { clipPath: 'inset(100% 0% 0% 0%)' });
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: monolithsStage,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.8,
    }
  });

  // Each subsequent slide reveals over the previous
  for (let i = 1; i < slides.length; i++) {
    tl.to(slides[i], {
      clipPath: 'inset(0% 0% 0% 0%)',
      ease: 'none',
      duration: 1,
    });
  }
}

// ==========================================================================
// 07. HORIZONTAL ARCHITECTURAL EXHIBITION (380vh Sticky + x Translation Scrub)
// ==========================================================================
function initHorizontalExhibition() {
  const horizontalStage = document.querySelector('.horizontal-stage');
  const track = document.querySelector('#horizontalTrack');

  if (!horizontalStage || !track) return;

  // Calculate how far the track needs to travel
  const getScrollAmount = () => {
    return -(track.scrollWidth - window.innerWidth);
  };

  gsap.to(track, {
    x: getScrollAmount,
    ease: 'none',
    scrollTrigger: {
      trigger: horizontalStage,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
      invalidateOnRefresh: true,
    }
  });
}

// ==========================================================================
// 08. TACTILE MATERIALITY HOVER PREVIEW (Desktop only)
// ==========================================================================
function initTactileHover() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const previewBox = document.querySelector('#tactilePreview');
  const previewImg = document.querySelector('#tactilePreviewImg');
  const items = document.querySelectorAll('.materiality-interactive-item');

  if (!previewBox || !previewImg || items.length === 0) return;

  // Use GSAP quickTo for smooth preview follow
  const prevX = gsap.quickTo(previewBox, 'left', { duration: 0.3, ease: 'power3.out' });
  const prevY = gsap.quickTo(previewBox, 'top', { duration: 0.3, ease: 'power3.out' });

  window.addEventListener('mousemove', (e) => {
    prevX(e.clientX + 20);
    prevY(e.clientY + 20);
  });

  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const src = item.getAttribute('data-preview-img');
      if (src && previewImg.src !== src) {
        previewImg.src = src;
      }
      previewBox.classList.add('visible');
    });

    item.addEventListener('mouseleave', () => {
      previewBox.classList.remove('visible');
    });
  });
}

// ==========================================================================
// 09. MONUMENTAL GUEST VOICES SWITCHER
// ==========================================================================
function initVoices() {
  const quoteEl = document.querySelector('#voiceQuote');
  const authorEl = document.querySelector('#voiceAuthor');
  const stayEl = document.querySelector('#voiceStay');
  const prevBtn = document.querySelector('#voicePrevBtn');
  const nextBtn = document.querySelector('#voiceNextBtn');

  if (!quoteEl || !authorEl || !stayEl || REVIEWS.length === 0) return;

  let currentIndex = 0;
  let transitioning = false;

  function setVoice(index) {
    if (transitioning) return;
    transitioning = true;

    currentIndex = (index + REVIEWS.length) % REVIEWS.length;
    const rev = REVIEWS[currentIndex];

    gsap.to([quoteEl, authorEl, stayEl], {
      opacity: 0,
      y: 12,
      duration: 0.3,
      stagger: 0.04,
      ease: 'power2.in',
      onComplete: () => {
        quoteEl.textContent = `"${rev.quote}"`;
        authorEl.textContent = rev.guest;
        stayEl.textContent = `${rev.stay} · ${rev.verifiedSource}`;

        gsap.fromTo([quoteEl, authorEl, stayEl],
          { opacity: 0, y: -12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: 'power2.out',
            onComplete: () => { transitioning = false; }
          }
        );
      }
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => setVoice(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => setVoice(currentIndex + 1));

  // Auto-advance every 8 seconds
  setInterval(() => {
    if (!transitioning) setVoice(currentIndex + 1);
  }, 8000);
}

// ==========================================================================
// 10. SECTION ENTRANCE REVEALS (Subtle fade-in for editorial sections)
// ==========================================================================
function initSectionReveals() {
  // Manifesto
  const manifesto = document.querySelector('.manifesto-scene');
  if (manifesto) {
    gsap.fromTo(manifesto.querySelector('.manifesto-statement'),
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: manifesto, start: 'top 80%', toggleActions: 'play none none none' }
      }
    );
  }

  // Directory rows stagger
  const dirRows = document.querySelectorAll('.directory-row');
  if (dirRows.length) {
    gsap.fromTo(dirRows,
      { opacity: 0, x: -20 },
      {
        opacity: 1, x: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out',
        scrollTrigger: { trigger: '.directory-scene', start: 'top 75%', toggleActions: 'play none none none' }
      }
    );
  }

  // Materiality items stagger
  const matItems = document.querySelectorAll('.materiality-interactive-item');
  if (matItems.length) {
    gsap.fromTo(matItems,
      { opacity: 0, x: -16 },
      {
        opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: '.materiality-scene', start: 'top 75%', toggleActions: 'play none none none' }
      }
    );
  }

  // Chapter blocks
  const chapterBlocks = document.querySelectorAll('.chapter-monolith-block');
  if (chapterBlocks.length) {
    gsap.fromTo(chapterBlocks,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: '.chapters-scene', start: 'top 78%', toggleActions: 'play none none none' }
      }
    );
  }

  // Destination nodes
  const destNodes = document.querySelectorAll('.destination-node-item');
  if (destNodes.length) {
    gsap.fromTo(destNodes,
      { opacity: 0, x: -16 },
      {
        opacity: 1, x: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out',
        scrollTrigger: { trigger: '.destination-scene', start: 'top 75%', toggleActions: 'play none none none' }
      }
    );
  }

  // Voice quote
  const voiceScene = document.querySelector('.voices-scene');
  if (voiceScene) {
    gsap.fromTo(voiceScene.querySelector('.voice-giant-quote'),
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: voiceScene, start: 'top 78%', toggleActions: 'play none none none' }
      }
    );
  }

  // Departure 
  const departure = document.querySelector('.departure-scene');
  if (departure) {
    gsap.fromTo(departure.querySelector('.departure-title'),
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: departure, start: 'top 80%', toggleActions: 'play none none none' }
      }
    );
  }

  // Footer logo
  const footerLogo = document.querySelector('.colophon-giant-logo');
  if (footerLogo) {
    gsap.fromTo(footerLogo,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: footerLogo, start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  }
}

// ==========================================================================
// 11. INITIALIZE ALL SYSTEMS
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Core systems
  initPreloader();
  initCustomCursor();
  initNavigation(lenis);
  initPropertyModal(lenis);

  // GSAP scroll choreography
  initHeroScrub();
  initManifestoParallax();
  initHyderabadAperture();
  initMonolithsScrub();
  initHorizontalExhibition();

  // Interactive sections
  initTactileHover();
  initVoices();

  // Entrance reveals
  if (!prefersReducedMotion) {
    initSectionReveals();
  }
});

