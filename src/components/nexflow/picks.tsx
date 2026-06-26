import { Link } from "@tanstack/react-router";
import { Panel, Badge } from "@/components/nexflow/primitives";
import {
  type MarketPicksPage,
  type MarketPick,
  signalColor,
  signalIntent,
  formatPrice,
} from "@/lib/mock-market-screens";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

function SignalDot({ s }: { s: MarketPick["signal_status"] }) {
  return (
    <span
      aria-hidden
      className="inline-block h-2 w-2 rounded-full"
      style={{ background: signalColor(s), boxShadow: `0 0 6px ${signalColor(s)}` }}
    />
  );
}

function ScoreChip({ score }: { score: number }) {
  const c = score >= 75 ? "var(--bullish)" : score >= 55 ? "var(--neutral-accent)" : "var(--bearish)";
  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="h-1 w-12 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: c }} />
      </div>
      <span className="text-xs font-semibold tabular-nums" style={{ color: c }}>{score}</span>
    </div>
  );
}

function PickDetails({ p }: { p: MarketPick }) {
  return (
    <div className="grid md:grid-cols-3 gap-3 px-4 pb-4 pt-1">
      <div className="rounded-lg border border-border/60 bg-[var(--surface-2)]/60 p-3">
        <div className="text-[10px] text-muted-foreground mb-1">핵심 근거</div>
        <p className="text-xs leading-relaxed text-foreground/90">{p.thesis}</p>
      </div>
      <div className="rounded-lg border border-border/60 bg-[var(--surface-2)]/60 p-3">
        <div className="text-[10px] text-muted-foreground mb-1">관망 조건</div>
        <p className="text-xs leading-relaxed text-foreground/90">{p.watch_condition}</p>
      </div>
      <div className="rounded-lg border border-border/60 bg-[var(--surface-2)]/60 p-3">
        <div className="text-[10px] text-muted-foreground mb-1">리스크 요약</div>
        <p className="text-xs leading-relaxed text-foreground/90">{p.risk_summary}</p>
      </div>
    </div>
  );
}

function DesktopRow({ p }: { p: MarketPick }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr className="border-t border-border hover:bg-muted/40 transition-colors">
        <td className="px-4 py-3 text-sm font-semibold tabular-nums text-muted-foreground w-12">
          {p.rank}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <SignalDot s={p.signal_status} />
            <Link to="/analysis" className="font-semibold text-sm hover:text-primary">
              {p.company_name}
            </Link>
            <span className="text-[11px] text-muted-foreground tabular-nums">{p.ticker}</span>
            {p.theme_name && <Badge intent="info">{p.theme_name}</Badge>}
          </div>
          <div className="mt-1.5"><ScoreChip score={p.score} /></div>
        </td>
        <td className="px-4 py-3 text-sm tabular-nums">{formatPrice(p.current_price, p.currency)}</td>
        <td className="px-4 py-3 text-sm tabular-nums text-muted-foreground">
          {formatPrice(p.buy_zone.low, p.currency)}<span className="opacity-50"> ~ </span>{formatPrice(p.buy_zone.high, p.currency)}
        </td>
        <td className="px-4 py-3 text-sm tabular-nums text-[var(--bullish)]">{formatPrice(p.base_target, p.currency)}</td>
        <td className="px-4 py-3 text-sm tabular-nums text-[var(--bullish)]">{formatPrice(p.stretch_target, p.currency)}</td>
        <td className="px-4 py-3 text-sm tabular-nums text-[var(--bearish)]">{formatPrice(p.stop_loss, p.currency)}</td>
        <td className="px-4 py-3">
          <Badge intent={signalIntent(p.signal_status)}>{p.upside_probability}%</Badge>
        </td>
        <td className="px-3 py-3 w-10">
          <button
            onClick={() => setOpen((v) => !v)}
            className="h-7 w-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground"
            aria-label="상세 보기"
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
          </button>
        </td>
      </tr>
      {open && (
        <tr className="bg-muted/20">
          <td colSpan={9}><PickDetails p={p} /></td>
        </tr>
      )}
    </>
  );
}

