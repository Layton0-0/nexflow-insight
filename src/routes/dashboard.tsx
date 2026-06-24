import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, SectionTitle, Badge, Delta } from "@/components/nexflow/primitives";
import { ScenarioBar } from "@/components/nexflow/widgets";
import { marketIndices, stocks, sectorPulse, exposureBreakdown, formatPrice } from "@/lib/mock-data";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { AlertTriangle, ArrowUpRight, Sparkles, Wallet } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "대시보드 — NEXFLOW" }] }),
  component: () => (
    <AppShell>
      <Dashboard />
    </AppShell>
  ),
});

function Dashboard() {
  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="DAILY OVERVIEW"
        title="오늘의 의사결정 보드"
        description="시장 흐름·포트폴리오 상태·우선 조치 사항을 한 화면에서 확인합니다."
      />

      {/* Top summary 4 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Panel className="p-5">
          <PanelHeader title="오늘의 시장 상태" eyebrow="MARKET" subtitle="Regime · 위험선호 우위" className="!p-0" />
          <div className="grid grid-cols-2 gap-3 mt-4">
            {marketIndices.map((m) => (
              <div key={m.name}>
                <div className="text-[10px] text-muted-foreground">{m.name}</div>
                <div className="text-sm font-semibold tabular-nums mt-0.5">{m.value}</div>
                <Delta value={m.change} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-5">
          <PanelHeader title="내 포트폴리오 상태" eyebrow="PORTFOLIO" className="!p-0" />
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div>
              <div className="text-[10px] text-muted-foreground">총 평가금액</div>
              <div className="text-sm font-semibold tabular-nums mt-0.5">112,840,000원</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground">오늘 손익</div>
              <div className="text-sm font-semibold tabular-nums mt-0.5 text-[var(--bullish)]">+1,284,500원</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground">현금 비중</div>
              <div className="text-sm font-semibold tabular-nums mt-0.5">12%</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground">AI 반도체 노출</div>
              <div className="text-sm font-semibold tabular-nums mt-0.5 text-[var(--neutral-accent)]">48%</div>
            </div>
          </div>
        </Panel>

        <Panel className="p-5">
          <PanelHeader title="오늘의 액션" eyebrow="ACTIONS" className="!p-0" right={<Sparkles className="h-4 w-4 text-[var(--cyan-accent)]" />} />
          <ul className="mt-4 space-y-3 text-xs">
            <li className="flex gap-2">
              <Badge intent="warn">SK하이닉스</Badge>
              <span className="text-foreground/90">보유 우위, 1차 익절 구간 근접</span>
            </li>
            <li className="flex gap-2">
              <Badge intent="info">NVDA</Badge>
              <span className="text-foreground/90">신규매수는 눌림 대기</span>
            </li>
            <li className="flex gap-2">
              <Badge intent="bearish">QLD</Badge>
              <span className="text-foreground/90">변동성 확대, 비중 관리 필요</span>
            </li>
          </ul>
        </Panel>

        <Panel className="p-5">
          <PanelHeader title="리스크 알림" eyebrow="RISK" className="!p-0" right={<AlertTriangle className="h-4 w-4 text-[var(--neutral-accent)]" />} />
          <ul className="mt-4 space-y-3 text-xs text-foreground/90">
            <li className="flex items-start gap-2"><span className="text-[var(--neutral-accent)] mt-1">●</span> 반도체 섹터 과열 신호</li>
            <li className="flex items-start gap-2"><span className="text-[var(--neutral-accent)] mt-1">●</span> 환율 상승으로 외국인 수급 변동성 확대</li>
            <li className="flex items-start gap-2"><span className="text-[var(--bearish)] mt-1">●</span> 보유 종목 간 상관관계 높음</li>
          </ul>
        </Panel>
      </div>

      {/* Watchlist ranking */}
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

      {/* Market pulse + scenario snapshot */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <Panel className="p-5">
            <PanelHeader title="Market Pulse" eyebrow="LIVE" subtitle="섹터·환율·금리·변동성 동시 관찰" className="!p-0" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
              <PulseChart label="반도체 상대강도" data={sectorPulse} dataKey="sox" color="var(--cyan-accent)" value="+6.4%" intent="bullish" />
              <PulseChart label="원/달러" data={sectorPulse} dataKey="usdkrw" color="var(--neutral-accent)" value="1,382.5" intent="neutral" />
              <PulseChart label="美 10년물" data={sectorPulse} dataKey="us10y" color="var(--violet-accent)" value="4.18%" intent="neutral" />
              <PulseChart label="VIX" data={sectorPulse} dataKey="vix" color="var(--bearish)" value="14.2" intent="bullish" />
            </div>
          </Panel>
        </div>

        <Panel className="p-5">
          <PanelHeader title="Scenario Snapshot" eyebrow="MARKET REGIME" className="!p-0" />
          <div className="mt-5">
            <ScenarioBar bullish={42} neutral={38} bearish={20} />
          </div>
          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
            실적 기대는 유지되지만 단기 주가 상승폭이 커져 신규 진입은 가격 조정 확인 후 접근이
            유리합니다.
          </p>
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div className="rounded-lg bg-[color-mix(in_oklab,var(--bullish)_12%,transparent)] py-2">
              <div className="text-[10px] text-muted-foreground">강세</div>
              <div className="font-semibold text-[var(--bullish)]">42%</div>
            </div>
            <div className="rounded-lg bg-[color-mix(in_oklab,var(--neutral-accent)_12%,transparent)] py-2">
              <div className="text-[10px] text-muted-foreground">중립</div>
              <div className="font-semibold text-[var(--neutral-accent)]">38%</div>
            </div>
            <div className="rounded-lg bg-[color-mix(in_oklab,var(--bearish)_12%,transparent)] py-2">
              <div className="text-[10px] text-muted-foreground">약세</div>
              <div className="font-semibold text-[var(--bearish)]">20%</div>
            </div>
          </div>
        </Panel>
      </div>

      {/* Portfolio concentration */}
      <Panel className="p-5">
        <PanelHeader title="Portfolio Concentration" eyebrow="EXPOSURE" subtitle="자산군별 비중과 집중도 리스크" className="!p-0" right={<Wallet className="h-4 w-4 text-muted-foreground" />} />
        <div className="grid md:grid-cols-[260px_1fr] gap-6 mt-4 items-center">
          <div className="h-[220px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={exposureBreakdown} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={2}>
                  {exposureBreakdown.map((e) => (<Cell key={e.name} fill={e.color} />))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="text-center">
                <div className="text-[10px] text-muted-foreground">집중도</div>
                <div className="text-xl font-bold text-[var(--neutral-accent)]">중간</div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {exposureBreakdown.map((e) => (
              <div key={e.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: e.color }} />{e.name}</span>
                  <span className="font-semibold tabular-nums">{e.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                  <div className="h-full" style={{ width: `${e.value}%`, background: e.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}

function PulseChart({
  label,
  data,
  dataKey,
  color,
  value,
  intent,
}: {
  label: string;
  data: Array<Record<string, number>>;
  dataKey: string;
  color: string;
  value: string;
  intent: "bullish" | "bearish" | "neutral";
}) {
  const intentClr = intent === "bullish" ? "text-[var(--bullish)]" : intent === "bearish" ? "text-[var(--bearish)]" : "text-muted-foreground";
  return (
    <div className="rounded-xl bg-[var(--surface-2)]/60 border border-border/40 p-3">
      <div className="flex items-center justify-between mb-1">
        <div className="text-[10px] text-muted-foreground">{label}</div>
        <div className={`text-xs font-semibold tabular-nums ${intentClr}`}>{value}</div>
      </div>
      <div className="h-12 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}