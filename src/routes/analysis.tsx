import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, SectionTitle, Badge, Delta } from "@/components/nexflow/primitives";
import { ScoreRing, ScoreBar, NexflowScoreCard } from "@/components/nexflow/widgets";
import { priceSeries, scoreBreakdown, newsEvents } from "@/lib/mock-data";
import {
  Area,
  AreaChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  YAxis,
  XAxis,
} from "recharts";
import { CheckCircle2, XCircle, Calendar, Clock, TrendingDown } from "lucide-react";
import { BookmarkCheck } from "lucide-react";
import { SaveAiSnapshotDialog } from "@/components/nexflow/snapshots";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analysis")({
  head: () => ({ meta: [{ title: "SK하이닉스 분석 — NEXFLOW" }] }),
  component: () => (<AppShell><Analysis /></AppShell>),
});

function Analysis() {
  const [horizon, setHorizon] = useState<"단기" | "1개월" | "3개월" | "장기">("1개월");

  return (
    <div className="space-y-6">
      <Panel className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge intent="info">KOSPI · 반도체</Badge>
              <span className="text-[10px] text-muted-foreground">최종 업데이트 2026.06.24 13:40</span>
            </div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold">SK하이닉스</h1>
              <span className="text-sm text-muted-foreground tabular-nums">000660</span>
            </div>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-2xl font-bold tabular-nums">2,850,000원</span>
              <Delta value={2.15} />
              <span className="text-xs text-muted-foreground">+59,800원</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ScoreRing score={82} size={88} label="NEXFLOW" />
            <div>
              <div className="text-[10px] text-muted-foreground">CURRENT DECISION</div>
              <div className="text-lg font-semibold mt-0.5">보유 우위</div>
              <div className="text-xs text-muted-foreground">신규매수는 눌림 대기</div>
              <Link
                to="/analysis/$ticker/pullback"
                params={{ ticker: "000660" }}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:border-primary/40 hover:text-primary transition-colors"
              >
                <TrendingDown className="h-3.5 w-3.5" />
                하락 분석 보기
              </Link>
              <div className="mt-2">
                <SaveAiSnapshotDialog
                  trigger={
                    <Button size="sm" variant="outline" className="text-xs">
                      <BookmarkCheck className="h-3.5 w-3.5" />
                      추천 전략 저장
                    </Button>
                  }
                />
                <div className="text-[10px] text-muted-foreground mt-1">
                  현재 진입·추가매수·트림·무효화 구간을 저장합니다.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-1 items-center">
          <span className="text-[10px] text-muted-foreground mr-2">투자 기간</span>
          {(["단기", "1개월", "3개월", "장기"] as const).map((h) => (
            <button key={h} onClick={() => setHorizon(h)} className={cn("px-3 py-1 rounded-md text-xs transition border", horizon === h ? "border-[var(--cyan-accent)]/50 bg-[color-mix(in_oklab,var(--cyan-accent)_12%,transparent)] text-[var(--cyan-accent)]" : "border-border/40 text-muted-foreground hover:text-foreground")}>{h}</button>
          ))}
        </div>
      </Panel>

      <NexflowScoreCard
        score={82}
        decision="보유 우위 / 신규매수는 눌림 대기"
        confidence="높음"
        note="HBM 중심의 실적 기대는 유지되고 있으나, 단기 상승폭이 커져 신규 진입 매력은 낮아진 상태입니다. 보유자는 추세 유지가 유리하되, 목표 구간 접근 시 일부 익절 전략이 적합합니다."
      />

      <Panel className="p-5">
        <PanelHeader title="상황별 권장 액션" eyebrow="PLAY BY ROLE" className="!p-0" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
          {[
            { label: "신규매수", value: "대기", intent: "neutral" as const },
            { label: "보유자", value: "유지", intent: "info" as const },
            { label: "수익자", value: "일부 익절", intent: "bullish" as const },
            { label: "하락 시", value: "분할 재매수", intent: "warn" as const },
            { label: "무효화 조건", value: "20일선 이탈", intent: "bearish" as const },
          ].map((c) => (
            <div key={c.label} className="rounded-lg border border-border/50 bg-[var(--surface-2)]/60 p-3">
              <div className="text-[10px] text-muted-foreground">{c.label}</div>
              <Badge intent={c.intent} className="mt-1.5">{c.value}</Badge>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="p-5">
        <PanelHeader title="가격 구간 차트" eyebrow="PRICE ZONES" subtitle="현재가 기준 매수·목표·손절 구간 시각화" className="!p-0" />
        <div className="h-[340px] mt-4 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceSeries} margin={{ left: 50, right: 16, top: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="aFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--cyan-accent)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--cyan-accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} stroke="oklch(0.3 0.03 265 / 0.4)" />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} stroke="oklch(0.3 0.03 265 / 0.4)" domain={[2400000, 3300000]} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <ReferenceArea y1={2400000} y2={2620000} fill="var(--bearish)" fillOpacity={0.08} label={{ value: "손절/무효화", fontSize: 9, fill: "var(--bearish)", position: "insideTopLeft" }} />
              <ReferenceArea y1={2700000} y2={2780000} fill="var(--cyan-accent)" fillOpacity={0.1} label={{ value: "매수 관심", fontSize: 9, fill: "var(--cyan-accent)", position: "insideTopLeft" }} />
              <ReferenceArea y1={3050000} y2={3200000} fill="var(--bullish)" fillOpacity={0.1} label={{ value: "목표 구간", fontSize: 9, fill: "var(--bullish)", position: "insideTopLeft" }} />
              <ReferenceArea y1={3200000} y2={3300000} fill="var(--neutral-accent)" fillOpacity={0.1} label={{ value: "과열", fontSize: 9, fill: "var(--neutral-accent)", position: "insideTopLeft" }} />
              <ReferenceLine y={2850000} stroke="var(--cyan-accent)" strokeDasharray="4 4" label={{ value: "현재가 2,850,000", fontSize: 10, fill: "var(--cyan-accent)", position: "right" }} />
              <Tooltip contentStyle={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`${v.toLocaleString()}원`, "가격"]} labelFormatter={(l) => `Day ${l}`} />
              <Area type="monotone" dataKey="price" stroke="var(--cyan-accent)" strokeWidth={2} fill="url(#aFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4 text-xs">
          <ZoneTag label="하단 리스크" value="2,620,000원" color="var(--bearish)" />
          <ZoneTag label="1차 매수" value="2,700,000원" color="var(--cyan-accent)" />
          <ZoneTag label="현재가" value="2,850,000원" color="var(--foreground)" />
          <ZoneTag label="1차 목표" value="3,050,000원" color="var(--bullish)" />
          <ZoneTag label="2차 목표" value="3,200,000원" color="var(--bullish)" />
        </div>
      </Panel>

      <div>
        <SectionTitle eyebrow="SCENARIOS" title="조건부 시나리오" description="각 시나리오의 확률·범위·조건·전략" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ScenarioCard tone="bullish" title="강세 시나리오" probability={42} range="+12% ~ +20%"
            conditions={["외국인 순매수 지속", "HBM 수요 기대 유지", "글로벌 반도체 섹터 강세", "실적 컨센서스 상향"]}
            strategy="보유자는 추세 유지, 목표 구간 접근 시 20~30% 분할 익절" />
          <ScenarioCard tone="neutral" title="중립 시나리오" probability={38} range="-5% ~ +8%"
            conditions={["호재는 유지되지만 추가 모멘텀 둔화", "주가가 고점권에서 횡보", "수급 혼조"]}
            strategy="신규매수는 대기, 보유자는 핵심 비중 유지" />
          <ScenarioCard tone="bearish" title="약세 시나리오" probability={20} range="-10% ~ -18%"
            conditions={["외국인 3거래일 연속 대량 순매도", "미국 반도체주 조정", "실적 기대 둔화", "20일선 이탈"]}
            strategy="지지선 이탈 시 비중 축소, 재진입은 하단 구간 확인 후" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel className="p-5">
          <PanelHeader title="점수 구성" eyebrow="SCORE BREAKDOWN" subtitle="6개 축으로 본 종합점수" className="!p-0" />
          <div className="mt-5 space-y-3">
            {scoreBreakdown.map((s) => (<ScoreBar key={s.label} label={s.label} value={s.value} inverted={s.inverted} />))}
          </div>
        </Panel>

        <Panel className="p-5">
          <PanelHeader title="밸류에이션" eyebrow="VALUATION" subtitle="동종 그룹 비교" className="!p-0" />
          <div className="grid grid-cols-3 gap-3 mt-4">
            <ValueStat label="Forward PER" value="9.2x" hint="평균 12.5x" />
            <ValueStat label="PBR" value="1.8x" hint="평균 1.6x" />
            <ValueStat label="ROE" value="22.4%" hint="우상향" />
          </div>
          <div className="mt-5">
            <div className="text-[10px] text-muted-foreground mb-2">컨센서스 영업이익 추이</div>
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceSeries.slice(-30).map((_, i) => ({ day: i, v: 10 + i * 0.3 + Math.sin(i / 3) * 0.5 }))}>
                  <defs>
                    <linearGradient id="vFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--bullish)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--bullish)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="var(--bullish)" fill="url(#vFill)" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-5">
            <div className="text-[10px] text-muted-foreground mb-2">Peer 비교 (Forward PER)</div>
            <div className="space-y-2">
              {[
                { name: "SK하이닉스", v: 9.2, hl: true },
                { name: "삼성전자", v: 11.1, hl: false },
                { name: "Micron", v: 10.4, hl: false },
                { name: "TSMC", v: 18.7, hl: false },
              ].map((p) => (
                <div key={p.name} className="flex items-center gap-2">
                  <div className={cn("text-xs w-20", p.hl ? "text-foreground font-semibold" : "text-muted-foreground")}>{p.name}</div>
                  <div className="flex-1 h-1.5 rounded-full bg-muted/40 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(p.v / 20) * 100}%`, background: p.hl ? "var(--cyan-accent)" : "var(--muted-foreground)" }} />
                  </div>
                  <div className="text-xs tabular-nums w-12 text-right">{p.v}x</div>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <Panel className="p-5">
        <PanelHeader title="판단 변경 조건" eyebrow="THESIS VALIDATION" subtitle="현재 판단을 강화 또는 무효화하는 조건들" className="!p-0" />
        <div className="grid md:grid-cols-2 gap-5 mt-5">
          <div>
            <div className="flex items-center gap-2 text-[var(--bullish)] text-sm font-semibold mb-3">
              <CheckCircle2 className="h-4 w-4" /> 강화 확인 조건
            </div>
            <ul className="space-y-2">
              {["실적 컨센서스 추가 상향", "외국인 순매수 지속", "HBM 관련 추가 공급 뉴스", "반도체 지수 신고가"].map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm bg-[color-mix(in_oklab,var(--bullish)_8%,transparent)] border border-[var(--bullish)]/20 rounded-lg px-3 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--bullish)] mt-2 shadow-[0_0_6px_var(--bullish)]" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 text-[var(--bearish)] text-sm font-semibold mb-3">
              <XCircle className="h-4 w-4" /> 무효화 조건
            </div>
            <ul className="space-y-2">
              {["20일선 종가 이탈", "외국인 수급 급변", "Micron/NVIDIA 실적 실망", "DRAM 가격 상승 둔화", "원/달러 급등에 따른 외국인 매도"].map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm bg-[color-mix(in_oklab,var(--bearish)_8%,transparent)] border border-[var(--bearish)]/20 rounded-lg px-3 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--bearish)] mt-2 shadow-[0_0_6px_var(--bearish)]" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Panel>

      <Panel className="p-5">
        <PanelHeader title="뉴스 · 이벤트" eyebrow="CATALYSTS" subtitle="향후 2주 주요 이벤트" className="!p-0" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {newsEvents.map((n) => (
            <div key={n.title} className="rounded-xl border border-border/50 bg-[var(--surface-2)]/60 p-4 hover:border-[var(--cyan-accent)]/40 transition">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-2">
                <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {n.date}</span>
                <Badge intent="neutral">{n.category}</Badge>
              </div>
              <div className="text-sm font-semibold">{n.title}</div>
              <div className="flex items-center justify-between mt-3">
                <Badge intent={n.impact === "긍정" ? "bullish" : n.impact === "부정" ? "bearish" : "warn"}>예상 {n.impact}</Badge>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground"><Clock className="h-3 w-3" /> 영향도 {n.score}/10</div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function ZoneTag({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-[var(--surface-2)]/60 px-3 py-2">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold tabular-nums mt-0.5" style={{ color }}>{value}</div>
    </div>
  );
}

function ValueStat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-[var(--surface-2)]/60 p-3">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="text-lg font-bold tabular-nums mt-1">{value}</div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{hint}</div>
    </div>
  );
}

function ScenarioCard({
  tone, title, probability, range, conditions, strategy,
}: {
  tone: "bullish" | "neutral" | "bearish";
  title: string;
  probability: number;
  range: string;
  conditions: string[];
  strategy: string;
}) {
  const map = {
    bullish: "var(--bullish)",
    neutral: "var(--neutral-accent)",
    bearish: "var(--bearish)",
  } as const;
  const c = map[tone];
  return (
    <Panel className="p-5 relative overflow-hidden border-t-2" style={{ borderTopColor: c } as React.CSSProperties}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: c }}>{title}</div>
          <div className="text-xs text-muted-foreground mt-1">예상 범위 {range}</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold tabular-nums" style={{ color: c }}>{probability}%</div>
          <div className="text-[10px] text-muted-foreground">확률</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">조건</div>
        <ul className="space-y-1.5">
          {conditions.map((cd) => (
            <li key={cd} className="text-xs text-foreground/90 flex items-start gap-2">
              <span className="h-1 w-1 rounded-full mt-2" style={{ background: c }} />
              <span>{cd}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 pt-4 border-t border-border/40">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">전략</div>
        <p className="text-xs text-foreground/90 leading-relaxed">{strategy}</p>
      </div>
    </Panel>
  );
}