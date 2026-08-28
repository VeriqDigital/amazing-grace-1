import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/forms/ContactForm";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { businessConfig } from "@/config/business";
import { siteConfig, socialImage } from "@/config/site";
import signImage from "@/public/images/branding/store-sign-close.jpg";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Amazing Grace Antiques in Lufkin, Texas, ask a question, or plan a store visit.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Amazing Grace Antiques",
    description:
      "Ask about the shop, an item, an event, or an upcoming visit to Amazing Grace Antiques.",
    url: "/contact",
    siteName: siteConfig.shortName,
    locale: siteConfig.locale,
    type: "website",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Amazing Grace Antiques",
    description: "Ask about the shop, an item, an event, or an upcoming visit.",
    images: [socialImage.url],
  },
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-white/15 bg-(--olive) py-16 text-(--cream) sm:py-20 lg:py-24">
        <Container>
          <div>
            <div className="max-w-4xl">
              <p className="eyebrow text-(--gold-light)">Contact the shop</p>
              <h1 className="text-balance mt-5 font-heading text-6xl font-medium leading-[0.86] tracking-[-0.045em] sm:text-7xl lg:text-8xl">
                Let’s talk about <span className="italic">what you found.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-(--cream)/65">
                Questions about the shop, its current inventory, events, and upcoming visits are welcome. Send a note below or reach the shop directly.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-(--ivory) py-16 sm:py-20 lg:py-28">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <ContactForm />

            <aside className="space-y-6" aria-label="Amazing Grace Antiques store information">
              <figure className="relative aspect-square overflow-hidden border border-(--border-dark) bg-[#d7ccb9]">
                <Image src={signImage} alt="Amazing Grace Antiques floral storefront sign" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
              </figure>

              <div className="border border-(--border-dark) bg-(--cream) p-7 sm:p-9">
                <p className="eyebrow text-(--burgundy)">Visit or call</p>
                <h2 className="mt-3 font-heading text-4xl font-medium text-(--olive)">{siteConfig.name}</h2>
                <address className="mt-6 not-italic leading-7 text-(--muted)">
                  <p>{businessConfig.contact.addressLine1}</p>
                  <p>{businessConfig.contact.city}, {businessConfig.contact.state} {businessConfig.contact.postalCode}</p>
                  <a href={businessConfig.contact.phoneHref} className="mt-5 block font-heading text-3xl font-medium text-(--burgundy) hover:text-(--brown)">{businessConfig.contact.phone}</a>
                  <a href={businessConfig.contact.emailHref} className="mt-1 block break-all text-base hover:text-(--burgundy)">{businessConfig.contact.email}</a>
                </address>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                  <Button href={businessConfig.contact.mapUrl} newTab>Get Directions</Button>
                  <Button href={businessConfig.contact.phoneHref} variant="outline">Call the Shop</Button>
                </div>
              </div>

              <div className="border border-(--border-dark) bg-(--cream) p-7 sm:p-9">
                <p className="eyebrow text-(--burgundy)">Store hours</p>
                <dl className="mt-6 space-y-3 text-base">
                  {businessConfig.hours.map(({ day, hours }) => (
                    <div key={day} className="flex justify-between gap-5 border-b border-(--border) pb-3 last:border-0 last:pb-0">
                      <dt className="text-(--muted)">{day}</dt>
                      <dd className="font-bold text-(--ink)">{hours}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 text-sm leading-6 text-(--muted)">Holiday hours may vary. Call ahead before making a long trip.</p>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
