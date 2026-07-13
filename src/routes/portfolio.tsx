import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, SectionTitle, Badge, Delta, Stat } from "@/components/nexflow/primitives";
import { EmptyState } from "@/components/nexflow/auth-panels";
import { portfolioHoldings, exposureBreakdown, formatPrice } from "@/lib/mock-data";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChevronDown, Shield, TrendingUp, Scale, Briefcase, Bot, KeyRound, LockKeyhole } from "lucide-react";
import { BookmarkCheck } from "lucide-react";
import { SavePersonalSnapshotDialog } from "@/components/nexflow/snapshots";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/portfolio")({
  head: () => ({ meta: [{ title: "포트폴리오 — NEXFLOW" }] }),
  component: () => (<AppShell><Portfolio /></AppShell>),
});

function Portfolio() {
  type Ctx = "manual" | "paper" | "live";
  // Mock connectivity: paper connected, live not connected → default hint = paper
  const paperConnected = true;
  const liveConnected = false;
  const defaultCtx: Ctx = liveConnected ? "live" : paperConnected ? "paper" : "manual";
  const [ctx, setCtx] = useState<Ctx>(defaultCtx);

  const ctxMeta: Record<Ctx, { label: string; icon: typeof Briefcase; broker?: string; lastSync?: string }> = {
    manual: { label: "수동 입력", icon: Briefcase },
    paper: { label: "모의계좌", icon: Bot, broker: "한국투자 · KIS Paper", lastSync: "2026.06.24 09:12" },
    live: { label: "실계좌", icon: KeyRound },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <SectionTitle eyebrow="PORTFOLIO" title="포트폴리오 분석" description="보유 종목을 판단 관점에서 진단합니다." />
        <SavePersonalSnapshotDialog
          trigger={
            <Button>
              <BookmarkCheck className="h-4 w-4" />
              내 투자 스냅샷 추가
            </Button>
          }
        />
      </div>

      <Panel className="p-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex p-1 rounded-lg bg-muted/40 border border-border/40">
            {(["manual", "paper", "live"] as Ctx[]).map((c) => {
              const Icon = ctxMeta[c].icon;
              return (
                <button
                  key={c}
                  onClick={() => setCtx(c)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs transition inline-flex items-center gap-1.5",
                    ctx === c ? "bg-[var(--surface-3)] text-foreground" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {ctxMeta[c].label}
                </button>
              );
            })}
          </div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-2">
            {ctx === "paper" && ctxMeta.paper.broker && (
              <>
                <span>{ctxMeta.paper.broker}</span>
                <span className="opacity-40">·</span>
                <span className="tabular">마지막 동기화 {ctxMeta.paper.lastSync}</span>
              </>
            )}
            {ctx === "live" && (
              <span className="inline-flex items-center gap-1">
                <LockKeyhole className="h-3 w-3" /> 실계좌 미연동
              </span>
            )}
            {ctx === "manual" && <span>수동 입력한 보유 종목만 표시됩니다.</span>}
          </div>
          <div className="ml-auto text-[11px] text-muted-foreground">
            컨텍스트 전환 시 보유·합계는 절대 합산되지 않습니다.
          </div>
        </div>
      </Panel>

      {ctx !== "manual" && (
        (ctx === "live" && !liveConnected) || (ctx === "paper" && !paperConnected) ? (
          <EmptyState
            icon={ctx === "live" ? <KeyRound className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
            title={ctx === "live" ? "연동된 실계좌가 없습니다" : "연동된 모의계좌가 없습니다"}
            description="자동투자 > 증권사 연동에서 계좌를 연결하면 이곳에서 보유 · 손익 · 리스크가 표시됩니다."
            ctaLabel="증권사 연동"
            ctaTo="/automation"
            secondary={
              <span className="text-[11px] text-muted-foreground">마지막 동기화 · —</span>
            }
          />
        ) : (
          <PortfolioBody source={ctx} />
        )
      )}

      {ctx === "manual" && <PortfolioBody source="manual" />}
    </div>
  );
}

function PortfolioBody({ source }: { source: "manual" | "paper" | "live" }) {
  const sourceChip =
    source === "manual" ? { label: "수동", intent: "neutral" as const }
    : source === "paper" ? { label: "브로커 (모의)", intent: "info" as const }
    : { label: "브로커 (실전)", intent: "warn" as const };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Panel className="p-5"><Stat label="총 평가금액" value="112,840,000원" suffix="KRW" /></Panel>
        <Panel className="p-5"><Stat label="총 손익" value="+18,420,000원" intent="bullish" delta={<Delta value={19.5} />} /></Panel>
        <Panel className="p-5"><Stat label="현금 비중" value="12%" suffix="of total" /></Panel>
        <Panel className="p-5"><Stat label="위험 점수" value="64" suffix="/ 100" intent="neutral" /></Panel>
        <Panel className="p-5"><Stat label="집중도 점수" value="71" suffix="중간" /></Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4">
        <Panel className="p-5">
          <PanelHeader title="자산 배분" eyebrow="ALLOCATION" className="!p-0" />
          <div className="h-[240px] mt-2 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={exposureBreakdown} dataKey="value" innerRadius={70} outerRadius={100} paddingAngle={2}>
                  {exposureBreakdown.map((e) => (<Cell key={e.name} fill={e.color} />))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="text-center">
                <div className="text-[10px] text-muted-foreground">DOMINANT</div>
                <div className="text-lg font-bold text-[var(--cyan-accent)]">AI 반도체</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {exposureBreakdown.map((e) => (
              <div key={e.name} className="text-xs flex items-center justify-between bg-[var(--surface-2)]/60 border border-border/40 rounded-md px-2.5 py-1.5">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: e.color }} />{e.name}</span>
                <span className="font-semibold tabular-nums">{e.value}%</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-5">
          <PanelHeader title="섹터 노출도" eyebrow="EXPOSURE BARS" className="!p-0" />
          <div className="mt-4 space-y-3">
            {[
              { name: "AI 반도체", v: 48, intent: "bearish" as const, note: "과집중 주의" },
              { name: "미국 성장주", v: 31, intent: "neutral" as const, note: "적정" },
              { name: "레버리지 ETF", v: 14, intent: "bearish" as const, note: "변동성 큼" },
              { name: "한국 단일종목", v: 26, intent: "neutral" as const, note: "단일위험" },
              { name: "현금", v: 12, intent: "info" as const, note: "여유 있음" },
            ].map((b) => (
              <div key={b.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>{b.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge intent={b.intent}>{b.note}</Badge>
                    <span className="font-semibold tabular-nums">{b.v}%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[var(--cyan-accent)] to-[var(--violet-accent)]" style={{ width: `${b.v}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-[var(--neutral-accent)]/30 bg-[color-mix(in_oklab,var(--neutral-accent)_10%,transparent)] p-4">
            <div className="text-xs font-semibold text-[var(--neutral-accent)] mb-1">리스크 인사이트</div>
            <p className="text-xs text-foreground/90 leading-relaxed">현재 포트폴리오는 AI 반도체와 미국 성장주 방향성에 민감합니다. 상승장에서는 수익 탄력이 크지만, 반도체 섹터 조정 시 동시 하락 가능성이 높습니다.</p>
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHeader title="보유 종목" eyebrow="HOLDINGS" subtitle="행을 펼쳐 보유 근거와 액션 구간을 확인하세요" />
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/50">
                <th className="text-left font-medium px-5 py-3">종목</th>
                <th className="text-left font-medium px-3 py-3">소스</th>
                <th className="text-right font-medium px-3 py-3">수량</th>
                <th className="text-right font-medium px-3 py-3">평단</th>
                <th className="text-right font-medium px-3 py-3">현재가</th>
                <th className="text-right font-medium px-3 py-3">수익률</th>
                <th className="text-left font-medium px-3 py-3">판단</th>
                <th className="text-left font-medium px-3 py-3">권장 액션</th>
                <th className="text-right font-medium px-3 py-3">익절</th>
                <th className="text-right font-medium px-3 py-3">방어</th>
                <th className="text-right font-medium px-5 py-3">스냅샷</th>
              </tr>
            </thead>
            <tbody>
              {portfolioHoldings.map((h) => {
                const ret = ((h.price - h.avgPrice) / h.avgPrice) * 100;
                return <HoldingRow key={h.ticker} h={h} ret={ret} sourceChip={sourceChip} />;
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <div>
        <SectionTitle eyebrow="ACTION PLAN" title="유형별 실행 플랜" description="동일 포트폴리오에서 성향별로 다른 전략을 제시합니다." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PlanCard icon={TrendingUp} title="공격형" color="var(--bullish)" desc="추세 유지, 조정 시 추가매수" details={["AI 반도체 비중 유지", "QLD 변동성 활용", "현금 8% 유지"]} />
          <PlanCard icon={Scale} title="균형형" color="var(--cyan-accent)" desc="SK하이닉스 일부 익절 후 현금 확보" details={["SK하이닉스 30% 익절", "QLD 50% 축소", "현금 20% 확보"]} />
          <PlanCard icon={Shield} title="방어형" color="var(--neutral-accent)" desc="레버리지 ETF 비중 축소, 현금 비중 확대" details={["QLD 전량 매도", "SPY 비중 유지", "현금 35% 확보"]} />
        </div>
      </div>
    </div>
  );
}

function HoldingRow({ h, ret, sourceChip }: { h: typeof portfolioHoldings[number]; ret: number; sourceChip: { label: string; intent: "neutral" | "info" | "warn" } }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr className="border-b border-border/30 hover:bg-muted/30 cursor-pointer" onClick={() => setOpen((o) => !o)}>
        <td className="px-5 py-3">
          <div className="flex items-center gap-2">
            <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition", open && "rotate-180")} />
            <div>
              <div className="font-medium">{h.name}</div>
              <div className="text-[10px] text-muted-foreground">{h.ticker}</div>
            </div>
          </div>
        </td>
        <td className="px-3 py-3"><Badge intent={sourceChip.intent}>{sourceChip.label}</Badge></td>
        <td className="px-3 py-3 text-right tabular-nums">{h.shares}</td>
        <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">{formatPrice(h.avgPrice, h.currency)}</td>
        <td className="px-3 py-3 text-right tabular-nums">{formatPrice(h.price, h.currency)}</td>
        <td className="px-3 py-3 text-right"><Delta value={ret} /></td>
        <td className="px-3 py-3">{h.decision}</td>
        <td className="px-3 py-3 text-muted-foreground">{h.action}</td>
        <td className="px-3 py-3 text-right text-[var(--bullish)] tabular-nums">{h.targetZone}</td>
        <td className="px-3 py-3 text-right text-[var(--bearish)] tabular-nums">{h.defenseZone}</td>
        <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
          <SavePersonalSnapshotDialog
            preset={{
              company: h.name,
              ticker: h.ticker,
              market: h.currency === "KRW" ? "KR" : "US",
              quantity: h.shares,
              avgCost: formatPrice(h.avgPrice, h.currency),
              price: formatPrice(h.price, h.currency),
            }}
            trigger={
              <Button size="sm" variant="ghost" className="text-xs">
                <BookmarkCheck className="h-3.5 w-3.5" />
                스냅샷 저장
              </Button>
            }
          />
        </td>
      </tr>
      {open && (
        <tr className="bg-[var(--surface-2)]/40 border-b border-border/30">
          <td colSpan={11} className="px-5 py-4">
            <div className="grid md:grid-cols-5 gap-3 text-xs">
              {[
                { t: "보유 근거", v: "실적 성장 추세 유지, 수급 안정", c: "var(--bullish)" },
                { t: "축소 근거", v: "단기 상승폭 과대, 집중도 리스크", c: "var(--neutral-accent)" },
                { t: "추가매수 구간", v: h.defenseZone + " ~ 평균", c: "var(--cyan-accent)" },
                { t: "익절 구간", v: h.targetZone, c: "var(--bullish)" },
                { t: "무효화 조건", v: "20일선 종가 이탈", c: "var(--bearish)" },
              ].map((d) => (
                <div key={d.t} className="rounded-lg border border-border/40 bg-[var(--surface-1)]/70 p-3">
                  <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: d.c }}>{d.t}</div>
                  <div className="text-foreground/90 leading-relaxed">{d.v}</div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function PlanCard({ icon: Icon, title, color, desc, details }: { icon: typeof Shield; title: string; color: string; desc: string; details: string[] }) {
  return (
    <Panel className="p-5 border-t-2" style={{ borderTopColor: color }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="h-9 w-9 rounded-lg grid place-items-center" style={{ background: `color-mix(in oklab, ${color} 18%, transparent)`, color }}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="text-base font-semibold">{title}</div>
      </div>
      <p className="text-sm text-foreground/90 mb-3">{desc}</p>
      <ul className="space-y-1.5">
        {details.map((d) => (
          <li key={d} className="text-xs text-muted-foreground flex items-start gap-2">
            <span className="h-1 w-1 rounded-full mt-2" style={{ background: color }} />
            <span>{d}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}