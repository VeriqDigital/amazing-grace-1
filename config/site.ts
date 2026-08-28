const defaultSiteUrl = "https://www.amazinggraceantiques.com";
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const socialImage = {
  url: "/opengraph-image.jpg",
  width: 1440,
  height: 1080,
  alt: "Amazing Grace Antiques in Lufkin, Texas",
} as const;

export const siteConfig = {
  name: "Amazing Grace Antiques",
  shortName: "Amazing Grace Antiques",
  description:
    "Explore antiques, collectibles, jewelry, home décor, vintage clothing, artisan pieces, and one-of-a-kind finds in downtown Lufkin, Texas.",
  locale: "en_US",
  siteUrl: (configuredSiteUrl || defaultSiteUrl).replace(/\/+$/, ""),
} as const;
