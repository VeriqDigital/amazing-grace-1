import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";

const details = ["A few clear photos", "What you know about the piece", "Your preferred contact details"];

const SellAntiques = () => (
  <Section id="sell" tone="ivory" className="border-b border-(--border)">
    <div className="relative overflow-hidden border border-(--border-dark) bg-(--cream) px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
      <div className="absolute inset-y-0 right-0 hidden w-[38%] bg-(--burgundy) lg:block" aria-hidden="true" />
      <div className="absolute -right-16 top-1/2 hidden size-72 -translate-y-1/2 rounded-full border border-white/20 lg:block" aria-hidden="true" />
      <div className="relative grid items-center gap-12 lg:grid-cols-[1.18fr_0.82fr] lg:gap-20">
        <div>
          <p className="eyebrow text-(--burgundy)">Sell your antiques</p>
          <h2 className="text-balance mt-5 max-w-3xl font-heading text-5xl font-medium leading-[0.9] tracking-[-0.035em] text-(--olive) sm:text-6xl lg:text-7xl">
            Have something with <span className="italic text-(--brown)">a story?</span>
          </h2>
          <p className="mt-7 max-w-2xl text-base leading-8 text-(--muted)">
            If you have an antique or vintage item you are interested in selling, start by telling us a little about it. We can review the details and let you know the best next step.
          </p>
          <Button href="/contact#message" className="mt-8">Tell Us About Your Antique</Button>
        </div>

        <aside className="relative bg-(--ivory) p-7 shadow-[0_20px_60px_rgba(25,20,16,0.18)] sm:p-9" aria-label="What to include with an antique inquiry">
          <p className="font-heading text-3xl font-medium text-(--olive)">A helpful first note includes:</p>
          <ol className="mt-7 space-y-5">
            {details.map((detail, index) => (
              <li key={detail} className="flex items-center gap-4 border-b border-(--border) pb-5 text-sm text-(--ink) last:border-0 last:pb-0">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-(--gold) font-heading text-base italic text-(--brown)">0{index + 1}</span>
                {detail}
              </li>
            ))}
          </ol>
          <p className="mt-7 text-xs leading-6 text-(--muted)">Photo uploads are planned for a future phase. For now, the contact form provides a clean starting point.</p>
        </aside>
      </div>
    </div>
  </Section>
);

export default SellAntiques;
