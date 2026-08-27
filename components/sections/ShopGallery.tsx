import Image from "next/image";
import Section from "@/components/ui/Section";
import { shopGallery } from "@/data/shop-gallery";

const ShopGallery = () => (
  <Section id="shop" tone="cream" className="border-b border-(--border)">
    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="eyebrow text-(--burgundy)">A glimpse inside</p>
        <h2 className="mt-4 font-heading text-5xl font-medium leading-none tracking-[-0.035em] text-(--olive) sm:text-6xl lg:text-7xl">
          From around <span className="italic text-(--brown)">the shop.</span>
        </h2>
      </div>
      <p className="max-w-md border-l border-(--gold) pl-5 text-sm leading-7 text-(--muted)">
        Inventory changes frequently. Think of these as a small peek at the kinds of character-filled pieces waiting to be discovered.
      </p>
    </div>

    <div className="gallery-grid mt-12">
      {shopGallery.map((item, index) => (
        <figure key={item.label} className={item.className}>
          <Image src={item.image} alt={item.alt} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 34vw" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/75 via-black/15 to-transparent px-5 pb-5 pt-20 text-white">
            <figcaption className="font-heading text-2xl font-medium">{item.label}</figcaption>
            <span className="text-[0.58rem] font-bold tracking-[0.2em] text-white/70" aria-hidden="true">0{index + 1}</span>
          </div>
        </figure>
      ))}
    </div>

    <p className="mt-8 text-center font-heading text-2xl italic text-(--brown)">
      The best finds are usually the ones you meet in person.
    </p>
  </Section>
);

export default ShopGallery;
