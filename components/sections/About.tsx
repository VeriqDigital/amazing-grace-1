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
      <div className="relative mx-auto w-full max-w-xl lg:mx-0">
        <figure className="relative aspect-[4/5] overflow-hidden border border-(--border-dark) bg-[#d7ccb9]">
          <Image
            src={aboutImage}
            alt="A richly layered display of vintage textiles, framed art, furniture, and home décor"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 90vw, 42vw"
          />
        </figure>
      </div>

      <div className="lg:py-10">
        <h2 className="text-balance max-w-2xl font-heading text-5xl font-medium leading-[0.92] tracking-[-0.035em] text-(--olive) sm:text-6xl lg:text-7xl">
          A store full of stories.
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_1.15fr]">
          <p className="font-heading text-2xl leading-8 text-(--olive)">
            Every aisle holds a different era, a different craft, and something unexpected.
          </p>
          <p className="text-[1.05rem] leading-8 text-(--muted)">
            Amazing Grace Antiques brings together a full house of vendors and a broad mix of pieces for the home, the collection, or simply the joy of discovery. Inventory moves often, so no two visits are quite the same.
          </p>
        </div>
        <ul className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {collection.map((item) => (
            <li key={item} className="text-base font-bold leading-6 text-(--ink)">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </Section>
);

export default About;
