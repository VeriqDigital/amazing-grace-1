# Amazing Grace Antiques

Client-ready traditional website demo for Amazing Grace Antiques in Lufkin, Texas.

## Development

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Project structure

- `app/`: App Router pages, metadata, redirects, and route-specific Server Actions/state.
- `components/forms/`: explicit contact and antique forms plus small shared form primitives.
- `components/layout/`, `components/sections/`, `components/ui/`: shared layout, homepage sections, and UI primitives.
- `config/site.ts`: site identity, canonical URL, and social image metadata.
- `config/business.ts`: contact details, hours, announcement, and social links.
- `config/navigation.ts`: primary navigation, footer links, and shared CTA destinations.
- `data/`: editorial content such as events and gallery items.
- `lib/email.ts`: shared Resend delivery integration.
- `lib/forms/validation.ts`: low-level form extraction and validation helpers.

## Environment variables

Copy `.env.example` to `.env.local` and configure:

- `NEXT_PUBLIC_SITE_URL`: production origin used for canonical, sitemap, and social metadata.
- `RESEND_API_KEY`: server-only Resend API key.
- `CONTACT_FROM_EMAIL`: sender using a domain verified in Resend, optionally with a display name.
- `CONTACT_TO_EMAIL`: store inbox that receives both website forms.

If delivery is not configured, the forms show a visitor-safe error and the shop phone number. The antique photo upload remains an intentional placeholder until storage and delivery are configured. Ecommerce, live inventory, and a CMS are out of scope for this phase.

Before launch, review the `TODO(production)` notes in `config/business.ts` and replace or confirm all provisional client details and demo event content.
