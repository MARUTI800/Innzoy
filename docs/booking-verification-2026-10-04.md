# Innzoy hotel booking verification — 4 October 2026

The current guest journey is hotel-first: homepage/catalogue hotel photography → hotel detail page with photos and published starting rates → full-screen booking for that selected hotel → dates/guests, arrival/contact details and review. Global Book actions lead to the hotel catalogue; Change hotel returns there while preserving date and guest preferences. Public room selection and an admin/CRM interface are deferred. The existing guesthouse links and coming-soon property remain outside the native hotel booking API.

## Local checks

- `npm run test:booking`: 59 passing tests covering real HTTP handlers with injected transport, validation, private receipts, retries, calendar selection, hotel-first navigation preferences and safe readiness checks.
- TypeScript and production build pass. Google font fetching required network-enabled build execution.
- Isolated in-memory UI fixture verified selected-hotel booking, disabled arrival choices, empty-contact validation, review, automatic allocation, confirmation and private receipt recovery after reload. Catalogue and hotel-page navigation belong to the main application rather than this isolated fixture. Close returns to the original opener. No real reservation or WhatsApp message was sent.
- Shared site colors use paper, charcoal and wine actions, with available/request/unavailable colors. The original transparent PNG remains intact; the hero/header display it in white and light surfaces retain its colors. Hero location is stacked, sizing/gaps reduced, and the descriptor is curved. Hero calendar opening is 0.85 seconds with `sine.inOut` easing; its month transitions use a gentle pace. Reduced-motion behavior remains available.
- The full-screen booking panel shows only the selected hotel, with a compact hotel photo/date composition and fewer repeated headings. Hotel browsing and selection happen before this panel opens. Change hotel leaves the panel for the catalogue with date and guest preferences preserved; required-field validation and receipt recovery remain connected to the existing booking logic.
- The homepage calendar collects preferences without requesting availability for the photographed hotel. Rendered checks verified homepage dates reach the catalogue, hotel photo links open matching property pages, photo arrows and fullscreen gallery navigation work, and date/guest preferences remain through Change hotel, related-hotel links and shared navigation. Empty guest fields still prevent advancing to review. At 320×740, the six-week November calendar ends above the fixed action strip without horizontal overflow; hotel-page photos, rates and booking controls also fit at 390×844.
- A temporary loopback-only PostgreSQL 17.5 cluster ran both migrations and the complete SQL integration fixture with real allocation, capacity, retry, cancellation, private-token, fragmented-stay, adjacent-night and optional-room checks. Actual anonymous/authenticated role access was denied. Forced lock contention on separate PostgreSQL connections verified two simultaneous requests for one unit (one success/one conflict), six identical retries (one reservation), a changed concurrent retry (one idempotency conflict), and ten requests for three units (three distinct allocations/seven conflicts). The test cluster stopped automatically. Its downloaded binaries/client and data stay inside ignored `node_modules`; Supabase received no test inventory or reservations.
- Rendered desktop and mobile hero and booking panel were inspected after the minimal-panel refinement. The calendar fits above the fixed mobile action strip, with no horizontal overflow. Earlier 390×844 and 320×740 checks also verified that separation; their old pixel coordinates should not be treated as a specification for future layout changes. The connected but unconfigured backend displays request-only date colors and never offers an instant confirmation. Temporary viewport overrides were reset and the isolated fixture was shut down.

## Connected Supabase project

Project reference: `llfzsztxfelgsiawixca`. Credentials are confined to ignored `.env.local`; their values are intentionally absent from this document.

Applied through the authenticated Supabase SQL Editor, in order:

1. `supabase/migrations/202610020001_booking.sql`
2. `supabase/migrations/202610030001_room_selection.sql`

The first migration succeeded. When the editor retained the previous script while loading the second, PostgreSQL rejected a duplicate initial table inside its transaction. The editor was explicitly cleared, only the second file was loaded, and the update then succeeded. No customer data existed or was removed.

A live read-only query verified 9 property records, 0 enabled properties, 0 inventory units, 0 arrival times and 0 reservations. RLS is enabled on all four booking tables. Booking functions deny execution to anon/authenticated roles and allow the server role. The server-side read-only readiness command now reaches the booking RPC and returns `hotel_not_enabled`, as expected for unconfigured inventory.

These files were applied manually; before later adopting Supabase CLI deployment, reconcile the applied versions with CLI migration history rather than blindly pushing the initial migration again. Follow `docs/booking-setup.md`.

## Remaining operating setup

The first hotel needs its verified sellable capacity, maximum guests per stay, accepted arrival times and actual check-in/check-out policy. Existing/offline/channel bookings must be reconciled before enablement. The prepared guarded setup templates leave empty or unverified capacity unavailable. No live confirmation is claimed before this data is configured.

The isolated PostgreSQL checks now pass through `tests/booking-database-pg.mjs`. They verify the actual migrations and functions on PostgreSQL 17.5, rather than a mocked transport. They do not measure production deployment load, remote latency or external sales-channel synchronization. Production remains unconfigured and unavailable until the operating setup above is completed. The supplied server secret should be rotated because it was shared in chat; enter its replacement directly into `.env.local` and restart the server.
