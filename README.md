# Amazing Grace Antiques — production prototype

This implementation lives on `feature/production-capable-prototype`. The client-facing demo on `main` has not been modified or merged. The existing visual identity and vendor-mall copy are retained.

## Architecture

- **Next.js 16 App Router + React 19:** existing pages, navigation, forms, and visual components are reused. Events have a simple list at `/events` and shareable detail pages at `/events/[slug]`.
- **Sanity:** public editorial content only. A standalone Studio in `studio/` manages events, announcements, gallery photos, key store photos, and a visitor note. No customer submissions or private photos go into Sanity.
- **Supabase Postgres + private Storage:** item submissions, sanitized photo objects, an email notification queue, and shared form rate limits. Server-only credentials; no browser Supabase client and no public submission API.
- **Resend:** contact messages go directly to the configured business inbox. Item notifications are delivered after durable storage, with sanitized photos attached. Failed item notifications remain queued for retry.

```text
Visitor → existing Next.js form → server validation + shared rate limit
  Contact → Resend → business inbox
  Item → Postgres staging record → private photos → received record
       → Resend notification + attachments
       → authenticated scheduled job retries failures / cleans incomplete uploads

Sherri → Sanity Studio → published editorial content → Next.js website
```

## Local setup

Use Node.js 22.12+ (Node 24 recommended) and npm. Run commands at the repository root. On PowerShell systems that block `npm.ps1`, use `npm.cmd` instead of `npm`.

```sh
npm ci
# Copy .env.example to .env.local and supply service credentials.
# Copy studio/.env.example to studio/.env.local for the Studio.
npm run dev
# In another terminal:
npm run studio:dev
```

The website runs on port 3000; Studio runs on port 3333. Without CMS configuration, original local gallery/store photos remain visible and events show a truthful empty state. Once configured, the gallery uses only active, published CMS items; an empty gallery shows a short visitor message. CMS outages show recovery text for gallery/events, while store-photo slots retain original images. No sample events are shown.

Forms fail safely with a phone alternative when required services are absent. They do not simulate delivery or claim success, except for the deliberate honeypot response to bots. Photo preparation requires JavaScript.

## Environment variables

Secrets belong in `.env.local` and the hosting platform's encrypted environment settings. Never prefix secrets with `NEXT_PUBLIC_` or `SANITY_STUDIO_`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Full canonical site origin, such as `https://www.amazinggraceantiques.com` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public Sanity project ID; set with the dataset |
| `NEXT_PUBLIC_SANITY_DATASET` | Editorial dataset, typically `production`; leave both CMS values blank for unconnected local mode |
| `SANITY_API_READ_TOKEN` | Optional server-only viewer token for a private editorial dataset; a public dataset needs no token |
| `RESEND_API_KEY` | Server-only sending key |
| `CONTACT_FROM_EMAIL` | Sender on a verified Resend domain; a display name is allowed |
| `CONTACT_TO_EMAIL` | Business inbox receiving both forms; confirm with Sherri |
| `SUPABASE_URL` | Supabase project API origin |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only privileged key; never use in Studio or browser code |
| `FORM_RATE_LIMIT_SECRET` | Random secret of at least 32 characters for hashing rate-limit identifiers |
| `CRON_SECRET` | Different random secret of at least 32 characters for the maintenance endpoint |
| `TRUSTED_IP_HEADER` | Only for non-Vercel production hosts: IP header overwritten by your trusted reverse proxy |

Studio's separate `.env.local` needs `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`. These are public identifiers and must match the website. No API write token is needed in the website. Studio editors sign in with their Sanity accounts.

## Sanity setup and content workflow

