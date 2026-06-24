import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, SectionTitle, Badge } from "@/components/nexflow/primitives";
import { ScenarioBar } from "@/components/nexflow/widgets";
import { stocks } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, Minus, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/scenario")({
  head: () => ({ meta: [{ title: "시나리오 시뮬레이터 — NEXFLOW" }] }),
  component: () => (<AppShell><Scenario /></AppShell>),
});

function Scenario() {
  const [stock, setStock] = useState(stocks[0].ticker);
  const [market, setMarket] = useState<"강세장" | "중립장" | "조정장" | "고변동성장">("중립장");
  const [horizon, setHorizon] = useState<"단기" | "1개월" | "3개월" | "장기">("1개월");
  const [risk, setRisk] = useState<"공격형" | "균형형" | "방어형">("균형형");
  const [amount, setAmount] = useState(50_000_000);
  const [avg, setAvg] = useState(2_410_000);

  const cur = stocks.find((s) => s.ticker === stock)!;

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="SCENARIO ENGINE" title="시나리오 시뮬레이터" description="가정을 바꾸며 시나리오 분기와 권장 액션을 즉시 확인합니다." />

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">
        <Panel className="p-5">
          <PanelHeader title="가정 입력" eyebrow="INPUTS" className="!p-0" />
          <div className="mt-5 space-y-4">
            <Field label="종목">
              <select value={stock} onChange={(e) => setStock(e.target.value)} className="w-full h-10 rounded-lg bg-muted/40 border border-border/50 px-3 text-sm">
                {stocks.map((s) => <option key={s.ticker} value={s.ticker}>{s.name} · {s.ticker}</option>)}
              </select>
            </Field>
            <Field label="투자 기간">
              <ChipRow value={horizon} onChange={setHorizon} options={["단기", "1개월", "3개월", "장기"]} />
            </Field>
            <Field label="현재 보유 금액 (KRW)">
              <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full h-10 rounded-lg bg-muted/40 border border-border/50 px-3 text-sm tabular-nums" />
            </Field>
            <Field label="평균 매수 단가">
              <input type="number" value={avg} onChange={(e) => setAvg(Number(e.target.value))} className="w-full h-10 rounded-lg bg-muted/40 border border-border/50 px-3 text-sm tabular-nums" />
            </Field>
            <Field label="리스크 성향">
              <ChipRow value={risk} onChange={setRisk} options={["공격형", "균형형", "방어형"]} />
            </Field>
            <Field label="시장 상황">
              <ChipRow value={market} onChange={setMarket} options={["강세장", "중립장", "조정장", "고변동성장"]} />
            </Field>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel className="p-5">
            <PanelHeader title="결과 요약" eyebrow="OUTPUTS" subtitle={`${cur.name} · ${market} · ${horizon} · ${risk}`} className="!p-0" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <OutBox label="기대 상승" value="+14.2%" color="var(--bullish)" />
              <OutBox label="기대 하락" value="-9.6%" color="var(--bearish)" />
              <OutBox label="R/R 비율" value="1.48 : 1" color="var(--cyan-accent)" />
              <OutBox label="권장 비중" value="18~22%" color="var(--violet-accent)" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-border/50 bg-[var(--surface-2)]/60 p-3">
                <div className="text-[10px] text-muted-foreground">권장 매수 구간</div>
                <div className="font-semibold mt-1 tabular-nums">{cur.buyZone}</div>
              </div>
              <div className="rounded-lg border border-border/50 bg-[var(--surface-2)]/60 p-3">
                <div className="text-[10px] text-muted-foreground">권장 익절 구간</div>
                <div className="font-semibold mt-1 tabular-nums text-[var(--bullish)]">{cur.targetZone}</div>
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground mt-3">평균 단가 기준 {avg.toLocaleString()}원 · 보유 금액 {amount.toLocaleString()}원</div>
          </Panel>

          <Panel className="p-5">
            <PanelHeader title="시나리오 트리" eyebrow="BRANCHES" subtitle="현재가에서 분기하는 3가지 흐름" className="!p-0" right={<GitBranch className="h-4 w-4 text-muted-foreground" />} />
            <div className="mt-6">
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-xl glass px-5 py-3 text-center">
                  <div className="text-[10px] text-muted-foreground">현재가</div>
                  <div className="text-lg font-bold text-[var(--cyan-accent)] tabular-nums">{cur.price.toLocaleString()}{cur.currency === "KRW" ? "원" : ""}</div>
                </div>
              </div>
              <div className="relative">
                <svg className="absolute inset-x-0 top-0 h-8 w-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M50,0 L20,20" stroke="var(--bullish)" strokeWidth="0.3" />
                  <path d="M50,0 L50,20" stroke="var(--neutral-accent)" strokeWidth="0.3" />
                  <path d="M50,0 L80,20" stroke="var(--bearish)" strokeWidth="0.3" />
                </svg>
                <div className="grid grid-cols-3 gap-3 pt-8">
                  <BranchCard tone="bullish" icon={TrendingUp} title="강세" probability={cur.bullishProbability} range={cur.targetZone} triggers={["외국인 순매수 유입", "실적 컨센서스 상향"]} action="20~30% 분할 익절" />
                  <BranchCard tone="neutral" icon={Minus} title="중립" probability={cur.neutralProbability} range="횡보 박스권" triggers={["수급 혼조", "추가 모멘텀 부재"]} action="핵심 비중 유지" />
                  <BranchCard tone="bearish" icon={TrendingDown} title="약세" probability={cur.bearishProbability} range={cur.invalidationZone} triggers={["지지선 이탈", "섹터 동반 조정"]} action="비중 축소 후 재진입" />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <div className="text-[10px] text-muted-foreground mb-2">확률 분포</div>
              <ScenarioBar bullish={cur.bullishProbability} neutral={cur.neutralProbability} bearish={cur.bearishProbability} />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div><div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">{label}</div>{children}</div>);
}

