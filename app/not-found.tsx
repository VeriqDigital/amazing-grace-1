import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
export default function NotFound() { return <Section><h1 className="font-heading text-5xl text-(--olive)">We couldn’t find that page.</h1><p className="mt-6 text-lg leading-8 text-(--muted)">It may have moved or is no longer available.</p><div className="mt-8 flex flex-wrap gap-4"><Button href="/">Back to Home</Button><Button href="/events" variant="outline">Events & Announcements</Button></div></Section>; }
