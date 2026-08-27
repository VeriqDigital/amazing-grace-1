"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContactForm } from "@/app/contact/actions";
import {
  contactSubjects,
  initialContactFormState,
} from "@/app/contact/contact-form-state";

const fieldClasses =
  "mt-2 w-full border border-(--border-dark) bg-(--cream) px-4 py-3.5 text-base text-(--ink) outline-none transition placeholder:text-(--muted)/65 focus:border-(--burgundy) focus:ring-2 focus:ring-(--burgundy)/10 aria-[invalid=true]:border-(--burgundy)";

const ContactForm = () => {
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    initialContactFormState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status, state.submittedAt]);

  return (
    <form
      id="message"
      ref={formRef}
      action={formAction}
      className="scroll-mt-32 border border-(--border-dark) bg-(--cream) p-6 sm:p-9 lg:p-12"
    >
      <div className="border-b border-(--border) pb-7">
        <p className="eyebrow text-(--burgundy)">Write to us</p>
        <h2 className="mt-3 font-heading text-4xl font-medium text-(--olive) sm:text-5xl">Send a message</h2>
        <p className="mt-4 max-w-2xl leading-7 text-(--muted)">
          Ask about the shop, plan a visit, or tell us about an antique you may be interested in selling.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="text-xs font-bold uppercase tracking-[0.12em] text-(--ink)">
            Name <span className="text-(--burgundy)" aria-hidden="true">*</span>
          </label>
          <input id="contact-name" name="name" type="text" required minLength={2} maxLength={100} autoComplete="name" className={fieldClasses} aria-invalid={Boolean(state.fieldErrors?.name)} aria-describedby={state.fieldErrors?.name ? "contact-name-error" : undefined} />
          {state.fieldErrors?.name && <p id="contact-name-error" className="mt-2 text-sm text-(--burgundy)">{state.fieldErrors.name}</p>}
        </div>

        <div>
          <label htmlFor="contact-email" className="text-xs font-bold uppercase tracking-[0.12em] text-(--ink)">
            Email <span className="text-(--burgundy)" aria-hidden="true">*</span>
          </label>
          <input id="contact-email" name="email" type="email" required maxLength={254} autoComplete="email" inputMode="email" className={fieldClasses} aria-invalid={Boolean(state.fieldErrors?.email)} aria-describedby={state.fieldErrors?.email ? "contact-email-error" : undefined} />
          {state.fieldErrors?.email && <p id="contact-email-error" className="mt-2 text-sm text-(--burgundy)">{state.fieldErrors.email}</p>}
        </div>

        <div>
          <label htmlFor="contact-phone" className="text-xs font-bold uppercase tracking-[0.12em] text-(--ink)">
            Phone <span className="font-normal normal-case tracking-normal text-(--muted)">(optional)</span>
          </label>
          <input id="contact-phone" name="phone" type="tel" maxLength={30} autoComplete="tel" inputMode="tel" className={fieldClasses} aria-invalid={Boolean(state.fieldErrors?.phone)} aria-describedby={state.fieldErrors?.phone ? "contact-phone-error" : undefined} />
          {state.fieldErrors?.phone && <p id="contact-phone-error" className="mt-2 text-sm text-(--burgundy)">{state.fieldErrors.phone}</p>}
        </div>

        <div>
          <label htmlFor="contact-subject" className="text-xs font-bold uppercase tracking-[0.12em] text-(--ink)">
            Inquiry type <span className="text-(--burgundy)" aria-hidden="true">*</span>
          </label>
          <select id="contact-subject" name="subject" required defaultValue="" className={fieldClasses} aria-invalid={Boolean(state.fieldErrors?.subject)} aria-describedby={state.fieldErrors?.subject ? "contact-subject-error" : undefined}>
            <option value="" disabled>Select a topic</option>
            {contactSubjects.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          {state.fieldErrors?.subject && <p id="contact-subject-error" className="mt-2 text-sm text-(--burgundy)">{state.fieldErrors.subject}</p>}
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-[0.12em] text-(--ink)">
          Message <span className="text-(--burgundy)" aria-hidden="true">*</span>
        </label>
        <textarea id="contact-message" name="message" required minLength={10} maxLength={3000} rows={7} placeholder="If you’re asking about an item, include its type, condition, and approximate age if known." className={`${fieldClasses} resize-y`} aria-invalid={Boolean(state.fieldErrors?.message)} aria-describedby={state.fieldErrors?.message ? "contact-message-error" : undefined} />
        {state.fieldErrors?.message && <p id="contact-message-error" className="mt-2 text-sm text-(--burgundy)">{state.fieldErrors.message}</p>}
      </div>

      <div className="absolute left-[-10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.message && (
        <div className={`mt-6 border-l-2 px-4 py-3 text-sm leading-6 ${state.status === "success" ? "border-(--olive) bg-[#edf3e9] text-(--olive)" : "border-(--burgundy) bg-[#f8ecee] text-(--burgundy)"}`} role={state.status === "error" ? "alert" : "status"} aria-live="polite">
          {state.message}
        </div>
      )}

      <button type="submit" disabled={pending} className="button group mt-7 inline-flex min-h-12 items-center justify-center gap-3 border border-(--olive) bg-(--olive) px-6 py-3 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-(--cream) transition hover:border-(--olive-light) hover:bg-(--olive-light) disabled:cursor-wait disabled:opacity-60">
        <span>{pending ? "Sending…" : "Send Message"}</span><span aria-hidden="true">→</span>
      </button>
    </form>
  );
};

export default ContactForm;
