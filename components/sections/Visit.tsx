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
      </figure>

      <div className="flex flex-col justify-between bg-(--ivory) p-7 sm:p-10 lg:p-14">
        <div>
          <h2 className="font-heading text-5xl font-medium leading-[0.9] tracking-[-0.035em] text-(--olive) sm:text-6xl">
            Visit the store.
          </h2>
          <address className="mt-8 not-italic text-[1.05rem] leading-8 text-(--muted) xl:text-lg">
            <p className="text-lg font-bold text-(--ink)">{siteConfig.contact.addressLine1}</p>
            <p>{siteConfig.contact.city}, {siteConfig.contact.state} {siteConfig.contact.postalCode}</p>
            <a href={siteConfig.contact.phoneHref} className="mt-5 block font-heading text-3xl font-medium text-(--burgundy) hover:text-(--brown)">{siteConfig.contact.phone}</a>
            <a href={siteConfig.contact.emailHref} className="mt-2 block break-all font-bold text-(--ink) hover:text-(--burgundy)">{siteConfig.contact.email}</a>
          </address>
        </div>

        <div className="mt-10">
          <div className="border-y border-(--border) py-6">
            {siteConfig.hoursSummary.map(({ days, hours }, index) => (
              <div key={days} className={`flex items-center justify-between gap-4 text-[1.05rem] leading-7 xl:text-lg ${index > 0 ? "mt-3" : ""}`}>
                <span className="text-(--muted)">{days}</span><strong>{hours}</strong>
              </div>
            ))}
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
