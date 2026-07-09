import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, SectionTitle, Badge, Delta } from "@/components/nexflow/primitives";
import { ScenarioBar } from "@/components/nexflow/widgets";
import { stocks, exposureBreakdown, formatPrice } from "@/lib/mock-data";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { AlertTriangle, ArrowUpRight, Sparkles, Wallet, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "대시보드 — NEXFLOW" }] }),
  component: () => (
    <AppShell>
      <Dashboard />
    </AppShell>
  ),
});

type SignalTone = "bullish" | "bearish" | "neutral" | "info" | "warn";

function SignalDot({ tone }: { tone: SignalTone }) {
  const color =
    tone === "bullish"
      ? "var(--bullish)"
      : tone === "bearish"
        ? "var(--bearish)"
        : tone === "info"
          ? "var(--cyan-accent)"
          : tone === "warn"
            ? "var(--neutral-accent)"
            : "var(--muted-foreground)";
  return (
    <span
      className="inline-block h-2 w-2 rounded-full shrink-0"
      style={{ background: color, boxShadow: `0 0 6px ${color}` }}
    />
  );
}

type MarketSlot = {
  label: string;
  tone: SignalTone;
  headline: string;
  detail?: string;
  rows: { name: string; value: string; change: number }[];
};

const marketSlots: MarketSlot[] = [
  {
    label: "시장 분위기",
    tone: "bullish",
    headline: "위험선호 우위",
    detail: "외국인 순매수 3일 연속",
    rows: [
      { name: "코스피", value: "2,724.18", change: 0.82 },
      { name: "나스닥 선물", value: "20,418.50", change: -0.15 },
    ],
  },
  {
    label: "1위 테마",
    tone: "info",
    headline: "AI 반도체",
    detail: "HBM 수요 견조",
    rows: [
      { name: "필라델피아 반도체", value: "5,832.10", change: 1.34 },
      { name: "KRX 반도체", value: "3,948.20", change: 1.08 },
    ],
  },
  {
    label: "환율",
    tone: "warn",
    headline: "1,382.5",
    detail: "원화 약세 지속",
    rows: [
      { name: "원/달러", value: "1,382.5", change: 0.31 },
      { name: "달러 인덱스", value: "104.82", change: 0.18 },
    ],
  },
  {
    label: "VIX",
    tone: "bullish",
    headline: "14.2",
    detail: "변동성 안정 구간",
    rows: [
      { name: "VIX", value: "14.2", change: -1.4 },
      { name: "MOVE", value: "98.4", change: -0.6 },
    ],
  },
  {
    label: "금리 압박",
    tone: "neutral",
    headline: "중립",
    detail: "美 10년물 4.18%",
    rows: [
      { name: "美 10년물", value: "4.18%", change: 0.02 },
      { name: "韓 3년물", value: "3.24%", change: -0.01 },
    ],
  },
];

const riskAlerts = [
  {
    tone: "warn" as SignalTone,
    text: "반도체 섹터 과열 신호 — SOX 상대강도 90 백분위 진입, 단기 되돌림 가능성이 커지고 있습니다.",
  },
  {
    tone: "warn" as SignalTone,
    text: "환율 상승으로 외국인 수급 변동성 확대 — 원/달러 1,385원 돌파 시 순매도 전환 이력이 반복됩니다.",
  },
  {
    tone: "bearish" as SignalTone,
    text: "보유 종목 간 상관관계 높음 — AI 반도체 노출 48%로 개별 리스크가 포트폴리오 전체로 전이될 수 있습니다.",
  },
];

const todayActions = [
  { intent: "warn" as const, label: "SK하이닉스", text: "보유 우위, 1차 익절 구간 근접" },
  { intent: "info" as const, label: "NVDA", text: "신규매수는 눌림 대기" },
  { intent: "bearish" as const, label: "QLD", text: "변동성 확대, 비중 관리 필요" },
];

const scenarioSummary =
  "실적 기대는 유지되지만 단기 주가 상승폭이 커져 신규 진입은 가격 조정 확인 후 접근이 유리합니다. 외국인 수급이 이어지는 동안에는 보유 우위를 유지하되, 환율 급등 구간에서는 방어선 이탈 여부를 우선 점검하는 것이 좋습니다.";

