import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  children,
  className,
  glow,
  style,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      style={style}
      className={cn(
        "relative rounded-2xl border border-border bg-card",
        glow && "shadow-[0_1px_2px_oklch(0_0_0/0.04),0_8px_24px_-16px_oklch(0_0_0/0.12)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  subtitle,
  right,
  eyebrow,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
  eyebrow?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3 px-5 pt-5", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-[11px] tracking-tight text-primary mb-1 font-semibold">
            {eyebrow}
          </div>
        )}
        <div className="text-base font-semibold text-foreground truncate">{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

export function Stat({
  label,
  value,
  delta,
  suffix,
  intent = "neutral",
}: {
  label: string;
  value: ReactNode;
  delta?: ReactNode;
  suffix?: ReactNode;
  intent?: "bullish" | "bearish" | "neutral";
}) {
  const color =
    intent === "bullish"
      ? "text-[var(--bullish)]"
      : intent === "bearish"
        ? "text-[var(--bearish)]"
        : "text-foreground";
  return (
    <div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={cn("text-xl font-semibold tabular mt-1 tracking-tight", color)}>
        {value}
        {suffix && <span className="text-xs text-muted-foreground ml-1">{suffix}</span>}
      </div>
      {delta && <div className="text-xs mt-0.5">{delta}</div>}
    </div>
  );
}

export function Badge({
  children,
  intent = "neutral",
  className,
}: {
  children: ReactNode;
  intent?: "bullish" | "bearish" | "neutral" | "info" | "warn";
  className?: string;
}) {
  const map = {
    bullish: "bg-[color-mix(in_oklab,var(--bullish)_10%,transparent)] text-[var(--bullish)] border-[color-mix(in_oklab,var(--bullish)_22%,transparent)]",
    bearish: "bg-[color-mix(in_oklab,var(--bearish)_10%,transparent)] text-[var(--bearish)] border-[color-mix(in_oklab,var(--bearish)_22%,transparent)]",
    neutral: "bg-muted text-muted-foreground border-border",
    info: "bg-[color-mix(in_oklab,var(--primary)_10%,transparent)] text-primary border-[color-mix(in_oklab,var(--primary)_22%,transparent)]",
    warn: "bg-[color-mix(in_oklab,var(--neutral-accent)_14%,transparent)] text-[var(--neutral-accent)] border-[color-mix(in_oklab,var(--neutral-accent)_28%,transparent)]",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border tabular",
        map[intent],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Delta({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const positive = value >= 0;
  return (
    <span
      className={cn(
        "tabular font-medium",
        positive ? "text-[var(--bullish)]" : "text-[var(--bearish)]",
      )}
    >
      {positive ? "+" : ""}
      {value.toFixed(2)}
      {suffix}
    </span>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  right,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        {eyebrow && (
          <div className="text-[11px] text-primary mb-1.5 font-semibold tracking-tight">
            {eyebrow}
          </div>
        )}
        <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {right}
    </div>
  );
}