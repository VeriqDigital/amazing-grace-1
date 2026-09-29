import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/ui/Section";
import { getEvents } from "@/lib/cms/client";
import { formatEventDate, formatEventTime, upcomingEvents } from "@/lib/events";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Events & Announcements",
  description: "Upcoming events and the latest news from Amazing Grace Antiques, a vendor mall in downtown Lufkin, Texas.",
  alternates: { canonical: "/events" },
  openGraph: { title: "Events & Announcements | Amazing Grace Antiques", description: "Gatherings and news from our Lufkin antique mall.", url: "/events" },
};

export default async function EventsPage() {
  const events = upcomingEvents(await getEvents());
  return <>
    <Section tone="olive">
      <p className="eyebrow text-(--gold-light)">Events & announcements</p>
      <h1 className="mt-5 max-w-4xl font-heading text-6xl font-medium leading-none sm:text-7xl">Happenings at Amazing Grace.</h1>
      <p className="mt-7 max-w-2xl text-lg leading-8 text-(--cream)/85">Plan a visit, join a gathering, or catch up on the latest news from the shop.</p>
    </Section>
    <Section>
      {!events.length && <p className="max-w-2xl text-lg leading-8 text-(--muted)">No upcoming events or announcements are posted right now. Check back soon, or <Link href="/contact" className="font-bold text-(--burgundy) underline">contact the shop</Link> before your visit.</p>}
      {(["announcement", "event"] as const).map((type) => {
        const items = events.filter((event) => event.type === type);
        return items.length ? <div key={type} className="mb-12 last:mb-0">
          <h2 className="font-heading text-4xl text-(--olive)">{type === "event" ? "Upcoming events" : "News from the shop"}</h2>
          <div className="mt-6 divide-y divide-(--border-dark) border-y border-(--border-dark)">
            {items.map((event) => <article key={event._id} className="grid gap-4 py-8 md:grid-cols-[15rem_1fr] md:gap-10">
              <div className="text-base leading-7 text-(--muted)"><p>{formatEventDate(event)}</p><p>{formatEventTime(event)}</p></div>
              <div><h3 className="font-heading text-4xl text-(--olive)"><Link href={`/events/${event.slug}`} className="underline decoration-(--border-dark) underline-offset-4 hover:text-(--burgundy)">{event.title}</Link></h3><p className="mt-4 max-w-3xl text-lg leading-8 text-(--muted)">{event.shortDescription}</p></div>
            </article>)}
          </div>
        </div> : null;
      })}
    </Section>
  </>;
}
