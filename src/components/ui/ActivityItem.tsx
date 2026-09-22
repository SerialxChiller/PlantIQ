import type { LucideIcon } from 'lucide-react';

export function ActivityItem({
  icon: Icon,
  title,
  meta,
  time,
  tone = 'neutral',
}: {
  icon: LucideIcon;
  title: string;
  meta?: string;
  time?: string;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
}) {
  const tones: Record<string, string> = {
    neutral: 'text-[var(--muted)]',
    success: 'text-green-500',
    warning: 'text-amber-500',
    danger: 'text-red-500',
    info: 'text-blue-400',
  };
  return (
    <li className="flex items-start gap-2.5 py-2">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--elev)]">
        <Icon className={`h-3.5 w-3.5 ${tones[tone]}`} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium text-[var(--text)]">{title}</span>
        {meta ? <span className="block truncate text-xs text-[var(--muted)]">{meta}</span> : null}
      </span>
      {time ? (
        <span className="shrink-0 text-xs text-[var(--muted)]">{time}</span>
      ) : null}
    </li>
  );
}
