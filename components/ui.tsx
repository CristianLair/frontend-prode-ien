import { InputHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

// ---------- Button ----------

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "ghost" | "danger";
  fullWidth?: boolean;
}

const buttonVariants: Record<string, string> = {
  primary: "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white",
  accent: "bg-[var(--accent)] hover:opacity-90 text-white",
  ghost:
    "bg-transparent border border-[var(--border-strong)] hover:border-[var(--text-faint)] text-[var(--text)]",
  danger: "bg-[var(--danger)] hover:opacity-90 text-white",
};

export function Button({
  variant = "primary",
  fullWidth,
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`px-5 py-2.5 font-display font-medium text-sm tracking-wide uppercase transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        buttonVariants[variant]
      } ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

// ---------- Input ----------

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", id, ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`bg-[var(--bg-input)] border border-[var(--border)] px-4 py-2.5 text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] transition-colors outline-none ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-[var(--danger)]">{error}</span>}
    </div>
  );
}

// ---------- Badge ----------

interface BadgeProps {
  children: ReactNode;
  tone?: "success" | "danger" | "warning" | "accent" | "neutral";
}

const badgeTones: Record<string, string> = {
  success: "bg-[var(--success-soft)] text-[var(--success)]",
  danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
  warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
  accent: "bg-[var(--accent-soft)] text-[var(--accent)]",
  neutral: "bg-[var(--border)] text-[var(--text-muted)]",
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium uppercase tracking-wide ${badgeTones[tone]}`}
    >
      {children}
    </span>
  );
}

// ---------- Card ----------

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[var(--bg-elevated)] border border-[var(--border)] ${className}`}
    >
      {children}
    </div>
  );
}

// ---------- ErrorBanner ----------

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="bg-[var(--danger-soft)] border-l-2 border-[var(--danger)] px-4 py-3 text-sm text-[var(--text)]">
      {message}
    </div>
  );
}

// ---------- Spinner ----------

export function Spinner() {
  return (
    <div
      className="w-5 h-5 border-2 border-[var(--border-strong)] border-t-[var(--primary)] rounded-full animate-spin"
      role="status"
      aria-label="Cargando"
    />
  );
}
