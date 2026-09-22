import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { Bell } from 'lucide-react';

/* ————— Buttons ————— */
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type BtnSize = 'sm' | 'md';

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: BtnSize }) {
  const base =
    'inline-flex items-center justify-center gap-1.5 font-medium rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap';
  const sizes: Record<BtnSize, string> = {
    sm: 'px-2.5 py-1.5 text-[13px] leading-5',
    md: 'px-3.5 py-2 text-[13px] leading-5',
  };
  const variants: Record<BtnVariant, string> = {
    primary: 'bg-[var(--accent)] text-black hover:brightness-110',
    secondary:
      'bg-[var(--panel)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--elev)]',
    ghost: 'bg-transparent text-[var(--text2)] hover:bg-[var(--elev)] hover:text-[var(--text)]',
    danger: 'bg-red-600 text-white hover:bg-red-500',
  };
  return <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props} />;
}

/* ————— Inputs ————— */
export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-md border border-[var(--border)] bg-[var(--bg2)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--muted)] hover:border-[var(--border-strong)] focus:border-[var(--accent)] focus:outline-none ${className}`}
      {...props}
    />
  );
}

export function Select({
  className = '',
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select
      className={`rounded-md border border-[var(--border)] bg-[var(--bg2)] px-2.5 py-2 text-sm text-[var(--text)] hover:border-[var(--border-strong)] focus:border-[var(--accent)] focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

/* ————— Surfaces ————— */
export function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={`rounded-lg border border-[var(--border)] bg-[var(--panel)] p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function Panel({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <section
      className={`rounded-lg border border-[var(--border)] bg-[var(--panel)] ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <h3 className="type-section-title text-[var(--text)]">{title}</h3>
        {hint ? <p className="mt-0.5 text-[13px] text-[var(--muted)]">{hint}</p> : null}
      </div>
      {action}
    </div>
  );
}

/* ————— Badge ————— */
type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'accent';

const badgeTones: Record<BadgeTone, string> = {
  neutral: 'bg-[var(--elev)] text-[var(--text2)] border-[var(--border)]',
  success: 'bg-green-500/10 text-green-500 border-green-500/20',
  warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  danger: 'bg-red-500/10 text-red-500 border-red-500/20',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  accent: 'bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20',
};

export function Badge({
  tone = 'neutral',
  children,
  dot = false,
  className = '',
}: {
  tone?: BadgeTone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium tracking-wide ${badgeTones[tone]} ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  );
}

/* ————— Tooltip (CSS-only, keyboard accessible) ————— */
export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="group relative inline-flex" tabIndex={0} aria-label={label} title={label}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-[var(--border-strong)] bg-[var(--elev)] px-2 py-1 text-xs text-[var(--text)] group-hover:block group-focus-visible:block"
      >
        {label}
      </span>
    </span>
  );
}

/* ————— States ————— */
export function EmptyState({
  icon,
  title,
  hint,
  action,
}: {
  icon?: ReactNode;
  title: string;
  hint: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--border-strong)] p-8 text-center">
      {icon ?? (
        <span className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--elev)] text-[var(--muted)]">
          <Bell className="h-4 w-4" />
        </span>
      )}
      <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-[13px] text-[var(--muted)]">{hint}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function LoadingState({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-label="Loading" role="status">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-9 animate-pulse rounded-md bg-[var(--elev)]" />
      ))}
    </div>
  );
}

/* ————— Page header ————— */
export function PageHeader({
  title,
  description,
  meta,
  actions,
}: {
  title: string;
  description?: string;
  meta?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="type-page-title text-[var(--text)]">{title}</h2>
        {description ? (
          <p className="mt-1 max-w-2xl text-[13px] text-[var(--muted)]">{description}</p>
        ) : null}
        {meta ? <div className="mt-2 flex flex-wrap items-center gap-2">{meta}</div> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
