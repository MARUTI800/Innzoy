# Set up real Innzoy hotel bookings

The current phase is **hotel booking**: guests browse hotels, open a hotel's detail page to see its photos and published starting rates, then book that selected hotel. Full-screen booking collects dates, guest count, arrival time and contact details before review and reservation. The database allocates a fitting internal unit for the entire stay. Individual room selection is deferred. No payment is collected; the property confirms final rates, taxes and fees.

The application reads project credentials only from private server environment variables; none are included in this repository. The current local project is connected and both booking migrations are installed, but every hotel remains disabled with zero configured inventory and arrival times. Instant confirmation remains unavailable until actual operating data is configured. Hyderabad dates use `Asia/Kolkata`; arrival slots do not add room capacity.

Book actions without a selected hotel lead to `/stays?category=hotel`; homepage and catalogue hotel photographs lead to `/stays/[slug]`. A selected hotel's Book your stay action opens its full-screen booking panel. Change hotel returns to the catalogue while preserving date and guest preferences. There is no hotel chooser inside the booking panel. Its hotel photo/date composition is compact, and the hero date popup opens over 0.85 seconds. These presentation changes do not invent availability or bypass validation.

## 1. Use the connected project or create one for a fresh installation

The current development machine already uses the installed project described in the verification record. Continue with its operating setup instead of creating another project or rerunning its installed migrations. The following creation steps are for a separate fresh installation.

