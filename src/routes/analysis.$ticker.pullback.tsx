import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, Badge } from "@/components/nexflow/primitives";
import {
  pullbackByTicker,
  pullbackTypeSpectrum,
  signalColor,
  signalIntent,
  signalLabel,
  type PullbackAnalysis,
} from "@/lib/mock-market-screens";
import { CheckCircle2, XCircle, MinusCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analysis/$ticker/pullback")({
  head: ({ params }) => ({ meta: [{ title: `하락 분석 ${params.ticker} — NEXFLOW` }] }),
  notFoundComponent: () => (
    <AppShell>
      <Panel className="p-10 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
        해당 종목의 하락 분석 자료를 찾을 수 없습니다.
        <div className="mt-3">
          <Link to="/analysis" className="text-primary text-sm">← 종목 분석으로</Link>
        </div>
      </Panel>
    </AppShell>
  ),
  component: () => (<AppShell><PullbackPage /></AppShell>),
});

function PullbackPage() {
  const { ticker } = Route.useParams();
  const data: PullbackAnalysis | undefined = pullbackByTicker[ticker];
  if (!data) throw notFound();

  const tint = signalColor(data.signal_status);
  const currency: "KRW" | "USD" = /^\d+$/.test(data.ticker) ? "KRW" : "USD";

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <Link to="/analysis" className="text-xs text-muted-foreground hover:text-foreground">← 종목 분석</Link>
        <h1 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">하락 분석 — {data.ticker}</h1>
        <div className="text-sm text-muted-foreground">{data.company_name}</div>
      </div>

      <Panel
        className="p-5 border-l-4"
        style={{ borderLeftColor: tint, background: `color-mix(in oklab, ${tint} 6%, var(--card))` }}
      >
        <div className="text-[10px] uppercase tracking-wider font-semibold mb-1.5" style={{ color: tint }}>한 줄 해석</div>
        <p className="text-sm md:text-base leading-relaxed text-foreground">{data.one_line_summary}</p>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Panel className="p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="text-sm font-semibold">하락 유형</div>
              <Badge intent={signalIntent(data.signal_status)}>{data.pullback_label}</Badge>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">{data.context_paragraph}</p>
          </Panel>

          <Panel className="p-5">
            <div className="text-sm font-semibold mb-3">신호 체크</div>
            <div className="space-y-2">
              <CheckRow
                label="구조적 훼손 여부"
                state={data.signal_checks.structural_damage}
                note={data.signal_checks.notes.structural_damage}
              />
              <CheckRow
                label="단기 변동성 여부"
                state={data.signal_checks.short_term_volatility}
                note={data.signal_checks.notes.short_term_volatility}
              />
              <CheckRow
                label="수급 이탈 여부"
                state={data.signal_checks.liquidity_exit}
                note={data.signal_checks.notes.liquidity_exit}
              />
            </div>
          </Panel>

          <Panel className="p-5">
            <div className="text-sm font-semibold mb-1">하락 유형 스펙트럼</div>
            <div className="text-[10px] text-muted-foreground mb-3">건강한 조정 → 구조적 훼손</div>
            <div className="flex h-3 rounded-full overflow-hidden border border-border">
              {pullbackTypeSpectrum.map((t) => {
                const active = t.key === data.pullback_type;
                const color = t.tone === "good" ? "var(--bullish)" : t.tone === "warn" ? "var(--neutral-accent)" : "var(--bearish)";
                return (
                  <div
                    key={t.key}
                    className={cn("flex-1 transition-opacity", active ? "opacity-100" : "opacity-25")}
                    style={{ background: color }}
                    title={t.label}
                  />
                );
              })}
            </div>
            <div className="mt-3 grid grid-cols-7 gap-1 text-[9px] text-muted-foreground">
              {pullbackTypeSpectrum.map((t) => (
                <div
                  key={t.key}
                  className={cn("text-center truncate", t.key === data.pullback_type && "text-foreground font-semibold")}
                >
                  {t.label}
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel className="p-5">
            <div className="text-sm font-semibold mb-3">주요 신호</div>
            <ul className="space-y-2">
              {data.key_signals.map((s) => (
                <li key={s} className="text-sm flex gap-2 items-start">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-foreground/90">{s}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="p-5">
            <div className="text-sm font-semibold mb-3">주요 지지 구간</div>
            <div className="space-y-2">
              {data.support_zones.map((z) => (
                <div key={z.label} className="flex items-center justify-between rounded-lg border border-border/60 bg-[var(--surface-2)]/60 px-3 py-2">
                  <span className="text-xs text-muted-foreground">{z.label}</span>
                  <span className="text-sm font-semibold tabular-nums">
                    {fmt(z.low, currency)}<span className="opacity-50"> ~ </span>{fmt(z.high, currency)}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--bearish)] mb-3">
              <AlertTriangle className="h-4 w-4" /> 무효화 조건
            </div>
            <ul className="space-y-2">
              {data.invalidation_conditions.map((c) => (
                <li
                  key={c}
                  className="text-sm flex gap-2 items-start bg-[color-mix(in_oklab,var(--bearish)_7%,transparent)] border border-[var(--bearish)]/20 rounded-lg px-3 py-2"
                >
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--bearish)] shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="p-5">
            <div className="text-sm font-semibold mb-3">대응 시나리오</div>
            <div className="space-y-2">
              {data.response_scenarios.map((s) => (
                <div key={s.action} className="rounded-lg border border-border/60 bg-[var(--surface-2)]/60 p-3">
                  <div className="text-sm font-semibold">{s.action}</div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.rationale}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed">
        본 자료는 정보 제공 목적이며 투자 권유가 아닙니다. 모든 투자 결정과 책임은 투자자 본인에게 있습니다.
      </p>
    </div>
  );
}

function CheckRow({
  label,
  state,
  note,
}: {
  label: string;
  state: "yes" | "no" | "unclear";
  note?: string;
}) {
  const map = {
    yes: { Icon: CheckCircle2, color: "var(--bullish)", text: "예" },
    no: { Icon: XCircle, color: "var(--bearish)", text: "아니오" },
    unclear: { Icon: MinusCircle, color: "var(--neutral-accent)", text: "불확실" },
  } as const;
  const { Icon, color, text } = map[state];
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-[var(--surface-2)]/60 px-3 py-2.5">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {note && <div className="text-[11px] text-muted-foreground mt-0.5">{note}</div>}
      </div>
      <div className="flex items-center gap-1.5 shrink-0" style={{ color }}>
        <Icon className="h-4 w-4" />
        <span className="text-xs font-semibold">{text}</span>
      </div>
    </div>
  );
}

function fmt(p: number, currency: "KRW" | "USD") {
  if (currency === "KRW") return `${p.toLocaleString("ko-KR")}원`;
  return `$${p.toLocaleString("en-US", { minimumFractionDigits: p < 10 ? 2 : 0, maximumFractionDigits: 2 })}`;
}