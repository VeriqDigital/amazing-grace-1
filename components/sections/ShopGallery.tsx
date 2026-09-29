import Image from "next/image";
import Section from "@/components/ui/Section";
import { galleryItems } from "@/data/gallery";
import { cmsConfigured, getGallery } from "@/lib/cms/client";
import { imageUrl } from "@/lib/cms/images";

const ShopGallery = async () => {
  const photos = await getGallery().catch(() => { console.error("Gallery unavailable."); return null; });
  const unavailable = photos === null;
  const cards = cmsConfigured ? (photos || []).flatMap((item, index) => {
    const url = imageUrl(item.image);
    return url ? [{ label: item.caption || "", image: url, alt: item.image.alt, key: item._id, className: galleryItems[index % galleryItems.length].className }] : [];
  }) : galleryItems.map((item) => ({ ...item, key: item.label }));
  return (
  <Section id="shop" tone="cream" className="border-b border-(--border)">
    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="font-heading text-5xl font-medium leading-none tracking-[-0.035em] text-(--olive) sm:text-6xl lg:text-7xl">
          From around the shop.
        </h2>
      </div>
      <p className="max-w-md text-base leading-7 text-(--muted) xl:text-lg xl:leading-8">
        A small peek across the many vendor booths, each full of character. Selections change as vendors bring in new finds to discover.
      </p>
    </div>

    <div className="gallery-grid mt-12">
      {cards.map((item) => (
        <figure key={item.key} className={item.className}>
          <Image src={item.image} alt={item.alt} fill className="gallery-image object-cover" sizes="(max-width: 639px) calc(100vw - 2.5rem), (max-width: 1023px) calc(50vw - 2.5rem), 34vw" />
          {item.label && <figcaption className="absolute bottom-0 left-0 bg-(--olive)/90 px-5 py-3 font-heading text-2xl font-medium text-white">{item.label}</figcaption>}
        </figure>
      ))}
    </div>
    {!cards.length && <p className="text-lg leading-8 text-(--muted)">{unavailable ? "Our photos are taking a little longer to load. Please check back soon." : "New glimpses of the vendor booths are coming soon. Stop by to see what’s waiting to be discovered."}</p>}
  </Section>
  );
};

export default ShopGallery;
