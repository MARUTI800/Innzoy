# Booking UI fixture

This isolated, **test-only** Next application renders the real booking components with synthetic, in-memory inventory. It uses the real booking service with an injected mock REST transport; it never connects to Supabase and creates no real reservations.

From the repository root, run:

```powershell
.\node_modules\.bin\next.cmd dev tests/booking-ui-fixture --hostname 127.0.0.1 --port 3001
```

Open http://127.0.0.1:3001. The cache stays in this fixture's `.next` folder. This application is outside the production `src/app` tree and must not be deployed.

The visible controls enable a backend outage, a slow connection, or a competing reservation at confirmation. Reset clears synthetic bookings and browser draft/receipt storage. The Native booking button opens full-screen booking for the selected test hotel, Khajaguda. The guest UI chooses no individual room; the fixture allocates a fitting synthetic internal unit privately. Today + 20 days is blocked across all units, and 12:00 is a disabled arrival time. All capacity and reservations are synthetic. The photographs come from the existing hotel gallery and are not verified inventory mappings.

Choose future dates that do not include the blocked night, adjust guests, browse hotel photos, select an available arrival time and enter synthetic contact details. Verify required-field errors, review, confirmation, retry behavior and private receipt recovery after reload. Increasing the guest count beyond synthetic capacity should show unavailable dates. Simulate a confirmation conflict to verify that a competing booking cannot produce a success. Reset between independent checks. Requests with the same idempotency key, payload and recovery credential return the same record; changed details use a new fingerprint.

The production journey starts before this isolated panel: global Book → hotel catalogue → hotel detail page with photos and published rates → selected-hotel booking. Change hotel returns to the catalogue with date/guest preferences. Catalogue and hotel-page navigation must be checked in the main application, because this fixture implements only its test page and API routes. Its optional backend room metadata exists for API tests and a future phase; no room picker is presented to guests.

For an optimized local fixture preview, keep its build separate from the production application:

```powershell
.\node_modules\.bin\next.cmd build tests/booking-ui-fixture
.\node_modules\.bin\next.cmd start tests/booking-ui-fixture --hostname 127.0.0.1 --port 3001
```

Use this to verify UI behavior, keyboard access, responsive layout, and shared request handling. It does **not** verify PostgreSQL locking or production inventory; those require the separate database integration test.

The composition checkbox renders the actual homepage, navigation and footer. The visual controls independently hide imagery or branding and disable visual motion with CSS, allowing the static composition to be inspected. The motion override does not emulate the operating system's reduced-motion preference.
