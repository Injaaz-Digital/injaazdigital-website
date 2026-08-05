import { cn } from '@/lib/utils';

export const BUTTON_VARIANTS = {
  primary:
    "border border-[var(--color-secondary)]  bg-brand-gradient text-white shadow-[0_16px_32px_rgba(8,66,153,0.32)] hover:brightness-110",
  outline:
    "border border-[var(--line)] bg-white/65 text-[color:var(--ink-2)] shadow-[0_8px_20px_rgba(13,25,46,0.08)] hover:border-[var(--line-strong)] hover:bg-white/90 dark:bg-slate-950/30 dark:text-[color:var(--ink-2)] dark:hover:bg-slate-900/50",
  ghost:
    "border border-transparent  text-[color:var(--ink-2)] hover:border-[var(--line)] hover:bg-white/65 dark:hover:bg-slate-900/45",
  danger:
    "border border-rose-300/70  bg-rose-50/75 text-rose-700 hover:border-rose-400/80 hover:bg-rose-100/80 dark:border-rose-400/45 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/20",
  warning:
    "border border-amber-300/80 bg-amber-50/80 text-amber-700 hover:border-amber-400/80 hover:bg-amber-100/80 dark:border-amber-400/50 dark:bg-amber-500/10 dark:text-amber-200",
  success:
    "border border-emerald-400/70 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_12px_28px_rgba(14,159,110,0.35)] hover:from-emerald-600 hover:to-teal-600 dark:border-emerald-300/70 dark:text-slate-950",
  info:
    "border border-sky-300/75 bg-sky-50/80 text-sky-700 hover:border-sky-400/85 hover:bg-sky-100/80 dark:border-sky-400/50 dark:bg-sky-500/10 dark:text-sky-200"
};

export const BUTTON_SIZES = {
  xs: "h-6 px-3 text-[11px]",
  sm: "h-8 px-3.5 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-sm",
  xl: "h-12 px-6 text-[11px]"
};

export default function Button({
  variant = "outline",
  size = "md",
  className,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-full corner-squircle font-normal tracking-[0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/45 disabled:pointer-events-none disabled:opacity-50",
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        className
      )}
      {...props}
    />
  );
}