1. Create a Sanity project and editorial dataset in [Sanity Manage](https://www.sanity.io/manage). A public dataset is suitable because it contains only published website content. Sanity media assets are not used for private customer uploads.
2. Set the website and Studio environment variables. Invite Sherri as an editor. Add the Studio's development/deployed origins to the project's allowed CORS origins with credentials enabled. Website reads happen server-side.
3. Run `npm run studio:dev`. For a hosted Studio, run `npm run studio:deploy` after signing in and choosing the Studio hostname. This repository does not create, seed, or publish a remote project automatically.
4. Use the three clearly named sections: **Events & announcements**, **Gallery photos**, and **Store photos & visit note**.

Schemas:

- `event`: title, unique generated slug, event/announcement type, short description, rich full details, start date, optional last day, optional start/end times, image with alt text, optional HTTPS CTA, website visibility, featured flag. Drafts never reach the public site. Turn on **Show on the website**, then **Publish**.
- `galleryItem`: photo, required descriptive alt text, optional caption, display order, and active flag. Lower order numbers appear first. The existing gallery layout assigns positions automatically; editors do not manage layout classes.
- `storeSettings`: singleton containing optional hero, About, Visit, Contact, and Sell photos plus a short visit note. Empty image slots use the existing local photo. Hotspots let editors adjust the focal point.
- `accessibleImage`: reusable image object with hotspot/crop support and required alt text.

Event dates and times are interpreted in **America/Chicago**. Times use `HH:mm` (24-hour time); leave blank when not confirmed. Multi-day events remain visible through their last day. A known end time removes a same-day event after that time; otherwise it stays through the end of the day. Announcements appear from their start date through their optional last day. Hide an announcement manually if it has no expiry. The homepage shows up to three current/upcoming entries, prioritizing featured entries. Expired events retain their shareable detail URL with an ended notice but disappear from primary lists.

Published changes are fetched with 60-second revalidation; allow about a minute and a subsequent page visit for cached pages to refresh. No visual-editing overlays, webhook setup, or draft previews are required. [Sanity's caching guidance](https://www.sanity.io/docs/nextjs/caching-and-revalidation-in-nextjs) describes this time-based approach.

Query/result types are generated from the schemas into `lib/cms/sanity.types.ts` and committed with the code. Studio development/builds regenerate them automatically. Run `npm run studio:types` after changing schemas or GROQ queries, then run the website type check. The intermediate `studio/schema.json` is ignored.

Permanent address, phone, regular hours, site identity, and navigation remain in `config/`: they are reused in metadata and multiple client/server components and should be confirmed centrally before launch. The editable visit note provides value for temporary holiday hours without duplicating that configuration. There is no generic page builder.

## Supabase setup and private submissions

1. Create a Supabase project owned by the business/developer team.
2. Apply `supabase/migrations/202609280001_submissions.sql` once through the SQL Editor or your normal migration workflow. It creates the submission table, rate-limit table/functions, notification-claim function, and **private** `antique-submissions` bucket.
3. Set the server environment variables. Do not add anonymous/authenticated table or bucket policies. The migration enables row-level security, revokes those roles' table access, and restricts RPC execution to the service role.
4. Verify bucket privacy in the Supabase dashboard. A private bucket requires authorized access rather than a public asset URL. See [Supabase's bucket access model](https://supabase.com/docs/guides/storage/buckets/fundamentals).

Each item has a UUID, creation time, workflow status (`uploading`, `received`, `reviewing`, `closed`), contact information, category, description, approximate age, optional asking price in integer US cents, preferred contact method, and private photo paths. Only name, email, and an adequate description are required; a phone number is required only when calls/texts are preferred. Photos and price are optional.

The browser accepts up to five JPG/PNG/WebP photos, resizes them to at most 1600px, and retains selections through recoverable form errors. Original files are limited to 20 MB each. Server limits are five photos and 3 MB combined, within the 4 MB Server Action request limit. The server independently checks count, byte size, MIME, file signatures, decoded image format, animation, and a 40-megapixel limit. Sharp re-encodes to WebP, rotates according to orientation, resizes, and strips metadata including EXIF/GPS. Original names and bytes are not stored. HEIC/SVG/GIF and other formats are not accepted.

Files use `<submission UUID>/<photo number>.webp`. A staging database row records all intended object paths before upload. Only after all uploads succeed is it marked `received`; that transition also makes its pending notification eligible for delivery. If a final database response is ambiguous, the server checks the stored status. Incomplete entries remain traceable and are cleaned after 24 hours by the scheduled job. No completed submission is deleted because of an email failure.

The business receives the complete inquiry and sanitized photo attachments in email. Authorized maintainers can review records/objects in the Supabase dashboard. There is deliberately no additional customer-management dashboard. Agree a retention period with the client before launch; no automatic deletion of completed business inquiries is assumed. To delete a completed inquiry, remove its bucket objects through Storage first, then its database row. Do not delete rows first, which would orphan files.

## Resend setup and notification retries

1. Create a Resend sending key, verify the sending domain/DNS, and set `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and `CONTACT_TO_EMAIL`.
2. Visitor addresses are used only as `reply_to`; the sender always comes from the configured verified domain. Email is plain text, and input validation prevents line breaks in subject names.
3. Verify both form flows on a private preview with an inbox you control. No live emails are sent by the automated tests.

Contact form success means Resend accepted the message. Contact messages are not duplicated into the database. Delivery errors retain entered values so the visitor can retry.

Item success means the inquiry and photos were saved; email can follow later. The notification queue leases one eligible record at a time for five minutes using `FOR UPDATE SKIP LOCKED`. Successful delivery records `sent`; failures back off exponentially and stop after eight attempts with `failed`. Resend receives the stable key `antique-submission-<id>` to avoid duplicates on ordinary retries. [Resend retains idempotency keys for 24 hours](https://resend.com/changelog/idempotency-keys); recovery after a long outage or manual replay may send another email and should be checked against delivery logs.

Configure an external scheduler **every minute** to call:

```text
GET https://your-preview-or-production-origin/api/jobs/submissions
Authorization: Bearer <CRON_SECRET>
```

The endpoint retries a queued notification and removes old incomplete uploads/expired rate-limit records. It returns only counts, never submissions or photos. A 401 means the secret is missing/wrong; a 503 indicates a service failure. Monitor scheduler failures and `notification_status = 'failed'`. After addressing the cause, an authorized maintainer may reset a failed record to `pending`, set attempts to 0 and next-attempt to `now()`; check Resend delivery history before replaying. The five-minute lease permits recovery after a crashed worker.

## Form security and accessibility

- Server validation is authoritative; enums, lengths, prices, required contact information, and files are checked independently of browser controls.
- Honeypots silently drop bot submissions. A database-backed limiter allows 12 valid attempts per IP per 15 minutes and 4 per email/form per hour. It stores HMAC identifiers, not raw IPs. Counters are atomic across instances.
- Production forms fail closed if rate limiting or the trusted IP source is unavailable. On Vercel, the app uses `x-vercel-forwarded-for` as documented in [Vercel's request headers](https://vercel.com/docs/headers/request-headers). On another host, configure a proxy that overwrites the selected header and prevents direct origin access. Local `next dev` uses a shared local identifier. Do not trust a header supplied unchanged by a visitor.
- Keep Next.js's same-origin Server Action protection. No wildcard allowed origins or CORS bypass is introduced. Add infrastructure request/body limits and bot controls as appropriate before exposing a production endpoint.
- Labels, instructions, errors, and buttons are more readable; keyboard focus moves to the first invalid field or error status. Entered text/photo selections survive errors. Buttons indicate work in progress. Required/optional fields are explicit.
- A skip link, visible mobile Menu/Close controls, Escape handling, keyboard focus loop, existing reduced-motion support, and clear empty/loading/not-found states preserve straightforward navigation. No carousel, login, checkout, or complex calendar widget is added.
- Public images use Next Image and a project/dataset-scoped Sanity CDN allowlist. Secrets and private photos never enter page props or public URLs.

## Deployment

1. Deploy this feature branch to a **separate preview project/environment**. Keep the client-facing `main` deployment unchanged. Use deployment protection/noindex for a private prototype preview.
2. Configure Node 22.12+ (24 recommended), run `npm ci`, build with `npm run build`, and start with `npm run start` on a Node host or use the standard Next.js platform adapter. The app uses Node runtime for image processing and submissions. Allow 120-second execution for the item form/job and at least 4 MB request bodies; do not increase the application's upload limit without considering hosting limits.
3. Set the environment variables **before building**; public CMS identifiers are build-time values. Apply the database migration and deploy Studio separately. Do not point preview forms at the real business inbox until ready to test them.
4. Configure the authenticated every-minute scheduler. No deployment or scheduler has been created automatically by this implementation.
5. Run the quality checks, publish one test CMS entry/photo, exercise upload and delivery success/failure paths against the actual services, and confirm inbox delivery, bucket privacy, and phone alternatives.
6. Confirm the provisional contact information, regular hours, social link, ownership/access, and inquiry retention policy with Sherri before a real launch. Existing `TODO(production)` notes remain in `config/business.ts`.

The prototype includes site metadata, canonical URLs, dynamic event sitemap entries, and existing LocalBusiness data. Event/announcement detail pages use Article markup rather than inventing venue, ticket, or attendance information. No event-rich-result eligibility is claimed.

## Quality checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run studio:build   # requires Studio public project/dataset identifiers
npm run test:browser   # run after website build; uses installed Chrome and local port 3100
npm audit
```

Unit/integration tests cover event filtering including Central Time, publication/visibility queries, form validation, photo content/size/metadata handling, storage failure recovery, notification retries, scheduler authorization, and the actual SQL migration in an embedded PostgreSQL engine. Browser checks cover desktop/mobile layout, automated WCAG checks, empty/404 states, form value/photo retention, safe unconfigured errors, and mobile keyboard navigation. Browser tests use no connected services; run them with an unconfigured CMS build. They never prove actual provider delivery, account permissions, or DNS.

Sanity Studio builds independently of the website. Scoped dependency overrides patch upstream Studio CLI dependencies; they are covered by the Studio build check. Next.js was upgraded from 16.2.9 to 16.3.6 after the dependency audit, and the current local documentation was checked for API changes.

## Future vendor portal boundary

The relational submission record and private object paths are independent of email and Sanity. A future authenticated vendor service can add memberships, explicit item-sharing/assignment records, field-limited reads, row-level policies, and short-lived authorized photo access without migrating submissions out of an inbox or public CMS. Contact information should remain restricted unless a future policy explicitly authorizes sharing it. No vendor access is granted by this prototype.

Intentionally deferred: ecommerce, checkout/payments, vendor accounts/authentication/dashboard/portal/bidding, vendor directory, inventory management, CRM, automated valuations, public submitted-item listings, visual CMS previews, and marketing automation.

## File map

- `app/`: existing pages/actions plus events, detail metadata, not-found UI, and protected maintenance endpoint.
- `components/`: existing layout/form/section components with focused CMS, upload, and accessibility changes; `StoreImage` selects editorial photos with local fallbacks.
- `lib/cms/`: typed content contracts, projected GROQ queries, server fetching, image URLs.
- `lib/events.ts`: Central Time visibility and display rules.
- `lib/forms/`: field parsing, rate limiting, photo limits, browser resizing, server image processing.
- `lib/submissions/`: private database/storage access, durable receipt, cleanup, and notification delivery.
- `studio/`: standalone editor, schemas, CLI configuration, environment example.
- `supabase/migrations/`: schema, access restrictions, atomic rate limiter, queue claim function, private bucket.
- `tests/`: unit, service-mocked integration, PostgreSQL migration, and browser/accessibility checks.
- `data/gallery.ts`: original local photo fallback used only while no CMS is configured. Hardcoded demo events were removed.

See [the implementation file inventory](docs/implementation-files.md) for the complete list of added, modified, and removed files.
