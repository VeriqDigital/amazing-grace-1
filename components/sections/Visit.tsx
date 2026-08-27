import Image from "next/image";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import { siteConfig } from "@/config/site";
import storefrontImage from "@/public/images/branding/storefront-sign.jpg";

const Visit = () => (
  <Section id="visit" tone="cream">
    <div className="grid items-stretch gap-0 border border-(--border-dark) lg:grid-cols-[1.05fr_0.95fr]">
      <figure className="relative min-h-[25rem] overflow-hidden bg-[#d7ccb9] lg:min-h-[42rem]">
        <Image
          src={storefrontImage}
          alt="Amazing Grace Antiques storefront and floral sign at 205 East Frank Avenue in Lufkin"
          fill
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 54vw"
        />
        <div className="absolute inset-0 bg-(--olive)/10" />
        <figcaption className="absolute bottom-5 left-5 bg-(--cream)/95 px-4 py-3 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-(--olive)">
          Look for the floral sign
        </figcaption>
      </figure>

      <div className="flex flex-col justify-between bg-(--ivory) p-7 sm:p-10 lg:p-14">
        <div>
          <p className="eyebrow text-(--burgundy)">Come see what’s here</p>
          <h2 className="mt-5 font-heading text-5xl font-medium leading-[0.9] tracking-[-0.035em] text-(--olive) sm:text-6xl">
            Visit the <span className="italic text-(--brown)">store.</span>
          </h2>
          <address className="mt-8 not-italic text-base leading-8 text-(--muted)">
            <p className="font-bold text-(--ink)">{siteConfig.contact.addressLine1}</p>
            <p>{siteConfig.contact.city}, {siteConfig.contact.state} {siteConfig.contact.postalCode}</p>
            <a href={siteConfig.contact.phoneHref} className="mt-5 block font-heading text-3xl font-medium text-(--burgundy) hover:text-(--brown)">{siteConfig.contact.phone}</a>
            <a href={siteConfig.contact.emailHref} className="mt-1 block break-all text-sm hover:text-(--burgundy)">{siteConfig.contact.email}</a>
          </address>
        </div>

        <div className="mt-10">
          <div className="border-y border-(--border) py-6">
            <div className="flex items-center justify-between gap-4 text-sm"><span className="text-(--muted)">Monday–Saturday</span><strong>10am–5pm</strong></div>
            <div className="mt-3 flex items-center justify-between gap-4 text-sm"><span className="text-(--muted)">Sunday</span><strong>Closed</strong></div>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href={siteConfig.contact.mapUrl} newTab>Get Directions</Button>
            <Button href={siteConfig.socialLinks[0].href} newTab variant="outline">Facebook</Button>
          </div>
        </div>
      </div>
    </div>
  </Section>
);

export default Visit;