function Dashboard() {
  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="DAILY OVERVIEW"
        title="오늘의 의사결정 보드"
        description="시장 흐름·포트폴리오 상태·우선 조치 사항을 한 화면에서 확인합니다."
      />

      {/* Zone A — Market Status hero */}
      <MarketStatusHero />

      {/* Zone B — Risk (8) + Actions (4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4">
        <Panel className="p-5 xl:col-span-8">
          <PanelHeader
            title="리스크 알림"
            eyebrow="RISK"
            subtitle="포트폴리오·시장 전반의 우선 점검 항목"
            className="!p-0"
            right={<AlertTriangle className="h-4 w-4 text-[var(--neutral-accent)]" />}
          />
          <ul className="mt-5 space-y-3">
            {riskAlerts.map((r, i) => (
              <li
                key={i}
                title={r.text}
                className="flex items-start gap-3 rounded-xl bg-[var(--surface-2)]/50 border border-border/40 px-4 py-3"
              >
                <span className="mt-1.5">
                  <SignalDot tone={r.tone} />
                </span>
                <p
                  className="text-sm leading-relaxed text-foreground/90 break-keep"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {r.text}
                </p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="p-5 xl:col-span-4">
          <PanelHeader
            title="오늘의 액션"
            eyebrow="ACTIONS"
            className="!p-0"
            right={<Sparkles className="h-4 w-4 text-[var(--cyan-accent)]" />}
          />
          <ul className="mt-5 space-y-3">
            {todayActions.map((a) => (
              <li key={a.label} className="flex items-start gap-2">
                <Badge intent={a.intent}>{a.label}</Badge>
                <span
                  className="text-xs text-foreground/90 leading-relaxed break-keep min-w-0"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {a.text}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Zone C — Portfolio (4) + Exposure (8) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4">
        <Panel className="p-5 xl:col-span-4">
          <PanelHeader title="내 포트폴리오 상태" eyebrow="PORTFOLIO" className="!p-0" />
          <div className="grid grid-cols-2 gap-4 mt-5">
            <div>
              <div className="text-[10px] text-muted-foreground">총 평가금액</div>
              <div className="text-base font-semibold tabular-nums mt-1">112,840,000원</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground">오늘 손익</div>
              <div className="text-base font-semibold tabular-nums mt-1 text-[var(--bullish)]">
                +1,284,500원
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground">현금 비중</div>
              <div className="text-base font-semibold tabular-nums mt-1">12%</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground">AI 반도체 노출</div>
              <div className="text-base font-semibold tabular-nums mt-1 text-[var(--neutral-accent)]">
                48%
              </div>
            </div>
          </div>
        </Panel>

        <Panel className="p-5 xl:col-span-8">
          <PanelHeader
            title="Portfolio Concentration"
            eyebrow="EXPOSURE"
            subtitle="자산군별 비중과 집중도 리스크"
            className="!p-0"
            right={<Wallet className="h-4 w-4 text-muted-foreground" />}
          />
          <div className="grid md:grid-cols-[220px_1fr] gap-6 mt-5 items-center">
            <div className="h-[160px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={exposureBreakdown}
                    dataKey="value"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={2}
                  >
                    {exposureBreakdown.map((e) => (
                      <Cell key={e.name} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 grid place-items-center pointer-events-none">
                <div className="text-center">
                  <div className="text-[9px] tracking-[0.16em] text-muted-foreground">DOMINANT</div>
                  <div className="text-sm font-semibold text-[var(--cyan-accent)] mt-0.5">
                    AI 반도체
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {exposureBreakdown.map((e) => (
                <div
                  key={e.name}
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-[var(--surface-2)]/50 px-3 py-1.5"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: e.color }}
                  />
                  <span className="text-xs text-foreground/90 break-keep">{e.name}</span>
                  <span className="text-xs font-semibold tabular-nums text-foreground">
                    {e.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* Zone D — Watchlist */}
      <Panel>
        <PanelHeader
          eyebrow="WATCHLIST"
          title="관심종목 랭킹"
          subtitle="NEXFLOW 종합점수 기준 정렬"
          right={<Link to="/watchlist" className="text-xs text-[var(--cyan-accent)] flex items-center gap-1">전체 보기 <ArrowUpRight className="h-3 w-3" /></Link>}
        />
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/50">
                <th className="text-left font-medium px-5 py-2.5">종목</th>
                <th className="text-right font-medium px-3 py-2.5">현재가</th>
                <th className="text-right font-medium px-3 py-2.5">종합점수</th>
                <th className="text-right font-medium px-3 py-2.5">상승여력</th>
                <th className="text-center font-medium px-3 py-2.5">리스크</th>
                <th className="text-left font-medium px-3 py-2.5">판단</th>
                <th className="text-left font-medium px-5 py-2.5">액션</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((s) => (
                <tr key={s.ticker} className="border-b border-border/30 hover:bg-muted/30 transition">
                  <td className="px-5 py-3">
                    <Link to="/analysis" className="block">
                      <div className="font-medium">{s.name}</div>
                      <div className="text-[10px] text-muted-foreground">{s.ticker} · {s.market}</div>
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">{formatPrice(s.price, s.currency)}</td>
                  <td className="px-3 py-3 text-right">
                    <span className="font-semibold tabular-nums text-[var(--cyan-accent)]">{s.score}</span>
                  </td>
                  <td className="px-3 py-3 text-right text-[var(--bullish)] tabular-nums">+{s.upside}%</td>
                  <td className="px-3 py-3 text-center">
                    <Badge intent={s.risk === "낮음" ? "bullish" : s.risk === "높음" ? "bearish" : "warn"}>{s.risk}</Badge>
                  </td>
                  <td className="px-3 py-3 text-foreground/90">{s.decision}</td>
                  <td className="px-5 py-3 text-muted-foreground">{s.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function MarketStatusHero() {
  const [expanded, setExpanded] = useState(false);
  return (
    <Panel className="p-5">
      <PanelHeader
        title="오늘의 시장 상태"
        eyebrow="MARKET"
        subtitle="Regime · 위험선호 우위 · 반도체 주도"
        className="!p-0"
      />

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-x-6 gap-y-5 xl:divide-x xl:divide-border/50">
        {marketSlots.map((slot, i) => (
          <div key={slot.label} className={cn("min-w-0", i > 0 && "xl:pl-6")}>
            <div className="flex items-center gap-2">
              <SignalDot tone={slot.tone} />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {slot.label}
              </span>
            </div>
            <div className="mt-2 text-lg font-semibold text-foreground tabular-nums break-keep">
              {slot.headline}
            </div>
            {slot.detail && (
              <div className="text-[11px] text-muted-foreground mt-0.5 break-keep">
                {slot.detail}
              </div>
            )}
            <div className="mt-3 space-y-1">
              {slot.rows.map((r) => (
                <div
                  key={r.name}
                  className="flex items-center justify-between text-[11px] gap-2"
                >
                  <span className="text-muted-foreground truncate">{r.name}</span>
                  <span className="flex items-center gap-2 tabular-nums">
                    <span className="text-foreground/90">{r.value}</span>
                    <Delta value={r.change} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Scenario snapshot collapsed inside Zone A */}
      <div className="mt-5 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] tracking-tight text-primary font-semibold">
              MARKET REGIME
            </div>
            <div className="text-sm font-semibold text-foreground mt-0.5">Scenario Snapshot</div>
          </div>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1 text-xs text-[var(--cyan-accent)] hover:opacity-80 transition shrink-0"
          >
            {expanded ? "접기" : "자세히"}
            <ChevronDown
              className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")}
            />
          </button>
        </div>

        <div className="mt-3">
          <ScenarioBar bullish={42} neutral={38} bearish={20} />
        </div>

        <p
          className={cn(
            "text-xs text-muted-foreground leading-relaxed break-keep mt-3",
            !expanded && "line-clamp-2",
          )}
        >
          {scenarioSummary}
        </p>
      </div>
    </Panel>
  );
}