function MobileCard({ p }: { p: MarketPick }) {
  const [open, setOpen] = useState(false);
  return (
    <Panel className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-muted-foreground tabular-nums">#{p.rank}</span>
              <SignalDot s={p.signal_status} />
              <span className="font-semibold text-sm truncate">{p.company_name}</span>
              <span className="text-[10px] text-muted-foreground tabular-nums">{p.ticker}</span>
            </div>
            {p.theme_name && <Badge intent="info">{p.theme_name}</Badge>}
          </div>
          <Badge intent={signalIntent(p.signal_status)}>{p.upside_probability}%</Badge>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-muted-foreground">현재가</div>
            <div className="text-base font-bold tabular-nums">{formatPrice(p.current_price, p.currency)}</div>
          </div>
          <ScoreChip score={p.score} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <Mini label="매수" value={`${formatPrice(p.buy_zone.low, p.currency)} ~ ${formatPrice(p.buy_zone.high, p.currency)}`} />
          <Mini label="손절" value={formatPrice(p.stop_loss, p.currency)} color="var(--bearish)" />
          <Mini label="기본 목표" value={formatPrice(p.base_target, p.currency)} color="var(--bullish)" />
          <Mini label="공격 목표" value={formatPrice(p.stretch_target, p.currency)} color="var(--bullish)" />
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="mt-3 text-xs text-muted-foreground inline-flex items-center gap-1 hover:text-foreground"
        >
          상세 보기
          <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
        </button>
      </div>
      {open && <PickDetails p={p} />}
    </Panel>
  );
}

function Mini({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-md border border-border/60 bg-[var(--surface-2)]/50 px-2 py-1.5">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="text-xs font-semibold tabular-nums" style={color ? { color } : undefined}>{value}</div>
    </div>
  );
}

export function PicksScreen({ page, title }: { page: MarketPicksPage; title: string }) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <Link to="/dashboard" className="text-xs text-muted-foreground hover:text-foreground">← 종합 순위</Link>
        <div className="mt-2 flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
            <div className="text-xs text-muted-foreground mt-1">
              분석일 {page.analysis_date} · 단기 + 3~6개월 스윙
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <LegendDot color="var(--bullish)" label="양호" />
            <LegendDot color="var(--neutral-accent)" label="관망" />
            <LegendDot color="var(--bearish)" label="경고" />
          </div>
        </div>
      </div>

      <Panel className="p-5">
        <div className="text-[10px] uppercase tracking-wider text-primary font-semibold mb-2">시장 결론</div>
        <p className="text-sm leading-relaxed text-foreground/90">{page.market_summary}</p>
      </Panel>

      {/* Desktop table */}
      <Panel className="hidden md:block overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/40">
              <th className="px-4 py-3 text-left font-medium">순위</th>
              <th className="px-4 py-3 text-left font-medium">종목</th>
              <th className="px-4 py-3 text-left font-medium">현재가</th>
              <th className="px-4 py-3 text-left font-medium">매수가</th>
              <th className="px-4 py-3 text-left font-medium">기본 목표</th>
              <th className="px-4 py-3 text-left font-medium">공격 목표</th>
              <th className="px-4 py-3 text-left font-medium">손절선</th>
              <th className="px-4 py-3 text-left font-medium">상승 확률</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {page.picks.map((p) => <DesktopRow key={p.ticker} p={p} />)}
          </tbody>
        </table>
      </Panel>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {page.picks.map((p) => <MobileCard key={p.ticker} p={p} />)}
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed">
        본 자료는 정보 제공 목적이며 투자 권유가 아닙니다. 모든 투자 결정과 책임은 투자자 본인에게 있습니다.
      </p>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}