"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitAntiqueForm } from "@/app/sell/actions";
import {
  antiqueCategories,
  initialAntiqueFormState,
  preferredContactOptions,
} from "@/app/sell/form-state";

const fieldClasses =
  "mt-2 w-full border border-(--border-dark) bg-(--cream) px-4 py-3.5 text-base text-(--ink) outline-none transition placeholder:text-(--muted)/65 focus:border-(--burgundy) focus:ring-2 focus:ring-(--burgundy)/10 aria-[invalid=true]:border-(--burgundy) disabled:cursor-not-allowed disabled:bg-(--ivory) disabled:text-(--muted) disabled:opacity-75";

const AntiqueForm = () => {
  const [state, formAction, pending] = useActionState(
    submitAntiqueForm,
    initialAntiqueFormState,
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
      id="antique-inquiry"
      ref={formRef}
      action={formAction}
      aria-busy={pending}
      className="scroll-mt-32 border border-(--border-dark) bg-(--cream) p-6 sm:p-9 lg:p-12"
    >
      <div className="border-b border-(--border) pb-7">
        <p className="eyebrow text-(--burgundy)">Submit an item</p>
        <h2 className="mt-3 font-heading text-4xl font-medium text-(--olive) sm:text-5xl">Tell us about your piece</h2>
        <p className="mt-4 max-w-2xl leading-7 text-(--muted)">
          Share what you know below. A submission is an inquiry only and does not guarantee an appraisal or purchase.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="antique-name" className="text-xs font-bold uppercase tracking-[0.12em] text-(--ink)">
            Name <span className="text-(--burgundy)" aria-hidden="true">*</span>
          </label>
          <input id="antique-name" name="name" type="text" required minLength={2} maxLength={100} autoComplete="name" className={fieldClasses} aria-invalid={Boolean(state.fieldErrors?.name)} aria-describedby={state.fieldErrors?.name ? "antique-name-error" : undefined} />
          {state.fieldErrors?.name && <p id="antique-name-error" className="mt-2 text-sm text-(--burgundy)">{state.fieldErrors.name}</p>}
        </div>

        <div>
          <label htmlFor="antique-email" className="text-xs font-bold uppercase tracking-[0.12em] text-(--ink)">
            Email <span className="text-(--burgundy)" aria-hidden="true">*</span>
          </label>
          <input id="antique-email" name="email" type="email" required maxLength={254} autoComplete="email" inputMode="email" className={fieldClasses} aria-invalid={Boolean(state.fieldErrors?.email)} aria-describedby={state.fieldErrors?.email ? "antique-email-error" : undefined} />
          {state.fieldErrors?.email && <p id="antique-email-error" className="mt-2 text-sm text-(--burgundy)">{state.fieldErrors.email}</p>}
        </div>

        <div>
          <label htmlFor="antique-phone" className="text-xs font-bold uppercase tracking-[0.12em] text-(--ink)">
            Phone <span className="font-normal normal-case tracking-normal text-(--muted)">(optional)</span>
          </label>
          <input id="antique-phone" name="phone" type="tel" maxLength={30} autoComplete="tel" inputMode="tel" className={fieldClasses} aria-invalid={Boolean(state.fieldErrors?.phone)} aria-describedby={state.fieldErrors?.phone ? "antique-phone-error" : undefined} />
          {state.fieldErrors?.phone && <p id="antique-phone-error" className="mt-2 text-sm text-(--burgundy)">{state.fieldErrors.phone}</p>}
        </div>

        <div>
          <label htmlFor="antique-contact" className="text-xs font-bold uppercase tracking-[0.12em] text-(--ink)">Preferred contact</label>
          <select id="antique-contact" name="preferredContact" defaultValue="email" className={fieldClasses} aria-invalid={Boolean(state.fieldErrors?.preferredContact)} aria-describedby={state.fieldErrors?.preferredContact ? "antique-contact-error" : undefined}>
            {preferredContactOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          {state.fieldErrors?.preferredContact && <p id="antique-contact-error" className="mt-2 text-sm text-(--burgundy)">{state.fieldErrors.preferredContact}</p>}
        </div>

        <div>
          <label htmlFor="antique-category" className="text-xs font-bold uppercase tracking-[0.12em] text-(--ink)">Item type <span className="font-normal normal-case tracking-normal text-(--muted)">(optional)</span></label>
          <select id="antique-category" name="category" defaultValue="" className={fieldClasses} aria-invalid={Boolean(state.fieldErrors?.category)} aria-describedby={state.fieldErrors?.category ? "antique-category-error" : undefined}>
            <option value="">Select a category</option>
            {antiqueCategories.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          {state.fieldErrors?.category && <p id="antique-category-error" className="mt-2 text-sm text-(--burgundy)">{state.fieldErrors.category}</p>}
        </div>

        <div>
          <label htmlFor="antique-age" className="text-xs font-bold uppercase tracking-[0.12em] text-(--ink)">Approximate age <span className="font-normal normal-case tracking-normal text-(--muted)">(if known)</span></label>
          <input id="antique-age" name="approximateAge" type="text" maxLength={100} placeholder="For example: 1940s or about 80 years old" className={fieldClasses} aria-invalid={Boolean(state.fieldErrors?.approximateAge)} aria-describedby={state.fieldErrors?.approximateAge ? "antique-age-error" : undefined} />
          {state.fieldErrors?.approximateAge && <p id="antique-age-error" className="mt-2 text-sm text-(--burgundy)">{state.fieldErrors.approximateAge}</p>}
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="antique-description" className="text-xs font-bold uppercase tracking-[0.12em] text-(--ink)">
          Item description <span className="text-(--burgundy)" aria-hidden="true">*</span>
        </label>
        <textarea id="antique-description" name="itemDescription" required minLength={20} maxLength={3000} rows={6} placeholder="Describe the item, its condition, markings, materials, and anything else you know about it." className={`${fieldClasses} resize-y`} aria-invalid={Boolean(state.fieldErrors?.itemDescription)} aria-describedby={state.fieldErrors?.itemDescription ? "antique-description-help antique-description-error" : "antique-description-help"} />
        <p id="antique-description-help" className="mt-2 text-sm leading-6 text-(--muted)">Please do not include sensitive personal information.</p>
        {state.fieldErrors?.itemDescription && <p id="antique-description-error" className="mt-2 text-sm text-(--burgundy)">{state.fieldErrors.itemDescription}</p>}
      </div>

      <div className="mt-6">
        <label htmlFor="antique-details" className="text-xs font-bold uppercase tracking-[0.12em] text-(--ink)">Additional details <span className="font-normal normal-case tracking-normal text-(--muted)">(optional)</span></label>
        <textarea id="antique-details" name="additionalDetails" maxLength={3000} rows={4} placeholder="Add provenance, dimensions, or other helpful context." className={`${fieldClasses} resize-y`} aria-invalid={Boolean(state.fieldErrors?.additionalDetails)} aria-describedby={state.fieldErrors?.additionalDetails ? "antique-details-error" : undefined} />
        {state.fieldErrors?.additionalDetails && <p id="antique-details-error" className="mt-2 text-sm text-(--burgundy)">{state.fieldErrors.additionalDetails}</p>}
      </div>

      <div className="mt-6 border border-(--border) bg-(--ivory) p-5">
        <label htmlFor="antique-photos" className="text-xs font-bold uppercase tracking-[0.12em] text-(--ink)">Item photos</label>
        <input id="antique-photos" type="file" accept="image/*" multiple disabled className={fieldClasses} aria-describedby="antique-photos-note" />
        <p id="antique-photos-note" className="mt-3 text-sm leading-6 text-(--muted)">Photo upload is shown for review but is not connected in this demo. It will be configured in the final build.</p>
      </div>

      <div className="absolute left-[-10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="antique-company">Company</label>
        <input id="antique-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.message && (
        <div className={`mt-6 border-l-2 px-4 py-3 text-sm leading-6 ${state.status === "success" ? "border-(--olive) bg-[#edf3e9] text-(--olive)" : "border-(--burgundy) bg-[#f8ecee] text-(--burgundy)"}`} role={state.status === "error" ? "alert" : "status"} aria-live="polite">
          {state.message}
        </div>
      )}

      <button type="submit" disabled={pending} className="mt-7 inline-flex min-h-12 items-center justify-center border border-(--olive) bg-(--olive) px-6 py-3 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-(--cream) transition-colors hover:border-(--olive-light) hover:bg-(--olive-light) disabled:cursor-wait disabled:opacity-60">
        <span>{pending ? "Sending…" : "Submit Item"}</span>
      </button>
    </form>
  );
};

export default AntiqueForm;
