import { gsap } from 'gsap';

export function initCustomCursor() {
  // Only desktop — skip touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.querySelector('#customCursor');
  const cursorLabel = document.querySelector('#cursorLabel');
  if (!cursor || !cursorLabel) return;

  // GSAP quickTo for smooth trailing inertia
  const xTo = gsap.quickTo(cursor, 'left', { duration: 0.28, ease: 'power3.out' });
  const yTo = gsap.quickTo(cursor, 'top', { duration: 0.28, ease: 'power3.out' });

  window.addEventListener('mousemove', (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  });

  // Track active state to prevent flicker from child elements
  let activeTarget = null;

  document.addEventListener('mouseover', (e) => {
    // Check for explicit data-cursor elements first
    const cursorTarget = e.target.closest('[data-cursor]');
    if (cursorTarget) {
      activeTarget = cursorTarget;
      const label = cursorTarget.getAttribute('data-cursor') || 'VIEW';
      cursorLabel.textContent = label;
      cursor.classList.add('cursor-active');
      return;
    }

    // Check for clickable elements
    const clickable = e.target.closest('a, button, .directory-row, .materiality-interactive-item, .horizontal-panel');
    if (clickable) {
      activeTarget = clickable;
      cursorLabel.textContent = clickable.getAttribute('data-cursor') || 'VIEW';
      cursor.classList.add('cursor-active');
      return;
    }

    // Only deactivate if we've truly left the active target
    if (activeTarget && !activeTarget.contains(e.target)) {
      activeTarget = null;
      cursor.classList.remove('cursor-active');
    }
  });

  document.addEventListener('mouseout', (e) => {
    // Only deactivate when leaving the document entirely
    if (!e.relatedTarget || e.relatedTarget.nodeName === 'HTML') {
      activeTarget = null;
      cursor.classList.remove('cursor-active');
    }

    // Deactivate when leaving the active target's boundary
    if (activeTarget && !activeTarget.contains(e.relatedTarget)) {
      activeTarget = null;
      cursor.classList.remove('cursor-active');
    }
  });
}
