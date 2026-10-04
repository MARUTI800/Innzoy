'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { gsap } from 'gsap';
import Link from 'next/link';
import Image from 'next/image';
import HotelJourneyLink from './HotelJourneyLink';
import { usePathname, useSearchParams } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { BookingTrigger } from '@/components/booking/BookingProvider';
import { BRAND, PROPERTIES } from '@/data/innzoyData';
import { loadMotion } from '@/lib/motion';

const NAV_LINKS = [
  { href: '/stays?category=hotel', label: 'Hotels', category: 'hotel' },
  { href: '/stays?category=guesthouse', label: 'Guest houses', category: 'guesthouse' },
  { href: '/about', label: 'About', category: null },
  { href: '/contact', label: 'Contact', category: null },
];

function Navigation({ category }: { category: string | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const isOpen = useRef(false);
  const overflow = useRef<{ body: string; html: string } | null>(null);
  const closingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const afterClose = useRef<(() => void) | null>(null);

  const finishClose = useCallback(() => {
    timeline.current?.kill();
    timeline.current = null;
    if (closingTimer.current) clearTimeout(closingTimer.current);
    closingTimer.current = null;
    dialog.current?.close();
    if (dialog.current) {
      dialog.current.style.removeProperty('opacity');
      dialog.current.style.removeProperty('transform');
      dialog.current.querySelectorAll<HTMLElement>('[data-nav-reveal], [data-nav-secondary]').forEach(item => {
        item.style.removeProperty('transform');
        item.style.removeProperty('opacity');
      });
    }
    if (overflow.current) {
      document.body.style.overflow = overflow.current.body;
      document.documentElement.style.overflow = overflow.current.html;
      overflow.current = null;
    }
    isOpen.current = false;
    setMenuOpen(false);
    setMenuClosing(false);
    const callback = afterClose.current;
    afterClose.current = null;
    callback?.();
  }, []);

  const closeMenu = useCallback((immediate = false, restoreFocus = true) => {
    if (!dialog.current?.open) return;
    isOpen.current = false;
    setMenuClosing(true);
    afterClose.current = restoreFocus ? () => menuButton.current?.focus({ preventScroll: true }) : null;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (immediate || reduced || !timeline.current) finishClose();
    else {
      timeline.current.eventCallback('onReverseComplete', finishClose);
      timeline.current.timeScale(1.6).reverse();
      closingTimer.current = setTimeout(finishClose, 700);
    }
  }, [finishClose]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { closeMenu(true, false); }, [pathname, category, closeMenu]);

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)');
    const onResize = () => { if (wide.matches) closeMenu(true); };
    wide.addEventListener('change', onResize);
    return () => wide.removeEventListener('change', onResize);
  }, [closeMenu]);

  useEffect(() => {
    if (!menuOpen) return;
    const element = dialog.current;
    if (!element) return;
    let active = true;
    isOpen.current = true;
    overflow.current = { body: document.body.style.overflow, html: document.documentElement.style.overflow };
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reduced = preference.matches;
    // Keep navigation usable while its optional motion chunk is loading.
    element.style.opacity = '1';
    element.showModal();
    if (!reduced) {
      loadMotion().then(({ gsap: motion }) => {
        if (!active || !isOpen.current || !element.open || preference.matches) return;
        timeline.current = motion.timeline({ defaults: { ease: 'power3.out' } })
          .fromTo(element, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 })
          .fromTo(element.querySelectorAll('[data-nav-reveal]'), { yPercent: 105 }, { yPercent: 0, duration: 0.5, stagger: 0.065 }, 0.07)
          .fromTo(element.querySelectorAll('[data-nav-secondary]'), { opacity: 0, y: 9 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.06 }, 0.38);
      }).catch(() => { if (active && element.open) element.style.opacity = '1'; });
    }
    const onPreferenceChange = () => {
      if (!preference.matches) return;
      timeline.current?.kill();
      timeline.current = null;
      element.style.opacity = '1';
      element.style.transform = 'none';
      element.querySelectorAll<HTMLElement>('[data-nav-reveal], [data-nav-secondary]').forEach(item => {
        item.style.removeProperty('transform');
        item.style.removeProperty('opacity');
      });
      if (!isOpen.current) finishClose();
    };
    preference.addEventListener('change', onPreferenceChange);
    return () => {
      active = false;
      preference.removeEventListener('change', onPreferenceChange);
      timeline.current?.kill();
      timeline.current = null;
      if (closingTimer.current) clearTimeout(closingTimer.current);
      closingTimer.current = null;
      if (element.open) element.close();
      if (overflow.current) {
        document.body.style.overflow = overflow.current.body;
        document.documentElement.style.overflow = overflow.current.html;
        overflow.current = null;
      }
    };
  }, [menuOpen, finishClose]);

  const detail = pathname?.startsWith('/stays/') ? PROPERTIES.find(property => `/stays/${property.slug}` === pathname) : undefined;
  const activeCategory = detail?.category ?? category;
  const isHero = pathname === '/' && !scrolled;
  const activeLink = (link: typeof NAV_LINKS[number]) => link.category
    ? (pathname === '/stays' || Boolean(detail)) && activeCategory === link.category
    : pathname === link.href;

  return <>
    <header className={`inn-nav${scrolled ? ' is-solid' : ''}${isHero ? ' is-hero' : ''}`}>
      <div className="inn-nav-utility"><div className="inn-nav-utility-inner"><span>{BRAND.subname}</span><a href={`tel:${BRAND.contact.phone.replace(/\s/g, '')}`}>{BRAND.contact.phone}</a><a href={`mailto:${BRAND.contact.email}`}>{BRAND.contact.email}</a></div></div>
      <nav className="inn-nav-inner" aria-label="Main navigation">
        <Link href="/" className="inn-nav-brand" aria-label="Innzoy home"><Image className="inn-company-logo" src="/images/innzoy-logo.png" width={222} height={186} alt="Innzoy" unoptimized /><small>Hyderabad, India</small></Link>
        <div className="inn-nav-links">{NAV_LINKS.map(link => <HotelJourneyLink key={link.href} href={link.href}
          className={`inn-nav-link${activeLink(link) ? ' nav-active' : ''}`} aria-current={activeLink(link) ? 'page' : undefined}>{link.label}</HotelJourneyLink>)}</div>
        <div className="inn-nav-actions">
          {detail?.bookingUrl ? <a className="inn-nav-book" href={detail.bookingUrl} target="_blank" rel="noopener noreferrer">BOOK <span aria-hidden="true">↗</span></a> : <BookingTrigger propertyId={detail?.category === 'hotel' ? detail.id : undefined} className="inn-nav-book">BOOK <span aria-hidden="true">↗</span></BookingTrigger>}
          <button ref={menuButton} type="button" className={`inn-nav-menu-button${menuOpen && !menuClosing ? ' is-open' : ''}`}
            aria-label="Open navigation menu" aria-haspopup="dialog" aria-controls="inn-navigation-menu" aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}>Menu</button>
        </div>
      </nav>
    </header>

    <dialog ref={dialog} id="inn-navigation-menu" className={`inn-menu${menuClosing ? ' is-closing' : ''}`}
      aria-labelledby="inn-menu-title" data-lenis-prevent onCancel={event => { event.preventDefault(); closeMenu(); }}>
      <div className="inn-menu-inner">
        <div className="inn-menu-header"><Link href="/" className="inn-nav-brand" aria-label="Innzoy home" onClick={() => closeMenu(true, false)}><Image className="inn-company-logo" src="/images/innzoy-logo.png" width={222} height={186} alt="Innzoy" unoptimized /><small>Hyderabad, India</small></Link>
          <button type="button" className={`inn-menu-close${menuOpen && !menuClosing ? ' is-open' : ''}`} autoFocus aria-label="Close navigation menu" onClick={() => closeMenu()}>Close <span aria-hidden="true">×</span></button></div>
        <div className="inn-menu-body">
          <p className="inn-menu-label" id="inn-menu-title" data-nav-secondary>Find your place / Hyderabad</p>
          <nav aria-label="Mobile navigation"><ol className="inn-menu-links">{NAV_LINKS.map((link, index) => <li key={link.href}>
            <HotelJourneyLink href={link.href} onClick={() => closeMenu(true, false)} className={activeLink(link) ? 'nav-active' : ''} aria-current={activeLink(link) ? 'page' : undefined}>
              <small>0{index + 1}</small><span className="inn-menu-link-mask"><span data-nav-reveal>{link.label}</span></span><ArrowUpRight size={30} strokeWidth={1.2} aria-hidden="true" />
            </HotelJourneyLink>
          </li>)}</ol></nav>
          <div className="inn-menu-secondary" data-nav-secondary>
            {detail?.bookingUrl ? <a className="inn-menu-book" href={detail.bookingUrl} target="_blank" rel="noopener noreferrer" onClick={() => closeMenu(true, false)}>Book your stay</a> : <BookingTrigger propertyId={detail?.category === 'hotel' ? detail.id : undefined} className="inn-menu-book" onClick={() => closeMenu(true, false)}>Book your stay</BookingTrigger>}
            <a href={`tel:${BRAND.contact.phone.replace(/\s/g, '')}`}>{BRAND.contact.phone}</a>
          </div>
          <a className="inn-menu-instagram" href={BRAND.contact.instagram} target="_blank" rel="noopener noreferrer" data-nav-secondary>Instagram · innzoy_hotels<ArrowUpRight size={12} aria-hidden="true" /></a>
          <figure className="inn-menu-photo" data-nav-secondary><Image src={PROPERTIES[1].heroImage} alt="A room at Innzoy DLF Road" fill sizes="100vw" /><figcaption>Innzoy DLF Road / Gachibowli</figcaption></figure>
        </div>
      </div>
    </dialog>
  </>;
}

function QueriedNavigation() {
  const search = useSearchParams();
  return <Navigation category={search.get('category')} />;
}

export default function Navbar() {
  return <Suspense fallback={<Navigation category={null} />}><QueriedNavigation /></Suspense>;
}
