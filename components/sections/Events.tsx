import Section from "@/components/ui/Section";
import { storeEvents } from "@/data/events";

const Events = () => (
  <Section id="events" tone="olive" className="relative overflow-hidden">
    <div className="pointer-events-none absolute -right-24 -top-40 size-[30rem] rounded-full border border-white/10" aria-hidden="true" />
    <div className="relative grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
      <div>
        <p className="eyebrow text-(--gold-light)">Events & announcements</p>
        <h2 className="text-balance mt-5 font-heading text-5xl font-medium leading-[0.9] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
          Happenings at <span className="italic text-(--gold-light)">Amazing Grace.</span>
        </h2>
        <p className="mt-7 max-w-lg leading-8 text-(--cream)/65">
          Seasonal gatherings, special shop activities, and timely updates will have a home here. The examples shown are concept placeholders—not confirmed events.
        </p>
      </div>

      <div className="border-t border-white/25">
        {storeEvents.map((event, index) => (
          <article key={event.title} className="grid gap-5 border-b border-white/20 py-7 sm:grid-cols-[7.5rem_1fr_auto] sm:items-start sm:gap-7">
            <div>
              <p className="text-[0.61rem] font-bold uppercase tracking-[0.18em] text-(--gold-light)">{event.date}</p>
              <p className="mt-2 font-heading text-xl italic text-white/45">0{index + 1}</p>
            </div>
            <div>
              <h3 className="font-heading text-3xl font-medium text-white sm:text-4xl">{event.title}</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-(--cream)/60">{event.description}</p>
            </div>
            <span className="w-fit border border-white/20 px-3 py-2 text-[0.53rem] font-bold uppercase tracking-[0.16em] text-white/55">{event.note}</span>
          </article>
        ))}
      </div>
    </div>
  </Section>
);

export default Events;
