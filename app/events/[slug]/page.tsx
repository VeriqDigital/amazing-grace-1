import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { getEvent } from "@/lib/cms/client";
import { imageUrl } from "@/lib/cms/images";
import { formatEventDate, formatEventTime, isCurrentEvent, safeExternalUrl } from "@/lib/events";
import { siteConfig } from "@/config/site";

export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Event not found", robots: { index: false } };
  const url = `/events/${event.slug}`;
  const photo = imageUrl(event.image, 1200, 630);
  return { title: event.title, description: event.shortDescription, alternates: { canonical: url }, openGraph: { title: event.title, description: event.shortDescription, url, ...(photo ? { images: [{ url: photo, alt: event.image!.alt }] } : {}) }, twitter: { card: "summary_large_image", title: event.title, description: event.shortDescription, ...(photo ? { images: [photo] } : {}) } };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();
  const photo = imageUrl(event.image, 1600, 1200);
  const link = safeExternalUrl(event.link?.url);
  // Article markup suits both announcements and events without inventing venue/ticket details.
  const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: event.title, description: event.shortDescription, dateModified: event._updatedAt, url: `${siteConfig.siteUrl}/events/${event.slug}`, publisher: { "@type": "Organization", name: siteConfig.name }, ...(photo ? { image: photo } : {}) };
  return <Section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <div className="mx-auto max-w-3xl">
      <p className="eyebrow text-(--burgundy)">{event.type === "event" ? "Event" : "Announcement"}</p>
      <h1 className="mt-5 font-heading text-5xl font-medium leading-none text-(--olive) sm:text-7xl">{event.title}</h1>
      <p className="mt-7 text-lg leading-8 text-(--muted)">{formatEventDate(event)}{formatEventTime(event) && <><br />{formatEventTime(event)}</>}</p>
      {!isCurrentEvent(event) && <p className="mt-5 border-l-2 border-(--burgundy) pl-4 text-lg text-(--burgundy)">This {event.type === "event" ? "event has ended" : "announcement is no longer current"}.</p>}
      <p className="mt-7 text-xl leading-9 text-(--muted)">{event.shortDescription}</p>
      {photo && <Image src={photo} alt={event.image!.alt} width={1600} height={1200} sizes="(max-width: 800px) 100vw, 768px" className="mt-8 h-auto w-full border border-(--border-dark)" />}
      {event.body && <div className="event-content mt-8 text-lg leading-8 text-(--ink)"><PortableText value={event.body} /></div>}
      <div className="mt-10 flex flex-wrap gap-4">{link && <Button href={link} newTab>{event.link!.label}</Button>}<Button href="/events" variant="outline">All Events & Announcements</Button></div>
    </div>
  </Section>;
}
