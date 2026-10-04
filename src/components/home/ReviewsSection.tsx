'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { BRAND, REVIEWS } from '@/data/innzoyData';
import { enhanceMotion } from '@/lib/motion';
import '@/styles/open-house-closing.css';

export default function ReviewsSection() {
  const manuscript = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const direction = useRef(1);
  const previous = useRef(0);

  const navigate = (change: number) => {
    direction.current = change;
    setActive(index => (index + change + REVIEWS.length) % REVIEWS.length);
  };

  useEffect(() => {
    const element = manuscript.current;
    if (!element) return;
    if (previous.current === active) return;
    previous.current = active;
    const quote = element.querySelector('[data-review-active="true"] [data-review-quote]');
    const attribution = element.querySelector('[data-review-active="true"] figcaption');
    if (!quote || !attribution) return;
    return enhanceMotion(element, ({ gsap }) => {
      const forward = direction.current > 0;
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(quote, { y: forward ? 12 : -12, clipPath: forward ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)' }, {
          y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: .42, clearProps: 'transform,clipPath',
        }, 0)
        .fromTo(attribution, { x: forward ? 6 : -6 }, { x: 0, duration: .28, clearProps: 'transform' }, .06);
    });
  }, [active]);

  return (
    <section ref={manuscript} className="oh-correspondence" aria-labelledby="oh-correspondence-heading">
      <div className="oh-closing-shell oh-correspondence-layout">
        <header className="oh-correspondence-margin">
          <h2 id="oh-correspondence-heading">What our guests say.</h2>
          <dl className="oh-correspondence-stats">
            {BRAND.stats.map(stat => (
              <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>
            ))}
          </dl>
        </header>

        <div className="oh-correspondence-manuscript">
          <div id="atlas-guest-correspondence" className="oh-correspondence-stage" aria-live="polite" aria-atomic="true">
            {REVIEWS.map((review, index) => (
              <figure
                className={`oh-correspondence-entry${active === index ? ' is-active' : ''}`}
                key={review.name}
                aria-labelledby={`atlas-guest-title-${index}`}
                aria-hidden={active !== index}
                inert={active !== index}
                data-review-active={active === index}
              >
                <div className="oh-correspondence-letter">
                  <h3 id={`atlas-guest-title-${index}`}>{review.title}</h3>
                  <div className="oh-correspondence-mask"><blockquote data-review-quote>{review.text}</blockquote></div>
                </div>
                <figcaption>
                  <span>{review.name}</span>
                  <span className="oh-correspondence-rating"><span aria-hidden="true">{review.rating} / 5</span><span className="sr-only">{review.rating} out of 5</span></span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="oh-correspondence-controls" onKeyDown={event => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault();
              navigate(event.key === 'ArrowLeft' ? -1 : 1);
            }
          }}>
            <span className="oh-correspondence-counter" aria-label={`Review ${active + 1} of ${REVIEWS.length}`}>{String(active + 1).padStart(2, '0')} / {String(REVIEWS.length).padStart(2, '0')}</span>
            <div role="group" aria-label="Browse guest reviews" aria-describedby="atlas-review-navigation-hint">
              <button type="button" onClick={() => navigate(-1)} aria-label="Previous guest review" aria-controls="atlas-guest-correspondence"><ArrowLeft size={15} aria-hidden="true" /><span>Previous</span></button>
              <button type="button" onClick={() => navigate(1)} aria-label="Next guest review" aria-controls="atlas-guest-correspondence"><span>Next</span><ArrowRight size={15} aria-hidden="true" /></button>
            </div>
            <span id="atlas-review-navigation-hint" className="sr-only">Use the previous and next buttons, or the left and right arrow keys while a review control is focused.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
