# Amazing Grace Antiques

Traditional concept website for Amazing Grace Antiques in Lufkin, Texas.

## Development

```bash
npm run dev
```

This concept establishes the responsive homepage, editable business and gallery data, events/announcement placeholders, antique-selling inquiry path, and SEO foundation. Ecommerce, inventory, a CMS, and photo-upload storage are intentionally out of scope for this phase.

Set `NEXT_PUBLIC_SITE_URL` to the production origin at deployment so canonical and social metadata resolve correctly.

## Contact form email delivery

The `/contact` form sends messages server-side through the Resend Email API. Copy `.env.example` to `.env.local` and configure:

- `RESEND_API_KEY`: server-only Resend API key.
- `CONTACT_FROM_EMAIL`: sender using a domain verified in Resend, optionally with a display name.
- `CONTACT_TO_EMAIL`: store inbox that should receive website inquiries (normally `sherri@amazinggraceantiques.com`).

The recipient remains environment-configurable. If delivery is not configured, the form gives the visitor a visible error and the shop phone number.
