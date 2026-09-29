import Link from "next/link";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { getEvents } from "@/lib/cms/client";
import { formatEventDate, formatEventTime, upcomingEvents } from "@/lib/events";

export default async function Events() {
  const events = await getEvents().catch(() => { console.error("Homepage events unavailable."); return null; });
  const unavailable = events === null;
  const current = upcomingEvents(events || [], new Date(), true).slice(0, 3);
  return (
    <Section id="events" tone="olive" className="relative overflow-hidden">
      <div className="relative grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <div>
          <p className="eyebrow text-(--gold-light)">Events & announcements</p>
          <h2 className="text-balance mt-5 font-heading text-5xl font-medium leading-[0.9] tracking-[-0.035em] sm:text-6xl lg:text-7xl">Happenings at Amazing Grace.</h2>
          <p className="mt-7 max-w-lg text-lg leading-8 text-(--cream)/85 xl:text-xl xl:leading-9">Seasonal gatherings, special shop activities, and the latest news from around the booths.</p>
          <Button href="/events" variant="light" className="mt-7">All Events & Announcements</Button>
        </div>
        <div className="border-t border-white/25">
          {current.length ? current.map((event) => (
            <article key={event._id} className="grid gap-4 border-b border-white/20 py-7 sm:grid-cols-[8.5rem_1fr] sm:items-start sm:gap-7">
              <p className="text-base font-bold text-(--gold-light)">{formatEventDate(event)}</p>
              <div>
                <h3 className="font-heading text-3xl font-medium text-white sm:text-4xl"><Link href={`/events/${event.slug}`} className="underline decoration-white/40 underline-offset-4 hover:decoration-white">{event.title}</Link></h3>
                {formatEventTime(event) && <p className="mt-3 text-base text-(--gold-light)">{formatEventTime(event)}</p>}
                <p className="mt-3 max-w-2xl text-[1.05rem] leading-7 text-(--cream)/85 xl:text-lg xl:leading-8">{event.shortDescription}</p>
              </div>
            </article>
          )) : <p className="py-7 text-lg leading-8 text-(--cream)/85">{unavailable ? "We’re having trouble loading the latest news. Please check back soon or call the shop." : "No upcoming events are posted just yet. Check back for the next gathering and news from the shop."}</p>}
        </div>
      </div>
    </Section>
  );
}
