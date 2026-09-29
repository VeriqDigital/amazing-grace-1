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
    "Discover antiques, vintage finds, and décor from nearly 70 independent vendors at Amazing Grace Antiques, a welcoming antique mall in downtown Lufkin, Texas.",
  locale: "en_US",
  siteUrl: (configuredSiteUrl || defaultSiteUrl).replace(/\/+$/, ""),
} as const;
