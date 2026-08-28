import type { Metadata } from "next";
import Image from "next/image";
import AntiqueForm from "@/components/contact/AntiqueForm";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { siteConfig, socialImage } from "@/config/site";
import chairImage from "@/public/images/shop/antique-rocking-chair.jpg";

export const metadata: Metadata = {
  title: "Sell an Antique",
  description:
    "Share details about an antique or vintage item you may be interested in selling to Amazing Grace Antiques in Lufkin, Texas.",
  alternates: { canonical: "/sell" },
  openGraph: {
    title: "Sell an Antique to Amazing Grace Antiques",
    description:
      "Send Amazing Grace Antiques the details of an antique or vintage piece for review.",
    url: "/sell",
    siteName: siteConfig.shortName,
    locale: siteConfig.locale,
    type: "website",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sell an Antique to Amazing Grace Antiques",
    description: "Send Amazing Grace Antiques the details of an antique or vintage piece for review.",
    images: [socialImage.url],
  },
};

export default function SellPage() {
  return (
    <>
      <section className="border-b border-white/15 bg-(--olive) py-16 text-(--cream) sm:py-20 lg:py-24">
        <Container>
          <div className="max-w-4xl">
            <p className="eyebrow text-(--gold-light)">Sell your antiques</p>
            <h1 className="text-balance mt-5 font-heading text-6xl font-medium leading-[0.86] tracking-[-0.045em] sm:text-7xl lg:text-8xl">
              Have a piece with <span className="italic">a story?</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-(--cream)/75">
              Tell Amazing Grace a little about the item. The shop will review your note and let you know whether a conversation makes sense.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-(--ivory) py-16 sm:py-20 lg:py-28">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <AntiqueForm />

            <aside className="space-y-6" aria-label="Antique submission information">
              <figure className="relative aspect-[4/5] overflow-hidden border border-(--border-dark) bg-[#d7ccb9]">
                <Image src={chairImage} alt="Antique wooden rocking chair displayed inside Amazing Grace Antiques" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 38vw" />
              </figure>

              <div className="border border-(--border-dark) bg-(--cream) p-7 sm:p-9">
                <p className="eyebrow text-(--burgundy)">What happens next</p>
                <h2 className="mt-3 font-heading text-4xl font-medium text-(--olive)">A simple first conversation.</h2>
                <p className="mt-5 leading-7 text-(--muted)">
                  Amazing Grace will review the information and follow up using your preferred contact method. Submitting an item does not promise a purchase or appraisal.
                </p>
              </div>

              <div className="border border-(--border-dark) bg-(--cream) p-7 sm:p-9">
                <p className="eyebrow text-(--burgundy)">Prefer to talk?</p>
                <a href={siteConfig.contact.phoneHref} className="mt-4 block font-heading text-3xl font-medium text-(--burgundy) hover:text-(--brown)">{siteConfig.contact.phone}</a>
                <p className="mt-3 text-sm leading-6 text-(--muted)">You can also call the shop during regular store hours.</p>
                <Button href="/contact" variant="outline" className="mt-6">General Contact</Button>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
