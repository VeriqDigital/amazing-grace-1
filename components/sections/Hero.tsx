import Image from "next/image";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { primaryCta } from "@/config/site";
import heroImage from "@/public/images/hero/shop-interior-furniture.jpg";

const Hero = () => (
  <section className="relative overflow-hidden border-b border-(--border) bg-(--cream)">
    <Container className="relative grid items-center gap-12 py-14 sm:py-20 lg:min-h-[700px] lg:grid-cols-[0.88fr_1.12fr] lg:gap-20 lg:py-20">
      <div className="relative z-10 max-w-2xl">
        <p className="eyebrow text-(--burgundy)">Antiques • Collectibles • Vintage</p>
        <h1 className="text-balance mt-6 font-heading text-[clamp(3.65rem,8.2vw,7.7rem)] font-medium leading-[0.82] tracking-[-0.05em] text-(--olive)">
          Timeless finds.
          <span className="mt-3 block font-normal italic">Stories worth keeping.</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-8 text-(--muted) xl:text-xl xl:leading-9">
          Wander through a wide-ranging collection of antiques, vintage pieces, jewelry, home décor, artisan goods, and the treasures you never knew you were looking for.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href={primaryCta.href}>{primaryCta.label}</Button>
          <Button href="/#sell" variant="outline">Sell an Antique</Button>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[640px]">
        <div className="hero-arch relative aspect-[4/5] overflow-hidden border border-(--border-dark) bg-[#d7ccb9]">
          <Image
            src={heroImage}
            alt="An inviting display of antique furniture, tableware, and décor inside Amazing Grace Antiques"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 90vw, 50vw"
            preload
          />
        </div>
      </div>
    </Container>
  </section>
);

export default Hero;
