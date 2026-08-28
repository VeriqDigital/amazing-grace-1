import type { ReactNode } from "react";

type FormControlAccessibilityProps = {
  "aria-invalid": boolean;
  "aria-describedby": string | undefined;
};

type FormFieldProps = {
  id: string;
  label: string;
  children: (props: FormControlAccessibilityProps) => ReactNode;
  className?: string;
  error?: string;
  helpText?: string;
  optionalText?: string;
  required?: boolean;
};

const FormField = ({
  id,
  label,
  children,
  className,
  error,
  helpText,
  optionalText,
  required,
}: FormFieldProps) => {
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;
  const describedBy = [helpText ? helpId : null, error ? errorId : null]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="text-xs font-bold uppercase tracking-[0.12em] text-(--ink)"
      >
        {label}{" "}
        {required && (
          <span className="text-(--burgundy)" aria-hidden="true">*</span>
        )}
        {optionalText && (
          <span className="font-normal normal-case tracking-normal text-(--muted)">
            {optionalText}
          </span>
        )}
      </label>
      {children({
        "aria-invalid": Boolean(error),
        "aria-describedby": describedBy,
      })}
      {helpText && (
        <p id={helpId} className="mt-2 text-sm leading-6 text-(--muted)">
          {helpText}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-2 text-sm text-(--burgundy)">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
