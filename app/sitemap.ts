import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getEvents } from "@/lib/cms/client";

export const revalidate = 60;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getEvents();
  return [
    { url: `${siteConfig.siteUrl}/events`, changeFrequency: "weekly", priority: 0.8 },
    ...events.map((event) => ({ url: `${siteConfig.siteUrl}/events/${event.slug}`, lastModified: event._updatedAt })),
    {
      url: siteConfig.siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.siteUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.siteUrl}/sell`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
