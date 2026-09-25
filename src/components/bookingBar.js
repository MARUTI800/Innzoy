import { BRAND, PROPERTIES } from '../data/properties.js';

export function initBookingBar() {
  const bookingForm = document.querySelector('#heroBookingForm');
  const propertySelect = document.querySelector('#bookingPropertySelect');

  if (propertySelect) {
    // Populate property options
    PROPERTIES.forEach(prop => {
      const opt = document.createElement('option');
      opt.value = prop.name;
      opt.textContent = `${prop.name} (from ${prop.formattedPrice})`;
      propertySelect.appendChild(opt);
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const propName = propertySelect ? propertySelect.value : 'Any Hyderabad Location';
      const checkinDate = document.querySelector('#bookingCheckinInput')?.value || 'Upcoming Dates';
      const guests = document.querySelector('#bookingGuestsSelect')?.value || '2 Guests';

      const message = `Hello Innzoy Concierge, I would like to enquire about reserving a stay at ${propName} for check-in on ${checkinDate} (${guests}). Please share availability, suite options, and direct booking confirmation.`;
      const waUrl = `https://wa.me/918520963096?text=${encodeURIComponent(message)}`;
      
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // Floating pill trigger opens booking drawer or scrolls to discover
  const floatingPill = document.querySelector('#floatingConciergePill');
  if (floatingPill) {
    floatingPill.addEventListener('click', () => {
      const waUrl = `https://wa.me/918520963096?text=${encodeURIComponent("Hello Innzoy Concierge, I am planning a stay in Hyderabad and would like personalized assistance.")}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }
}
