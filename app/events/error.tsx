"use client";
import Section from "@/components/ui/Section";
import { businessConfig } from "@/config/business";
import { submitButtonClasses } from "@/components/forms/formStyles";
export default function EventsError({ retry }: { retry: () => void }) {
  return <Section><h1 className="font-heading text-5xl text-(--olive)">The latest news is taking a moment.</h1><p className="mt-6 text-lg leading-8">Please try again, or call <a href={businessConfig.contact.phoneHref} className="text-(--burgundy) underline">{businessConfig.contact.phone}</a> for event information.</p><button onClick={retry} className={submitButtonClasses}>Try again</button></Section>;
}
