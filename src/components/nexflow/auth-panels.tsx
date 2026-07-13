import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Lock, UserPlus } from "lucide-react";
import { Panel } from "@/components/nexflow/primitives";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GuestLoginPanel({
  title = "로그인이 필요합니다",
  description = "자동투자 설정과 증권 연동은 로그인 후 이용할 수 있습니다.",
}: {
  title?: string;
  description?: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Panel className="p-8 md:p-12">
      <div className="max-w-sm mx-auto text-center">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-muted grid place-items-center text-muted-foreground mb-4">
          <Lock className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{description}</p>

        <form onSubmit={(e) => e.preventDefault()} className="mt-6 space-y-3 text-left">
          <div>
            <label className="block text-[11px] text-muted-foreground mb-1.5">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full h-10 px-3 rounded-lg bg-muted/40 border border-border/60 text-sm focus:outline-none focus:border-[var(--cyan-accent)]/60"
            />
          </div>
          <div>
            <label className="block text-[11px] text-muted-foreground mb-1.5">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 px-3 rounded-lg bg-muted/40 border border-border/60 text-sm focus:outline-none focus:border-[var(--cyan-accent)]/60"
            />
          </div>
          <button
            type="submit"
            className="w-full h-10 rounded-lg bg-[var(--cyan-accent)] text-[oklch(0.12_0.03_270)] text-sm font-semibold glow-cyan transition hover:opacity-90"
          >
            로그인
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <span>계정이 없으신가요?</span>
          <button className="inline-flex items-center gap-1 text-[var(--cyan-accent)] hover:underline font-medium">
            <UserPlus className="h-3 w-3" /> 회원가입
          </button>
        </div>
      </div>
    </Panel>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  ctaTo,
  onCta,
  secondary,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaTo?: string;
  onCta?: () => void;
  secondary?: React.ReactNode;
}) {
  return (
    <Panel className="p-10 text-center">
      <div className="mx-auto h-12 w-12 rounded-full bg-muted grid place-items-center text-muted-foreground mb-4">
        {icon}
      </div>
      <div className="text-base font-semibold text-foreground">{title}</div>
      {description && (
        <div className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto leading-relaxed">
          {description}
        </div>
      )}
      {(ctaLabel || secondary) && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {ctaLabel && (
            ctaTo ? (
              <Button asChild size="sm">
                <Link to={ctaTo}>{ctaLabel}</Link>
              </Button>
            ) : (
              <Button size="sm" onClick={onCta}>{ctaLabel}</Button>
            )
          )}
          {secondary}
        </div>
      )}
    </Panel>
  );
}

export function PreviewToggle<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">{label}</span>
      <div className="flex p-1 rounded-lg bg-muted/40 border border-border/40">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] transition",
              value === o.value ? "bg-[var(--surface-3)] text-foreground" : "text-muted-foreground"
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PreviewBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 px-3 py-2 flex flex-wrap items-center gap-3">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Preview</span>
      {children}
    </div>
  );
}