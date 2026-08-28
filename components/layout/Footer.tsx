import Link from "next/link";
import { footerLinks, siteConfig } from "@/config/site";

const Footer = () => (
  <footer className="border-t border-white/10 bg-(--olive-deep) text-(--cream)">
    <div className="mx-auto max-w-(--container-width) px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
      <div className="grid gap-12 border-b border-white/15 pb-14 lg:grid-cols-[1.35fr_0.7fr_1fr_0.8fr] lg:gap-10">
        <div>
          <p className="font-heading text-4xl leading-none sm:text-5xl">Amazing Grace</p>
          <p className="mt-2 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-(--gold-light)">Antiques</p>
          <p className="mt-7 max-w-sm text-base leading-7 text-(--cream)/70">
            A welcoming downtown Lufkin shop filled with antiques, collectibles, vintage pieces, and unexpected finds.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="eyebrow text-(--gold-light)">Explore</h2>
          <ul className="mt-6 space-y-3 text-base leading-7 text-(--cream)/75">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="transition hover:text-white">{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow text-(--gold-light)">Visit</h2>
          <address className="mt-6 not-italic text-base leading-7 text-(--cream)/75">
            <p>{siteConfig.contact.addressLine1}</p>
            <p>{siteConfig.contact.city}, {siteConfig.contact.state} {siteConfig.contact.postalCode}</p>
            <a href={siteConfig.contact.phoneHref} className="mt-4 block font-bold text-white hover:text-(--gold-light)">{siteConfig.contact.phone}</a>
            <a href={siteConfig.contact.emailHref} className="block break-all hover:text-white">{siteConfig.contact.email}</a>
          </address>
        </div>

        <div>
          <h2 className="eyebrow text-(--gold-light)">Hours</h2>
          <dl className="mt-6 space-y-2 text-base leading-7 text-(--cream)/75">
            {siteConfig.hoursSummary.map(({ days, hours }) => (
              <div key={days} className="flex justify-between gap-4"><dt>{days}</dt><dd className="text-white">{hours}</dd></div>
            ))}
          </dl>
          <a
            href={siteConfig.socialLinks[0].href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-(--gold-light) hover:text-white"
          >
            Follow on Facebook
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-7 text-sm leading-6 text-(--cream)/60 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
        <p>Website designed by <Link href="https://www.veriqdigital.com/" target="_blank" rel="noopener noreferrer" className="text-(--cream)/70 hover:text-white">Veriq</Link></p>
      </div>
    </div>
  </footer>
);

export default Footer;
