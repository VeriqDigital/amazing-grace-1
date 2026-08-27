import Image from "next/image";
import Section from "@/components/ui/Section";
import aboutImage from "@/public/images/shop/eclectic-store-display.jpg";

const collection = [
  "Antiques & collectibles",
  "Jewelry & home décor",
  "Vintage tools & clothing",
  "Fabrics & artisan goods",
];

const About = () => (
  <Section id="about" tone="ivory" className="border-b border-(--border)">
    <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
      <div className="relative mx-auto w-full max-w-xl pl-4 pt-4 lg:mx-0">
        <div className="absolute inset-0 -translate-x-4 -translate-y-4 border border-(--border-dark)" aria-hidden="true" />
        <figure className="relative aspect-[4/5] overflow-hidden bg-[#d7ccb9]">
          <Image
            src={aboutImage}
            alt="A richly layered display of vintage textiles, framed art, furniture, and home décor"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 90vw, 42vw"
          />
        </figure>
        <div className="absolute -bottom-7 right-0 bg-(--burgundy) px-6 py-5 text-(--cream) sm:right-[-2rem] sm:px-8">
          <p className="font-heading text-3xl italic leading-none">Always changing.</p>
          <p className="mt-2 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-white/65">Always worth another look.</p>
        </div>
      </div>

      <div className="lg:py-10">
        <p className="eyebrow text-(--burgundy)">The store</p>
        <h2 className="text-balance mt-5 max-w-2xl font-heading text-5xl font-medium leading-[0.92] tracking-[-0.035em] text-(--olive) sm:text-6xl lg:text-7xl">
          A store full of <span className="italic text-(--brown)">stories.</span>
        </h2>
        <div className="mt-8 grid gap-6 border-y border-(--border) py-8 sm:grid-cols-[1fr_1.15fr]">
          <p className="font-heading text-2xl italic leading-8 text-(--brown)">
            Every aisle holds a different era, a different craft, and something unexpected.
          </p>
          <p className="leading-7 text-(--muted)">
            Amazing Grace Antiques brings together a full house of vendors and a broad mix of pieces for the home, the collection, or simply the joy of discovery. Inventory moves often, so no two visits are quite the same.
          </p>
        </div>
        <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {collection.map((item, index) => (
            <li key={item} className="flex items-center gap-3 text-sm text-(--ink)">
              <span className="font-heading text-lg italic text-(--gold)" aria-hidden="true">0{index + 1}</span>
              <span className="h-px w-5 bg-(--border-dark)" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </Section>
);

export default About;
