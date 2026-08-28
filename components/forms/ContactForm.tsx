"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { submitContactForm } from "@/app/contact/actions";
import {
  contactSubjects,
  initialContactFormState,
} from "@/app/contact/contact-form-state";
import FormField from "./FormField";
import FormStatus from "./FormStatus";
import HoneypotField from "./HoneypotField";
import {
  fieldClasses,
  formClasses,
  submitButtonClasses,
} from "./formStyles";

const ContactForm = () => {
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    initialContactFormState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      return;
    }

    if (state.status === "error" && state.fieldErrors) {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }
  }, [state]);

  return (
    <form
      id="message"
      ref={formRef}
      action={formAction}
      aria-busy={pending}
      className={formClasses}
    >
      <div className="border-b border-(--border) pb-7">
        <p className="eyebrow text-(--burgundy)">Write to us</p>
        <h2 className="mt-3 font-heading text-4xl font-medium text-(--olive) sm:text-5xl">Send a message</h2>
        <p className="mt-4 max-w-2xl leading-7 text-(--muted)">
          Ask about the shop, an item in the store, an event, or an upcoming visit. To offer an item for sale, use our dedicated item submission form.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <FormField id="contact-name" label="Name" required error={state.fieldErrors?.name}>
          {(accessibilityProps) => (
            <input id="contact-name" name="name" type="text" required minLength={2} maxLength={100} autoComplete="name" className={fieldClasses} {...accessibilityProps} />
          )}
        </FormField>

        <FormField id="contact-email" label="Email" required error={state.fieldErrors?.email}>
          {(accessibilityProps) => (
            <input id="contact-email" name="email" type="email" required maxLength={254} autoComplete="email" inputMode="email" className={fieldClasses} {...accessibilityProps} />
          )}
        </FormField>

        <FormField id="contact-phone" label="Phone" optionalText="(optional)" error={state.fieldErrors?.phone}>
          {(accessibilityProps) => (
            <input id="contact-phone" name="phone" type="tel" maxLength={30} autoComplete="tel" inputMode="tel" className={fieldClasses} {...accessibilityProps} />
          )}
        </FormField>

        <FormField id="contact-subject" label="Inquiry type" required error={state.fieldErrors?.subject}>
          {(accessibilityProps) => (
            <select id="contact-subject" name="subject" required defaultValue="" className={fieldClasses} {...accessibilityProps}>
              <option value="" disabled>Select a topic</option>
              {contactSubjects.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          )}
        </FormField>
      </div>

      <FormField id="contact-message" label="Message" required className="mt-6" error={state.fieldErrors?.message}>
        {(accessibilityProps) => (
          <textarea id="contact-message" name="message" required minLength={10} maxLength={3000} rows={7} placeholder="If you’re asking about an item, include its type, condition, and approximate age if known." className={`${fieldClasses} resize-y`} {...accessibilityProps} />
        )}
      </FormField>

      <HoneypotField id="contact-company" />
      <FormStatus status={state.status} message={state.message} />

      <button type="submit" disabled={pending} className={submitButtonClasses}>
        <span>{pending ? "Sending…" : "Send Message"}</span>
      </button>
      <p className="mt-5 text-sm leading-6 text-(--muted)">
        Want to sell an antique? <Link href="/sell#antique-inquiry" className="font-bold text-(--burgundy) underline decoration-(--border-dark) underline-offset-4 hover:text-(--brown)">Submit item details here.</Link>
      </p>
    </form>
  );
};

export default ContactForm;