Open the [Supabase dashboard](https://supabase.com/dashboard), sign in, choose an organization and create a new project for Innzoy. Choose a region near the hotel operations and keep the database password in your password manager. Wait until the project is ready. Project creation and its billing choices belong to the account owner.

The project's **Connect** dialog provides the project URL. Open **Settings → API Keys** to create/copy a server secret key beginning `sb_secret_`. This app's server needs that secret key; the publishable/anon key cannot access its private booking tables. [Supabase API key guide](https://supabase.com/docs/guides/getting-started/api-keys)

## 2. Put credentials in the local environment

The ignored local `.env.local` is already configured on the current development machine. Keep its values private and do not replace other configuration. On a fresh checkout, copy `.env.example` only if `.env.local` does not already exist, then fill its entries locally:

```dotenv
SUPABASE_URL=https://YOUR_PROJECT_REFERENCE.supabase.co
SUPABASE_SECRET_KEY=YOUR_SERVER_SECRET_KEY
```

Use the exact project root URL, without `/rest/v1`, embedded credentials, a query or a fragment. Keep the secret out of chat, screenshots, Git and `NEXT_PUBLIC_` variables. The current server key was shared in chat and must be rotated before launch; enter the replacement directly in `.env.local`. An existing project may still use `SUPABASE_SERVICE_ROLE_KEY` for its legacy service-role JWT; the current secret key takes precedence when both are set. Restart the Next server after editing the environment. Add the same server-only variables to the deployment's secret settings when deploying.

Check the file without printing its values or contacting the project:

```powershell
npm run booking:check
```

`local_configuration_ready` means the variable format is ready. It does not mean the database or hotel is enabled.

## 3. Install the booking database

In the project's [SQL Editor](https://supabase.com/docs/guides/database/overview), run these files once, in order, using your database-owner dashboard session:

1. `supabase/migrations/202610020001_booking.sql`
2. `supabase/migrations/202610030001_room_selection.sql`

An existing migrated project needs only its unapplied migration. Do not rerun already applied initial migrations. The second migration prepares optional future room choices; no public room choices need to be enabled for the current hotel flow. The Data API must expose `public`. Both migrations keep booking tables and RPCs private to the server role.

For this fresh-project SQL Editor bootstrap, record each filename and when it was successfully applied. Running SQL manually does not automatically populate the Supabase CLI migration history. If you later adopt the CLI, first compare the actual schema and your recorded files with its migration history, then reconcile/adopt that history using the documented [migration list](https://supabase.com/docs/reference/cli/supabase-migration-list) and [migration repair](https://supabase.com/docs/reference/cli/supabase-migration-repair) workflow. Do not run `db push` against this manually bootstrapped project until that reconciliation is complete; otherwise existing migrations may be treated as pending. Repair changes history records rather than applying the SQL itself.

Every seeded property starts disabled. There are **zero** seeded rooms and **zero** seeded arrival slots. Missing environment variables, an unapplied migration, disabled properties, or incomplete operational setup produce HTTP503 and the website's selected-details WhatsApp fallback. The app never reports a successful reservation while this setup is incomplete.

## 4. Configure the first hotel with real operating data

Use one of the current native hotel IDs:

| Hotel | ID |
| --- | --- |
| Khajaguda | `khajaguda` |
| DLF Road | `dlf-road` |
| TNGO Colony | `tngo-colony` |
| HITEC City | `hitec-city` |

Before enabling one, obtain its actual independently bookable unit count, each unit's internal label and maximum guests, accepted arrival times, and confirmed standard check-in/check-out policies. Count a real sellable unit once. These internal units support capacity and prevent overlapping stays; guests currently choose the hotel rather than a room number. Guesthouses and their existing external booking journeys remain separate.

`supabase/setup/configure-hotel.sql` is a guarded first-hotel template, **not an automatic migration**. Fill `hotel_id`, `verified_units` and `accepted_arrivals` with the hotel's actual values, then run it in SQL Editor. Its empty defaults fail before writes. It creates verified internal units and arrival slots while leaving the hotel disabled. It refuses to overwrite existing inventory. It does not create any reservations or public room metadata.

Keep the hotel disabled while reconciling existing, offline and other-channel reservations against those units. Record their actual booked nights through the privileged operations workflow, or exclude affected inventory until reconciliation is complete. The overlap constraint protects only bookings present in this database; it does not synchronize another sales channel.

Then fill and run `supabase/setup/enable-hotel.sql`. It requires the real hotel ID, confirmed check-in/check-out clock policies and an explicit acknowledgment that inventory is reconciled. It verifies active units and accepted arrival slots before enabling the property. The confirmed policy values are an operator review guard; the current reservation API reserves nights and accepted arrival slots rather than storing a checkout clock policy.

## 5. Check readiness without creating a booking

After migration and verified hotel setup, run the read-only online check for the hotel you enabled:

```powershell
npm run booking:check -- --online --hotel YOUR_HOTEL_ID
```

Replace `YOUR_HOTEL_ID` with one of the IDs above. The checker calls only `booking_availability`; it cannot apply SQL, enable a hotel or create/hold/cancel a reservation. It never prints secret values or remote response bodies.

| Result | Next action |
| --- | --- |
| `configuration_needed` | Fill the server environment entries locally. |
| `credentials_rejected` | Verify the key belongs to this project and is a server secret/service-role key. |
| `migration_needed` | Apply the unapplied migration and allow the Data API schema cache to reload. |
| `hotel_not_enabled` | Complete actual inventory and arrival slots, reconcile bookings, then enable the hotel. |
| `hotel_ready` | The hotel inventory RPC is operational. Zero available dates may mean sold out or insufficient capacity for the requested guest count. |

To check an actual future stay without reserving it, add `--guests REAL_GUEST_COUNT --check-in YYYY-MM-DD --check-out YYYY-MM-DD`. A month-only check intentionally does not select a stay. In the website, choose the same hotel/dates/guests and verify actual colors, arrival options, guest validation and the review screen. A production reservation should be submitted only when you intend to make that real reservation.

Before public launch, rerun the database integration checks after any schema changes and configure deployment rate limiting for availability, creation and private lookup. Isolated PostgreSQL allocation and concurrency checks passed on 4 October 2026. This readiness check verifies configuration and live availability; it is not a production load test.

## Operations

Use the authenticated Supabase dashboard/SQL workflow to manage inventory and booking status. An admin/CRM interface is deferred; no public admin endpoint is exposed. A pending or confirmed booking blocks its unit's nights; cancelled/completed records do not. Changing a booking back to an active status or editing its dates remains subject to the overlap constraint. When managing statuses, set `updated_at=now()` along with your update. Pending bookings do not expire automatically; operators must resolve them.

## Future room choices (deferred)

The backend has optional room-choice support for a later phase. Keep `show_in_booking=false` for the current hotel-only experience. Hotel-level availability and automatic assignment work without published room metadata.

For each independently reservable room that guests may choose, verify its actual appearance and occupancy with the property. Populate that unit's `public_name` (up to 120 characters), optional `public_description` (up to 1,500 characters), and `public_images` (a PostgreSQL text array with 1–12 absolute HTTP(S) image URLs). Images must describe that actual unit or its verified matching room type; a general hotel photograph is not an inventory mapping. Use stable, publicly readable URLs without embedded credentials. Set `show_in_booking=true` only after verifying the public metadata. Keep operational room numbers in the existing private `label` unless the property explicitly intends to publish them.

No public names, photos, capacities, room types, room-specific prices or mappings are supplied by the migration. `show_in_booking` defaults to false. The current frontend has no public room chooser; these fields and API capabilities are preparation for a future phase. Unconfigured inventory continues to produce HTTP503. The frontend shows existing hotel gallery photographs, but those photographs are not available room options.

The availability API returns published room options only for a complete selected stay and guest count. Each option's `available` covers the full `[check_in,check_out)` range on one unit and a valid arrival opportunity. Already booked published units may remain visible with `available=false`; rooms that cannot hold the requested guests are omitted. The date calendar remains a property-level availability calendar. Selecting a room never holds it; confirmation checks that exact room again atomically and returns a conflict if it has become unavailable, without substituting another room.

The new `bookings.requested_room_unit_id` records an explicit public room choice and must match the actual assigned unit. Automatic assignments leave this value null, preserving the existing private allocation behavior. The second migration replaces the reservation RPC with an appended defaulted UUID argument so calls without a room preference continue to work.

## API and privacy

Shared types and validation live in `src/lib/booking.ts`. Server RPC access lives in `src/lib/booking-server.ts` and is marked `server-only`.

* `GET /api/bookings/availability?property_id=khajaguda&month=YYYY-MM&guests=2` returns one-night arrival availability for each day in the month. Supply both `check_in=YYYY-MM-DD` and `check_out=YYYY-MM-DD` to check an entire stay and receive enabled arrival slots and `room_options`. Optional future room options contain only `{id,name,description,images,max_guests,available}`; the current hotel-only UI does not display them as selectable inventory. All dates and room options respect the requested guest count. A single unit must fit the **entire** stay; different free units on different nights are insufficient. Month-only requests return `slots:[]`, `room_options:[]` and `available:false`, because no stay has been selected yet. Missing room metadata from an older RPC is treated as an empty options array, never invented choices.
* `POST /api/bookings` accepts `property_id`, optional `room_unit_id` (a canonical UUID), `check_in`, `check_out`, `arrival_time` (`HH:mm`), integer `guests`, `first_name`, `last_name`, `email`, `phone`, `notes`, and a cryptographically generated UUIDv4 `idempotency_key`. Omit the room identifier to retain automatic assignment. Success is `{booking,access_token}` with HTTP201; `booking.room_unit_id` appears only for an explicit public room choice. Reuse the same key and unchanged details after a timeout or retry. Use a new key when the user changes a submitted request, including the room choice. The database serializes concurrent retries and returns the original reservation, including when its arrival time/date has since passed. New reservations always undergo the current date/time checks before allocation. A chosen room must be active, published, photographed, belong to the selected property, hold the requested guests and fit the full stay.
* `POST /api/bookings/request-key` accepts the same reservation details without `idempotency_key`, validates and normalizes them, and returns `{fingerprint,idempotency_key}`. The key uses Node's cryptographically secure UUIDv4 generator, allowing browsers without WebCrypto to prepare a reservation safely. The SHA256 fingerprint matches normalized booking details, including trimmed names and case-insensitive email. This endpoint stores nothing, contacts no database, and creates no reservation. Compare the fingerprint to your privately saved retry record; reuse its prior UUID for unchanged details. Discard the newly issued UUID in that case.
* `GET /api/bookings/INZ-...` requires `Authorization: Bearer <access_token>` and returns `{booking}`. A reference alone cannot reveal any customer details. Tokens belong in the authorization header, never in a URL or query string. Keep the returned credential privately in the browser session so the customer can reopen their booking after refreshing.

The idempotency UUID is also a recovery secret: the server derives the same opaque access token for a retry. Treat both values as credentials. PostgreSQL stores hashes of the idempotency key, request fingerprint and access token. Customer data is intentionally accessible only to privileged operations workflows and to the token holder. The API explicitly strips internal hashes, operational labels and private automatic room assignments; an explicitly selected public room identifier is retained in the private receipt. No reservation payload or backend error is logged by this implementation. Configure infrastructure logging to exclude request bodies and authorization headers, and set an operational retention policy for customer data.

All API responses use `Cache-Control: no-store, private`. Validation errors are HTTP422 with `{error:{code,message,fields}}`; unavailable inventory/races are HTTP409 `BOOKING_CONFLICT`; changed duplicate requests are HTTP409 `IDEMPOTENCY_CONFLICT`; unavailable backend/setup is HTTP503 `BOOKING_UNAVAILABLE`; missing private credentials are HTTP401; a wrong token/reference pair is a generic HTTP404. Network/REST failures have a 10-second timeout and never produce a confirmation.

The booking window starts at the current Hyderabad date and ends 365 days later; check-out must fit within that window and follow check-in by 1–30 nights. Guests range from 1–12, further limited by the configured unit capacity. Same-day arrival slots must be later than the current local minute. Capacity and date rules are checked again in PostgreSQL after acquiring the allocation lock. The GiST exclusion constraint protects overlapping `[check_in,check_out)` nights even if a future admin tool writes directly.

## Verification

Run the unified dependency-free booking suite with Node24. The current suite has 59 passing tests, including the hotel-only API guard, hotel-first navigation preferences and readiness checks:

```powershell
npm run test:booking
npx tsc --noEmit
```

The HTTP tests use an injected mock REST transport. They verify actual handler behavior, hotel-only scope, normalization, private lookup, error handling, network retries, recovery credential hashes, guest forwarding, body limits, same-origin protection, optional room validation/fingerprinting and public room metadata filtering. Client tests cover date formatting, contact validation, calendar export and departure previews. Readiness tests cover secret redaction, environment/argument guards, correct modern/legacy credential headers, availability-only checks and safe failure states. The database-harness guard test checks that unsafe connection settings are refused before `psql` runs. They **do not** prove the migrations have been applied or PostgreSQL concurrency behavior.

Although PostgreSQL/`psql`, Docker and Supabase CLI were absent from PATH, a temporary portable PostgreSQL 17.5 cluster verified the real migrations and allocation fixture through the optional `pg` test client on 4 October 2026. The cluster listened only on loopback and stopped after the checks. No production database was used.

For database checks, install/use `psql` with a fresh disposable local PostgreSQL database whose name includes `test`. The test user needs permission to create extensions and roles. The harness refuses remote hosts, non-test database names, and URI query/fragment options that could override connection settings:

```powershell
$env:BOOKING_TEST_DATABASE_URL = 'postgresql://postgres:YOUR_LOCAL_TEST_PASSWORD@localhost:5432/innzoy_booking_test'
node tests/booking-database.mjs
```

The harness applies all migrations in timestamp order to that fresh test database and executes `tests/booking-database.sql`. Synthetic test inventory/bookings run inside a transaction and roll back. It checks disabled setup, role grants, idempotency, changed retries, overlap rejection across different arrival times, adjacent nights, cancellation release, token lookup, capacity filtering, direct-write exclusion protection, fragmented multi-night availability, published room scoping, exact room allocation and rejection of unavailable room choices without substitution. Use a fresh database on subsequent runs because the schema remains installed. No test creates a reservation in a production Supabase project.

For real multi-connection contention checks, use the alternative `pg` client harness with another fresh disposable localhost test database. The optional client can be installed into an ignored tools folder without changing the app's dependencies:

```powershell
npm install --prefix node_modules/.booking-test-tools --no-save --ignore-scripts --package-lock=false pg
$env:BOOKING_TEST_PG_MODULE = Join-Path (Get-Location) 'node_modules/.booking-test-tools/node_modules/pg/lib/index.js'
$env:BOOKING_TEST_DATABASE_URL = 'postgresql://postgres:YOUR_LOCAL_TEST_PASSWORD@localhost:5432/innzoy_booking_test'
node tests/booking-database-pg.mjs
```

This alternative runs both migrations and the same SQL integration fixture, then verifies actual public-role access denial and simultaneous requests on separate connections. It deliberately waits until every request is blocked on a PostgreSQL lock before releasing contention. The checks require one success/one conflict for two requests competing for one unit, one reservation for six matching retries, rejection of a changed retry, and exactly three distinct allocations for ten requests competing for three units. Synthetic concurrent data is removed by its random test-property IDs afterward. The harness refuses remote hosts, non-test database names, connection overrides and an existing booking schema. It never loads the application's Supabase environment. These checks establish allocation correctness under the covered races; they do not replace deployment load testing, rate limiting or reconciliation with other sales channels.

References: [PostgreSQL range exclusion constraints](https://www.postgresql.org/docs/current/rangetypes.html#RANGETYPES-CONSTRAINT), [Supabase database functions and privileges](https://supabase.com/docs/guides/database/functions), [Supabase row level security](https://supabase.com/docs/guides/database/postgres/row-level-security).
