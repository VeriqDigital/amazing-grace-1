import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";

const details = ["A few clear photos", "What you know about the piece", "Your preferred contact details"];

const SellAntiques = () => (
  <Section id="sell" tone="ivory" className="border-b border-(--border)">
    <div className="relative overflow-hidden border border-(--border-dark) bg-(--cream) px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
      <div className="absolute inset-y-0 right-0 hidden w-[38%] bg-(--burgundy) lg:block" aria-hidden="true" />
      <div className="relative grid items-center gap-12 lg:grid-cols-[1.18fr_0.82fr] lg:gap-20">
        <div>
          <p className="eyebrow text-(--burgundy)">Sell your antiques</p>
          <h2 className="text-balance mt-5 max-w-3xl font-heading text-5xl font-medium leading-[0.9] tracking-[-0.035em] text-(--olive) sm:text-6xl lg:text-7xl">
            Have something with <span className="italic">a story?</span>
          </h2>
          <p className="mt-7 max-w-2xl text-[1.05rem] leading-8 text-(--muted)">
            If you have an antique or vintage item you are interested in selling, start by telling us a little about it. We can review the details and let you know the best next step.
          </p>
          <Button href="/sell#antique-inquiry" className="mt-8">Tell Us About Your Antique</Button>
        </div>

        <aside className="relative border border-(--border-dark) bg-(--ivory) p-7 sm:p-9" aria-label="What to include with an antique inquiry">
          <p className="font-heading text-3xl font-medium text-(--olive)">A helpful first note includes:</p>
          <ul className="mt-7 space-y-4">
            {details.map((detail) => (
              <li key={detail} className="border-b border-(--border) pb-4 text-base leading-6 text-(--ink) last:border-0 last:pb-0">
                {detail}
              </li>
            ))}
          </ul>
          <p className="mt-7 text-base leading-7 text-(--muted)">Use the item form to share the details now. Photo upload will be connected in the final build.</p>
        </aside>
      </div>
    </div>
  </Section>
);

export default SellAntiques;
