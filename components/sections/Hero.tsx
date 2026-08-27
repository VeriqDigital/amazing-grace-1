import Image from "next/image";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import heroImage from "@/public/images/hero/shop-interior-furniture.jpg";
import signImage from "@/public/images/branding/store-sign-close.jpg";

const Hero = () => (
  <section className="relative overflow-hidden border-b border-(--border) bg-(--cream)">
    <div className="pointer-events-none absolute -left-8 top-1/2 hidden -translate-y-1/2 font-heading text-[12rem] italic leading-none text-(--olive)/[0.035] lg:block" aria-hidden="true">
      AG
    </div>
    <Container className="relative grid min-h-[calc(100svh-114px)] items-center gap-14 py-14 sm:py-20 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20 lg:py-24">
      <div className="relative z-10 max-w-2xl">
        <p className="eyebrow ornament text-(--burgundy)">Antiques · Collectibles · Vintage</p>
        <h1 className="text-balance mt-7 font-heading text-[clamp(4rem,8.2vw,7.7rem)] font-medium leading-[0.78] tracking-[-0.055em] text-(--olive)">
          Timeless finds.
          <span className="mt-3 block font-normal italic text-(--burgundy)">Stories worth keeping.</span>
        </h1>
        <p className="mt-8 max-w-xl text-base leading-8 text-(--muted) sm:text-lg">
          Wander through a wide-ranging collection of antiques, vintage pieces, jewelry, home décor, artisan goods, and the treasures you never knew you were looking for.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href="/#visit">Visit the Shop</Button>
          <Button href="/#sell" variant="outline">Sell an Antique</Button>
        </div>
        <div className="mt-12 flex items-center gap-4 text-[0.64rem] font-bold uppercase tracking-[0.18em] text-(--muted)">
          <span className="font-heading text-2xl font-medium italic tracking-normal text-(--gold)">No. 01</span>
          <span className="h-px w-12 bg-(--border-dark)" />
          <span>Downtown Lufkin, Texas</span>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[660px] pb-9 pl-4 pr-5 pt-4 sm:pl-12 sm:pr-10 lg:pb-12">
        <div className="absolute inset-x-0 bottom-0 top-14 border border-(--gold)" aria-hidden="true" />
        <div className="hero-arch relative aspect-[4/5] overflow-hidden bg-[#d7ccb9] shadow-[0_24px_70px_rgba(45,39,29,0.16)]">
          <Image
            src={heroImage}
            alt="An inviting display of antique furniture, tableware, and décor inside Amazing Grace Antiques"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 90vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-(--olive)/5" />
        </div>
        <div className="absolute bottom-0 right-0 size-28 overflow-hidden rounded-full border-[6px] border-(--cream) bg-(--cream) shadow-lg sm:size-36 lg:-right-2 lg:size-40">
          <Image src={signImage} alt="Amazing Grace Antiques floral storefront sign" fill className="object-cover" sizes="160px" />
        </div>
        <p className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-[58%] rotate-90 text-[0.58rem] font-bold uppercase tracking-[0.32em] text-(--brown) xl:block">
          Curious pieces · Warm welcome
        </p>
      </div>
    </Container>
  </section>
);

export default Hero;
