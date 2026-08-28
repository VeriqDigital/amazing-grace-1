# Amazing Grace Antiques

Client-ready traditional website demo for Amazing Grace Antiques in Lufkin, Texas.

## Development

```bash
npm run dev
```

The demo includes a responsive homepage, centralized business/gallery/event data, general contact and antique-submission forms, and local-business SEO. Ecommerce, live inventory, a CMS, and photo-upload storage are intentionally out of scope for this phase.

Set `NEXT_PUBLIC_SITE_URL` to the production origin at deployment so canonical and social metadata resolve correctly.

## Form email delivery

The `/contact` and `/sell` forms send messages server-side through the Resend Email API. Copy `.env.example` to `.env.local` and configure:

- `RESEND_API_KEY`: server-only Resend API key.
- `CONTACT_FROM_EMAIL`: sender using a domain verified in Resend, optionally with a display name.
- `CONTACT_TO_EMAIL`: store inbox that should receive website inquiries (normally `sherri@amazinggraceantiques.com`).

The recipient remains environment-configurable. If delivery is not configured, the forms give the visitor a visible error and the shop phone number. Photo upload on the antique form is intentionally disabled for the demo and needs storage/delivery configuration in the final build.
