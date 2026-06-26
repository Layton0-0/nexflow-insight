import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, Badge } from "@/components/nexflow/primitives";
import {
  themes,
  themeStocksBySlug,
  cycleLabel,
  signalColor,
  signalIntent,
  signalLabel,
  type Theme,
  type ThemeStock,
} from "@/lib/mock-market-screens";
import { useState } from "react";
import { Star, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/themes/$slug")({
  head: ({ params }) => ({ meta: [{ title: `테마 ${params.slug} — NEXFLOW` }] }),
  notFoundComponent: () => (
    <AppShell>
      <Panel className="p-10 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
        해당 테마를 찾을 수 없습니다.
        <div className="mt-3">
          <Link to="/themes" className="text-primary text-sm">← 테마 목록으로</Link>
        </div>
      </Panel>
    </AppShell>
  ),
  component: () => (<AppShell><ThemeDetail /></AppShell>),
});

function ThemeDetail() {
  const { slug } = Route.useParams();
  const theme: Theme | undefined = themes.find((t) => t.slug === slug);
  if (!theme) throw notFound();
  const stocks: ThemeStock[] = themeStocksBySlug[slug] ?? [];
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <Link to="/themes" className="text-xs text-muted-foreground hover:text-foreground">← 테마 분석</Link>
        <h1 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">테마 — {theme.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Panel className="p-5">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="text-[10px] text-muted-foreground">{theme.sector}</div>
                <div className="text-xl font-bold mt-1">{theme.name}</div>
                <div className="text-xs text-muted-foreground mt-1">예상 지속 {theme.duration_estimate}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge intent={signalIntent(theme.signal_status)}>{signalLabel(theme.signal_status)}</Badge>
                <Badge intent="info">{cycleLabel[theme.cycle_stage]}</Badge>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${theme.score}%`, background: signalColor(theme.signal_status) }} />
              </div>
              <div className="text-lg font-bold tabular-nums" style={{ color: signalColor(theme.signal_status) }}>{theme.score}</div>
            </div>
          </Panel>

          <Panel className="p-5">
            <div className="text-[10px] uppercase tracking-wider text-primary font-semibold mb-2">쉬운 요약</div>
            <p className="text-sm leading-relaxed text-foreground/90">{theme.easy_summary}</p>
          </Panel>

          <Panel className="p-5">
            <div className="text-sm font-semibold mb-3">관련 종목</div>
            <div className="divide-y divide-border">
              {stocks.map((s) => (
                <Link
                  key={s.ticker}
                  to="/analysis"
                  className="flex items-center justify-between py-3 hover:bg-muted/40 transition-colors px-2 -mx-2 rounded-md"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ background: signalColor(s.signal_status) }} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{s.company_name}</div>
                      <div className="text-[10px] text-muted-foreground tabular-nums">{s.ticker}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-16 rounded-full bg-muted overflow-hidden">
                      <div className="h-full" style={{ width: `${s.score}%`, background: signalColor(s.signal_status) }} />
                    </div>
                    <span className="text-xs font-semibold tabular-nums w-8 text-right" style={{ color: signalColor(s.signal_status) }}>{s.score}</span>
                  </div>
                </Link>
              ))}
            </div>
          </Panel>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Panel className="p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--bullish)] mb-3">
                <CheckCircle2 className="h-4 w-4" /> 왜 강한가?
              </div>
              <ul className="space-y-2">
                {theme.why_strong.map((w) => (
                  <li key={w} className="text-sm text-foreground/90 flex gap-2">
                    <span className="mt-2 h-1 w-1 rounded-full bg-[var(--bullish)] shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel className="p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--neutral-accent)] mb-3">
                <AlertTriangle className="h-4 w-4" /> 주의할 점
              </div>
              <ul className="space-y-2">
                {theme.watch_out.map((w) => (
                  <li key={w} className="text-sm text-foreground/90 flex gap-2">
                    <span className="mt-2 h-1 w-1 rounded-full bg-[var(--neutral-accent)] shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          {(theme.catalysts?.length || theme.risks?.length) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {theme.catalysts && (
                <Panel className="p-5">
                  <div className="text-sm font-semibold mb-3">테마 촉매</div>
                  <ul className="space-y-1.5 text-sm text-foreground/90">
                    {theme.catalysts.map((c) => <li key={c}>· {c}</li>)}
                  </ul>
                </Panel>
              )}
              {theme.risks && (
                <Panel className="p-5">
                  <div className="text-sm font-semibold mb-3">테마 리스크</div>
                  <ul className="space-y-1.5 text-sm text-foreground/90">
                    {theme.risks.map((c) => <li key={c}>· {c}</li>)}
                  </ul>
                </Panel>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Panel className="p-4">
            <button
              onClick={() => setSaved((v) => !v)}
              className={cn(
                "w-full inline-flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-medium border transition-colors",
                saved
                  ? "bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] border-primary/30 text-primary"
                  : "border-border hover:bg-muted",
              )}
            >
              <Star className={cn("h-4 w-4", saved && "fill-current")} />
              {saved ? "관심 테마 등록됨" : "관심 테마에 추가"}
            </button>
          </Panel>
          <Panel className="p-4 space-y-3 text-xs">
            <Meta label="사이클 단계" value={cycleLabel[theme.cycle_stage]} />
            <Meta label="섹터" value={theme.sector} />
            <Meta label="신호" value={signalLabel(theme.signal_status)} color={signalColor(theme.signal_status)} />
            <Meta label="예상 지속" value={theme.duration_estimate} />
          </Panel>
          <Panel className="p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">관련 종목</div>
            <ul className="space-y-1.5">
              {stocks.slice(0, 5).map((s) => (
                <li key={s.ticker} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: signalColor(s.signal_status) }} />
                    <span className="truncate">{s.company_name}</span>
                  </span>
                  <span className="tabular-nums text-muted-foreground">{s.ticker}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium" style={color ? { color } : undefined}>{value}</span>
    </div>
  );
}