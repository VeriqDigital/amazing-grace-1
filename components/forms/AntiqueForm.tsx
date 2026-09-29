"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { resizePhotos } from "@/lib/forms/resize-photos";
import type { AntiqueFormState } from "@/app/sell/form-state";
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
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [state, formAction, pending] = useActionState(
    async (previous: AntiqueFormState, data: FormData): Promise<AntiqueFormState> => {
      const values = Object.fromEntries([...data.entries()].filter((entry): entry is [string, string] => typeof entry[1] === "string"));
      data.delete("photos");
      selectedPhotos.forEach((file) => data.append("photos", file));
      try { await resizePhotos(data); }
      catch (error) { return { status: "error", values, message: "Please check your photos and try again.", fieldErrors: { photos: error instanceof Error ? error.message : "Could not prepare these photos." } }; }
      try {
        const result = await submitAntiqueForm(previous, data);
        if (result.status === "success") setSelectedPhotos([]);
        return result;
      } catch { return { status: "error", values, message: "The connection was interrupted. Please try again or call the shop." }; }
    },
    initialAntiqueFormState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      return;
    }

    if (state.status === "error") {
      const target = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]') || formRef.current?.querySelector<HTMLElement>('[data-form-status]');
      target?.focus();
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
          Share what you know below. Fields marked * are required. A submission is an inquiry only and does not guarantee an appraisal or purchase.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <FormField id="antique-name" label="Name" required error={state.fieldErrors?.name}>
          {(accessibilityProps) => (
            <input id="antique-name" name="name" defaultValue={state.values?.name || ""} type="text" required minLength={2} maxLength={100} autoComplete="name" className={fieldClasses} {...accessibilityProps} />
          )}
        </FormField>

        <FormField id="antique-email" label="Email" required error={state.fieldErrors?.email}>
          {(accessibilityProps) => (
            <input id="antique-email" name="email" defaultValue={state.values?.email || ""} type="email" required maxLength={254} autoComplete="email" inputMode="email" className={fieldClasses} {...accessibilityProps} />
          )}
        </FormField>

        <FormField id="antique-phone" label="Phone" optionalText="(optional)" error={state.fieldErrors?.phone}>
          {(accessibilityProps) => (
            <input id="antique-phone" name="phone" defaultValue={state.values?.phone || ""} type="tel" maxLength={30} autoComplete="tel" inputMode="tel" className={fieldClasses} {...accessibilityProps} />
          )}
        </FormField>

        <FormField id="antique-contact" label="Preferred contact" error={state.fieldErrors?.preferredContact}>
          {(accessibilityProps) => (
            <select id="antique-contact" name="preferredContact" defaultValue={state.values?.preferredContact || "email"} className={fieldClasses} {...accessibilityProps}>
              {preferredContactOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          )}
        </FormField>

        <FormField id="antique-category" label="Item type" optionalText="(optional)" error={state.fieldErrors?.category}>
          {(accessibilityProps) => (
            <select id="antique-category" name="category" defaultValue={state.values?.category || ""} className={fieldClasses} {...accessibilityProps}>
              <option value="">Select a category</option>
              {antiqueCategories.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          )}
        </FormField>

        <FormField id="antique-age" label="Approximate age" optionalText="(if known)" error={state.fieldErrors?.approximateAge}>
          {(accessibilityProps) => (
            <input id="antique-age" name="approximateAge" defaultValue={state.values?.approximateAge || ""} type="text" maxLength={100} placeholder="For example: 1940s or about 80 years old" className={fieldClasses} {...accessibilityProps} />
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
          <textarea id="antique-description" name="itemDescription" defaultValue={state.values?.itemDescription || ""} required minLength={20} maxLength={3000} rows={6} placeholder="Describe the item, its condition, markings, materials, and anything else you know about it." className={`${fieldClasses} resize-y`} {...accessibilityProps} />
        )}
      </FormField>

      <FormField id="antique-details" label="Additional details" optionalText="(optional)" className="mt-6" error={state.fieldErrors?.additionalDetails}>
        {(accessibilityProps) => (
          <textarea id="antique-details" name="additionalDetails" defaultValue={state.values?.additionalDetails || ""} maxLength={3000} rows={4} placeholder="Add provenance, dimensions, or other helpful context." className={`${fieldClasses} resize-y`} {...accessibilityProps} />
        )}
      </FormField>

      <FormField id="antique-price" label="Asking price (USD)" optionalText="(optional)" className="mt-6" error={state.fieldErrors?.askingPrice} helpText="Leave blank if you’re unsure.">
        {(accessibilityProps) => <input id="antique-price" name="askingPrice" type="text" inputMode="decimal" maxLength={10} defaultValue={state.values?.askingPrice || ""} placeholder="For example: 125.00" className={fieldClasses} {...accessibilityProps} />}
      </FormField>
      <FormField id="antique-photos" label="Item photos" optionalText="(optional)" className="mt-6" error={state.fieldErrors?.photos} helpText="Choose up to 5 JPG, PNG, or WebP photos. We resize them for you. Original photos may be up to 20 MB each; resized photos must total 3 MB or less.">
        {(accessibilityProps) => <input id="antique-photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={pending} onChange={(event) => setSelectedPhotos(Array.from(event.target.files || []))} className={`${fieldClasses} file:mr-3 file:min-h-11 file:border-0 file:bg-(--olive) file:px-4 file:text-base file:text-(--cream)`} {...accessibilityProps} />}
      </FormField>
      {selectedPhotos.length > 0 && <div className="mt-3 text-base leading-7 text-(--muted)"><p aria-live="polite">{selectedPhotos.length} photo(s) selected. These stay selected if you need to correct a field.</p><ul className="list-inside list-disc break-words">{selectedPhotos.map((file, index) => <li key={`${file.name}-${index}`}>{file.name}</li>)}</ul><button type="button" disabled={pending} className="min-h-11 text-(--burgundy) underline" onClick={() => { setSelectedPhotos([]); const input = formRef.current?.querySelector<HTMLInputElement>('#antique-photos'); if (input) input.value = ""; }}>Remove selected photos</button></div>}
      <p className="mt-6 text-base leading-7 text-(--muted)">Your contact details and photos are shared with the Amazing Grace team to review your inquiry. They are not published on this website. Please avoid including people, addresses, or private documents in your photos.</p>

      <HoneypotField id="antique-company" />
      <FormStatus status={state.status} message={state.message} />

      <button type="submit" disabled={pending} className={submitButtonClasses}>
        <span>{pending ? "Preparing photos and sending…" : "Submit Item"}</span>
      </button>
    </form>
  );
};

export default AntiqueForm;
