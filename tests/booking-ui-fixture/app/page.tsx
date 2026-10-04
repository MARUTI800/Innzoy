'use client';

import { useState } from 'react';
import { BookingTrigger } from '@/components/booking/BookingProvider';
import { addBookingDays, bookingLocalNow } from '@/lib/booking';
import HomePage from '@/app/page';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export default function FixturePage() {
  const [status, setStatus] = useState('Synthetic backend ready.');
  const [busy, setBusy] = useState(false);
  const [composition, setComposition] = useState(false);
  const [staticView, setStaticView] = useState(false);
  const [hideImages, setHideImages] = useState(false);
  const [hideBranding, setHideBranding] = useState(false);
  async function mode(action: string) {
    setBusy(true);
    try {
      const response = await fetch('/api/fixture', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }) });
      const data = await response.json();
      setStatus(data.message);
      if (action === 'reset') for (const key of ['innzoy-reservation-draft-v1', 'innzoy-reservation-receipt-v1', 'innzoy-reservation-retry-v1']) sessionStorage.removeItem(key);
    } catch { setStatus('Fixture control failed.'); }
    finally { setBusy(false); }
  }
  const buttonStyle = { padding: '14px 18px', border: '1px solid #181816', background: 'transparent', cursor: 'pointer' };
  return <><main style={{ maxWidth: 1000, margin: '0 auto', padding: '100px 24px 50px', fontFamily: 'var(--font-sans)' }}>
    <p style={{ fontSize: 12, letterSpacing: '.15em', textTransform: 'uppercase' }}>TEST ONLY · NO REAL RESERVATIONS</p>
    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 52, fontWeight: 300, lineHeight: 1.1, margin: '22px 0' }}>Booking test fixture — synthetic inventory</h1>
    <p style={{ marginBottom: 24 }}>This page runs the hotel booking interface against an in-memory test transport with synthetic capacity. Guests choose the hotel rather than individual rooms; allocation remains private. The photos are hotel gallery assets, not verified inventory mappings. The blocked night is {addBookingDays(bookingLocalNow().date, 20)}; the 12:00 arrival is disabled. Catalogue and hotel-page navigation are verified in the main application.</p>
    <BookingTrigger propertyId="khajaguda" style={{ ...buttonStyle, background: '#181816', color: '#F5F2EB', marginBottom: 28 }}>Native booking</BookingTrigger>
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <button style={buttonStyle} disabled={busy} onClick={() => mode('offline')}>Simulate backend failure</button>
      <button style={buttonStyle} disabled={busy} onClick={() => mode('slow')}>Simulate slow connection</button>
      <button style={buttonStyle} disabled={busy} onClick={() => mode('conflict')}>Simulate confirmation conflict</button>
      <button style={buttonStyle} disabled={busy} onClick={() => mode('reset')}>Reset fixture inventory</button>
    </div>
    <p role="status" style={{ marginTop: 24 }}>{status}</p>
    <div style={{ display:'flex', flexWrap:'wrap', gap:24, marginTop:24 }}>
      <label><input type="checkbox" checked={composition} onChange={event => setComposition(event.target.checked)} /> Show website composition</label>
      <label><input type="checkbox" checked={staticView} onChange={event => setStaticView(event.target.checked)} /> Disable visual motion</label>
      <label><input type="checkbox" checked={hideImages} onChange={event => setHideImages(event.target.checked)} /> Hide imagery</label>
      <label><input type="checkbox" checked={hideBranding} onChange={event => setHideBranding(event.target.checked)} /> Hide branding</label>
    </div>
    <p style={{ fontSize:12, marginTop:16 }}>Visual checks affect only this isolated fixture. Motion is disabled with CSS overrides; this does not emulate the operating system preference.</p>
  </main>
    {staticView && <style>{`*, *::before, *::after { animation:none!important; transition:none!important; scroll-behavior:auto!important; transform:none!important; opacity:1!important; clip-path:none!important; }`}</style>}
    {hideImages && <style>{`img { visibility:hidden!important; }`}</style>}
    {hideBranding && <style>{`.inn-nav-brand, .bk-brand, .atlas-footer-wordmark { visibility:hidden!important; }`}</style>}
    {composition && <><Navbar /><HomePage /><Footer /></>}
  </>;
}
