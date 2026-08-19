"use client";

/**
 * Shared building blocks for the growth forms (host-a-bin, pickup, volunteer,
 * partner application). Visual/behavioral patterns are copied verbatim from
 * ContactForm/PartnerRequestForm so every form on the site feels identical:
 * honeypot, AA labels, error styling, animated success check.
 */

export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div aria-hidden className="hidden">
      <label htmlFor="company">Company</label>
      <input
        id="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function Field({
  id,
  label,
  type = "text",
  required,
  optional,
  error,
  value,
  onChange,
  autoComplete,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}{" "}
        {required && <span className="text-coral-deep">*</span>}
        {optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="min-h-[44px] w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-ink placeholder:text-muted/60 focus:border-sage focus:outline-none"
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextArea({
  id,
  label,
  required,
  optional,
  error,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}{" "}
        {required && <span className="text-coral-deep">*</span>}
        {optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      <textarea
        id={id}
        rows={rows}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink placeholder:text-muted/60 focus:border-sage focus:outline-none"
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Select({
  id,
  label,
  value,
  onChange,
  options,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[44px] w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-ink focus:border-sage focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && <p className="mt-1.5 text-sm text-muted">{hint}</p>}
    </div>
  );
}

export function CheckboxRow({
  checked,
  onChange,
  children,
  error,
  id,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
  error?: string;
  id?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label
        className={`flex items-start gap-3 rounded-xl border border-line bg-cream p-4 ${
          disabled ? "opacity-60" : ""
        }`}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-line text-sage focus:ring-sage"
        />
        <span className="text-sm leading-relaxed text-ink/90">{children}</span>
      </label>
      {error && (
        <p className="mt-1.5 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function SuccessCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border border-sage/30 bg-cream p-8 text-center"
      role="status"
    >
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sage text-cream">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 12.5l4 4 10-10"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="check-draw"
          />
        </svg>
      </span>
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-muted">{children}</p>
      <style>{`
        .check-draw {
          stroke-dasharray: 30;
          stroke-dashoffset: 30;
          animation: check-draw 0.45s var(--ease-out-soft) forwards;
        }
        @keyframes check-draw { to { stroke-dashoffset: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .check-draw { animation: none; stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
