"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitAntiqueForm } from "@/app/sell/actions";
import {
  antiqueCategories,
  initialAntiqueFormState,
  preferredContactOptions,
} from "@/app/sell/form-state";
import FormField from "./FormField";
import FormStatus from "./FormStatus";
import HoneypotField from "./HoneypotField";
import {
  fieldClasses,
  formClasses,
  submitButtonClasses,
} from "./formStyles";

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
      className={formClasses}
    >
      <div className="border-b border-(--border) pb-7">
        <p className="eyebrow text-(--burgundy)">Submit an item</p>
        <h2 className="mt-3 font-heading text-4xl font-medium text-(--olive) sm:text-5xl">Tell us about your piece</h2>
        <p className="mt-4 max-w-2xl leading-7 text-(--muted)">
          Share what you know below. A submission is an inquiry only and does not guarantee an appraisal or purchase.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <FormField id="antique-name" label="Name" required error={state.fieldErrors?.name}>
          {(accessibilityProps) => (
            <input id="antique-name" name="name" type="text" required minLength={2} maxLength={100} autoComplete="name" className={fieldClasses} {...accessibilityProps} />
          )}
        </FormField>

        <FormField id="antique-email" label="Email" required error={state.fieldErrors?.email}>
          {(accessibilityProps) => (
            <input id="antique-email" name="email" type="email" required maxLength={254} autoComplete="email" inputMode="email" className={fieldClasses} {...accessibilityProps} />
          )}
        </FormField>

        <FormField id="antique-phone" label="Phone" optionalText="(optional)" error={state.fieldErrors?.phone}>
          {(accessibilityProps) => (
            <input id="antique-phone" name="phone" type="tel" maxLength={30} autoComplete="tel" inputMode="tel" className={fieldClasses} {...accessibilityProps} />
          )}
        </FormField>

        <FormField id="antique-contact" label="Preferred contact" error={state.fieldErrors?.preferredContact}>
          {(accessibilityProps) => (
            <select id="antique-contact" name="preferredContact" defaultValue="email" className={fieldClasses} {...accessibilityProps}>
              {preferredContactOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          )}
        </FormField>

        <FormField id="antique-category" label="Item type" optionalText="(optional)" error={state.fieldErrors?.category}>
          {(accessibilityProps) => (
            <select id="antique-category" name="category" defaultValue="" className={fieldClasses} {...accessibilityProps}>
              <option value="">Select a category</option>
              {antiqueCategories.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          )}
        </FormField>

        <FormField id="antique-age" label="Approximate age" optionalText="(if known)" error={state.fieldErrors?.approximateAge}>
          {(accessibilityProps) => (
            <input id="antique-age" name="approximateAge" type="text" maxLength={100} placeholder="For example: 1940s or about 80 years old" className={fieldClasses} {...accessibilityProps} />
          )}
        </FormField>
      </div>

      <FormField
        id="antique-description"
        label="Item description"
        required
        className="mt-6"
        error={state.fieldErrors?.itemDescription}
        helpText="Please do not include sensitive personal information."
      >
        {(accessibilityProps) => (
          <textarea id="antique-description" name="itemDescription" required minLength={20} maxLength={3000} rows={6} placeholder="Describe the item, its condition, markings, materials, and anything else you know about it." className={`${fieldClasses} resize-y`} {...accessibilityProps} />
        )}
      </FormField>

      <FormField id="antique-details" label="Additional details" optionalText="(optional)" className="mt-6" error={state.fieldErrors?.additionalDetails}>
        {(accessibilityProps) => (
          <textarea id="antique-details" name="additionalDetails" maxLength={3000} rows={4} placeholder="Add provenance, dimensions, or other helpful context." className={`${fieldClasses} resize-y`} {...accessibilityProps} />
        )}
      </FormField>

      <div className="mt-6 border border-(--border) bg-(--ivory) p-5" role="note" aria-labelledby="antique-photos-label">
        <p id="antique-photos-label" className="text-xs font-bold uppercase tracking-[0.12em] text-(--ink)">Item photos</p>
        <p className="mt-3 text-sm leading-6 text-(--muted)">Photo upload will be enabled in the final setup.</p>
      </div>

      <HoneypotField id="antique-company" />
      <FormStatus status={state.status} message={state.message} />

      <button type="submit" disabled={pending} className={submitButtonClasses}>
        <span>{pending ? "Sending…" : "Submit Item"}</span>
      </button>
    </form>
  );
};

export default AntiqueForm;
