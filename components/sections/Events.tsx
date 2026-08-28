import Section from "@/components/ui/Section";
import { storeEvents } from "@/data/events";

const Events = () => (
  <Section id="events" tone="olive" className="relative overflow-hidden">
    <div className="relative grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
      <div>
        <p className="eyebrow text-(--gold-light)">Events & announcements</p>
        <h2 className="text-balance mt-5 font-heading text-5xl font-medium leading-[0.9] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
          Happenings at Amazing Grace.
        </h2>
        <p className="mt-7 max-w-lg text-lg leading-8 text-(--cream)/75">
          Seasonal gatherings, special shop activities, and timely updates will have a home here.
        </p>
      </div>

      <div className="border-t border-white/25">
        {storeEvents.map((event) => (
          <article key={event.id} className="grid gap-4 border-b border-white/20 py-7 sm:grid-cols-[8.5rem_1fr] sm:items-start sm:gap-7">
            <div>
              <p className="text-sm font-bold text-(--gold-light)">{event.dateLabel}</p>
            </div>
            <div>
              <h3 className="font-heading text-3xl font-medium text-white sm:text-4xl">{event.title}</h3>
              <p className="mt-3 max-w-2xl text-[1.05rem] leading-7 text-(--cream)/80">{event.description}</p>
              {event.status === "sample" && (
                <p className="mt-3 text-sm text-(--gold-light)">Sample content for this website demo — not a confirmed event.</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  </Section>
);

export default Events;
