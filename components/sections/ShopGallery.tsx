import Image from "next/image";
import Section from "@/components/ui/Section";
import { galleryItems } from "@/data/gallery";

const ShopGallery = () => (
  <Section id="shop" tone="cream" className="border-b border-(--border)">
    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="font-heading text-5xl font-medium leading-none tracking-[-0.035em] text-(--olive) sm:text-6xl lg:text-7xl">
          From around the shop.
        </h2>
      </div>
      <p className="max-w-md text-base leading-7 text-(--muted) xl:text-lg xl:leading-8">
        Inventory changes frequently. Think of these as a small peek at the kinds of character-filled pieces waiting to be discovered.
      </p>
    </div>

    <div className="gallery-grid mt-12">
      {galleryItems.map((item) => (
        <figure key={item.label} className={item.className}>
          <Image src={item.image} alt={item.alt} fill className="gallery-image object-cover" sizes="(max-width: 639px) calc(100vw - 2.5rem), (max-width: 1023px) calc(50vw - 2.5rem), 34vw" />
          <figcaption className="absolute bottom-0 left-0 bg-(--olive)/90 px-5 py-3 font-heading text-2xl font-medium text-white">{item.label}</figcaption>
        </figure>
      ))}
    </div>
  </Section>
);

export default ShopGallery;
