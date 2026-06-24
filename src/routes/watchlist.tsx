import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, Badge, SectionTitle, Delta } from "@/components/nexflow/primitives";
import { ScenarioBar, PriceZoneTrack } from "@/components/nexflow/widgets";
import { stocks, formatPrice } from "@/lib/mock-data";
import { LayoutGrid, List, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/watchlist")({
  head: () => ({ meta: [{ title: "관심종목 — NEXFLOW" }] }),
  component: () => (<AppShell><Watchlist /></AppShell>),
});

function Watchlist() {
  const [view, setView] = useState<"table" | "card">("card");
  const [market, setMarket] = useState<"전체" | "국내" | "미국" | "ETF">("전체");

  const filtered = stocks.filter((s) => {
    if (market === "전체") return true;
    if (market === "국내") return s.market === "KR";
    if (market === "미국") return s.market === "US";
    return s.market === "ETF";
  });

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="WATCHLIST" title="관심종목" description="실시간 점수 기반 우선순위와 시나리오 확률" />

      <Panel className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input placeholder="종목명 또는 티커 검색" className="w-full h-10 pl-9 pr-3 rounded-lg bg-muted/40 border border-border/60 text-sm focus:outline-none focus:border-[var(--cyan-accent)]/60" />
          </div>
          <div className="flex p-1 rounded-lg bg-muted/40 border border-border/40">
            {(["전체", "국내", "미국", "ETF"] as const).map((m) => (
              <button key={m} onClick={() => setMarket(m)} className={cn("px-3 py-1.5 rounded-md text-xs transition", market === m ? "bg-[var(--surface-3)] text-foreground" : "text-muted-foreground")}>{m}</button>
            ))}
          </div>
          <select className="h-10 rounded-lg bg-muted/40 border border-border/40 text-xs px-3 text-foreground">
            <option>종합점수순</option>
            <option>상승여력순</option>
            <option>리스크순</option>
            <option>수급강도순</option>
          </select>
          <div className="flex p-1 rounded-lg bg-muted/40 border border-border/40 ml-auto">
            <button onClick={() => setView("card")} className={cn("p-2 rounded-md transition", view === "card" ? "bg-[var(--surface-3)] text-foreground" : "text-muted-foreground")}><LayoutGrid className="h-4 w-4" /></button>
            <button onClick={() => setView("table")} className={cn("p-2 rounded-md transition", view === "table" ? "bg-[var(--surface-3)] text-foreground" : "text-muted-foreground")}><List className="h-4 w-4" /></button>
          </div>
        </div>
      </Panel>

      {view === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <Link key={s.ticker} to="/analysis" className="block">
              <Panel className="p-5 hover:border-[var(--cyan-accent)]/40 transition h-full">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-base font-semibold truncate">{s.name}</div>
                    <div className="text-[10px] text-muted-foreground">{s.ticker} · {s.market}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold tabular-nums">{formatPrice(s.price, s.currency)}</div>
                    <Delta value={s.changePercent} />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <div className="text-[10px] text-muted-foreground">SCORE</div>
                  <div className="text-lg font-bold text-[var(--cyan-accent)] tabular-nums">{s.score}</div>
                  <Badge intent="info" className="ml-auto">{s.decision}</Badge>
                </div>

                <div className="mt-3"><ScenarioBar bullish={s.bullishProbability} neutral={s.neutralProbability} bearish={s.bearishProbability} showLabels={false} /></div>

                <div className="mt-4"><PriceZoneTrack stock={s} /></div>

                <div className="grid grid-cols-3 gap-2 mt-4 text-[11px]">
                  <div><div className="text-muted-foreground">매수</div><div className="font-medium tabular-nums">{s.buyZone.split("~")[0]}</div></div>
                  <div><div className="text-muted-foreground">목표</div><div className="font-medium tabular-nums text-[var(--bullish)]">{s.targetZone.split("~")[0]}</div></div>
                  <div><div className="text-muted-foreground">무효</div><div className="font-medium tabular-nums text-[var(--bearish)]">{s.invalidationZone.split(" ")[0]}</div></div>
                </div>
              </Panel>
            </Link>
          ))}
        </div>
      ) : (
        <Panel>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/50">
                  <th className="text-left font-medium px-5 py-3">종목</th>
                  <th className="text-right font-medium px-3 py-3">현재가</th>
                  <th className="text-right font-medium px-3 py-3">변동</th>
                  <th className="text-right font-medium px-3 py-3">점수</th>
                  <th className="text-left font-medium px-3 py-3 min-w-[140px]">시나리오</th>
                  <th className="text-left font-medium px-3 py-3">판단</th>
                  <th className="text-left font-medium px-5 py-3">액션</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.ticker} className="border-b border-border/30 hover:bg-muted/30">
                    <td className="px-5 py-3"><Link to="/analysis"><div className="font-medium">{s.name}</div><div className="text-[10px] text-muted-foreground">{s.ticker}</div></Link></td>
                    <td className="px-3 py-3 text-right tabular-nums">{formatPrice(s.price, s.currency)}</td>
                    <td className="px-3 py-3 text-right"><Delta value={s.changePercent} /></td>
                    <td className="px-3 py-3 text-right font-semibold text-[var(--cyan-accent)] tabular-nums">{s.score}</td>
                    <td className="px-3 py-3"><ScenarioBar bullish={s.bullishProbability} neutral={s.neutralProbability} bearish={s.bearishProbability} showLabels={false} /></td>
                    <td className="px-3 py-3 text-foreground/90">{s.decision}</td>
                    <td className="px-5 py-3 text-muted-foreground">{s.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  );
}