function ChipRow<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: readonly T[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} className={cn("px-3 py-1.5 rounded-md text-xs transition border", value === o ? "border-[var(--cyan-accent)]/60 bg-[color-mix(in_oklab,var(--cyan-accent)_15%,transparent)] text-[var(--cyan-accent)]" : "border-border/50 text-muted-foreground hover:text-foreground")}>{o}</button>
      ))}
    </div>
  );
}

function OutBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-[var(--surface-2)]/60 p-3">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="text-lg font-bold tabular-nums mt-1" style={{ color }}>{value}</div>
    </div>
  );
}

function BranchCard({ tone, icon: Icon, title, probability, range, triggers, action }: { tone: "bullish" | "neutral" | "bearish"; icon: typeof TrendingUp; title: string; probability: number; range: string; triggers: string[]; action: string }) {
  const colorMap = { bullish: "var(--bullish)", neutral: "var(--neutral-accent)", bearish: "var(--bearish)" } as const;
  const c = colorMap[tone];
  return (
    <div className="rounded-xl border border-border/50 bg-[var(--surface-2)]/60 p-4" style={{ borderColor: `color-mix(in oklab, ${c} 35%, transparent)` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Icon className="h-4 w-4" style={{ color: c }} /><span className="text-sm font-semibold" style={{ color: c }}>{title}</span></div>
        <span className="text-base font-bold tabular-nums" style={{ color: c }}>{probability}%</span>
      </div>
      <div className="mt-3 text-xs"><div className="text-[10px] text-muted-foreground">예상 구간</div><div className="font-medium tabular-nums mt-0.5">{range}</div></div>
      <div className="mt-3"><div className="text-[10px] text-muted-foreground mb-1">트리거</div>
        <ul className="space-y-1">{triggers.map((t) => (<li key={t} className="text-[11px] text-foreground/90 flex gap-1.5"><span style={{ color: c }}>•</span>{t}</li>))}</ul>
      </div>
      <div className="mt-3 pt-3 border-t border-border/40"><Badge intent={tone === "neutral" ? "warn" : tone}>{action}</Badge></div>
    </div>
  );
}