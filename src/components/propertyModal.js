import { PROPERTIES, BRAND } from '../data/properties.js';

export function initPropertyModal(lenis) {
  const modalMask = document.querySelector('#propertyModal');
  const modalContentSlot = document.querySelector('#modalContentSlot');
  const closeBtn = document.querySelector('#modalCloseBtn');

  if (!modalMask || !modalContentSlot) return;

  function closeModal() {
    modalMask.classList.remove('open');
    modalMask.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  }

  function openModal(propId) {
    const prop = PROPERTIES.find(p => p.id === propId || p.slug === propId);
    if (!prop) return;

    if (lenis) lenis.stop();

    modalContentSlot.innerHTML = `
      <div style="margin-bottom: 24px;">
        <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--c-brass); letter-spacing: 0.22em; text-transform: uppercase; margin-bottom: 8px;">
          ${prop.chapter} · ${prop.coordinates}
        </div>
        <h2 style="font-family: var(--font-serif); font-size: clamp(2.4rem, 4.5vw, 4.8rem); font-weight: 300; line-height: 0.96; color: #FFFFFF; text-transform: uppercase;">
          ${prop.name}
        </h2>
        <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--c-text-light-muted); margin-top: 12px; line-height: 1.6;">
          ${prop.address}
        </div>
      </div>

      <!-- Architectural Gallery -->
      <div class="dossier-gallery-strip">
        ${prop.gallery.map(img => `
          <div class="dossier-gallery-item" data-cursor="VIEW">
            <img src="${img}" alt="${prop.name}" loading="lazy" />
          </div>
        `).join('')}
      </div>

      <!-- Editorial Narrative -->
      <div class="dossier-narrative-grid">
        <div>
          <div style="font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.2em; color: var(--c-brass); text-transform: uppercase; margin-bottom: 12px;">
            The Sanctuary Story
          </div>
          <p style="font-size: 1.1rem; line-height: 1.7; color: rgba(247, 245, 240, 0.9); font-weight: 300;">
            ${prop.editorialSnippet}
          </p>
        </div>

        <div style="background-color: var(--c-slate-deep); padding: 24px; border: 1px solid var(--hairline-dark);">
          <div style="font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.2em; color: var(--c-brass); text-transform: uppercase; margin-bottom: 16px;">
            Curated Amenities
          </div>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.85rem; color: var(--c-text-light-muted);">
            ${prop.features.map(f => `<li style="display: flex; align-items: center; gap: 8px;">· <span>${f}</span></li>`).join('')}
          </ul>
        </div>
      </div>

      <!-- Accommodations & Live Pricing -->
      <div style="margin: 40px 0;">
        <div style="font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.2em; color: var(--c-brass); text-transform: uppercase; margin-bottom: 16px;">
          Available Accommodations & Verified Rates
        </div>
        <table class="dossier-rooms-table">
          <tbody>
            ${prop.roomTypes.map(r => `
              <tr>
                <td style="width: 50%;">
                  <div style="font-family: var(--font-serif); font-size: 1.35rem; color: #FFFFFF; font-weight: 300;">${r.name}</div>
                  <div style="font-size: 0.8rem; color: var(--c-text-light-muted);">${r.note}</div>
                </td>
                <td style="text-align: right; width: 30%;">
                  <div style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--c-brass); font-weight: 300;">${r.price}</div>
                  <div style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--c-text-light-muted);">NIGHTLY RATE</div>
                </td>
                <td style="text-align: right; width: 20%;">
                  <a 
                    href="https://wa.me/918520963096?text=Hello%20Innzoy%20Concierge%2C%20I%20would%20like%20to%20reserve%20the%20${encodeURIComponent(r.name)}%20at%20${encodeURIComponent(prop.name)}.%20Please%20verify%20availability." 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="departure-link-action"
                    style="font-size: 0.72rem; padding-bottom: 3px;"
                  >
                    RESERVE ↗
                  </a>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Footer Action -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; padding-top: 24px; border-top: 1px solid var(--hairline-dark);">
        <div>
          <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--c-brass); letter-spacing: 0.2em; text-transform: uppercase;">Direct Line</span>
          <div style="font-size: 1rem; color: #FFFFFF;">${BRAND.contact.phone} · ${BRAND.contact.email}</div>
        </div>
        <div style="display: flex; gap: 24px;">
          <a 
            href="https://wa.me/918520963096?text=Hello%20Innzoy%20Concierge%2C%20I%20would%20like%20to%20reserve%20a%20stay%20at%20${encodeURIComponent(prop.name)}." 
            target="_blank" 
            rel="noopener noreferrer" 
            class="departure-link-action"
          >
            WHATSAPP CONCIERGE ↗
          </a>
        </div>
      </div>
    `;

    modalMask.classList.add('open');
    modalMask.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  // Trigger handlers
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-property-trigger]');
    if (trigger) {
      e.preventDefault();
      const propId = trigger.getAttribute('data-property-trigger');
      openModal(propId);
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalMask.addEventListener('click', (e) => {
    if (e.target === modalMask) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalMask.classList.contains('open')) {
      closeModal();
    }
  });

  return { openModal, closeModal };
}
