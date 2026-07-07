import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, Badge, Delta } from "@/components/nexflow/primitives";
import {
  StatusBadge,
  TypeBadge,
  PriceDistanceBar,
  CloseSnapshotDialog,
  SavePersonalSnapshotDialog,
} from "@/components/nexflow/snapshots";
import {
  snapshots,
  formatSnapPrice,
  systemInterpretationMap,
} from "@/lib/mock-snapshots";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Circle,
  CopyPlus,
  X,
  Calendar,
  BookmarkCheck,
} from "lucide-react";

export const Route = createFileRoute("/snapshots/$snapshotId")({
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.company} 전략 스냅샷 — NEXFLOW`
          : "스냅샷 — NEXFLOW",
      },
    ],
  }),
  loader: ({ params }) => {
    const s = snapshots.find((x) => x.id === params.snapshotId);
    if (!s) throw notFound();
    return s;
  },
  notFoundComponent: () => (
    <AppShell>
      <div className="text-center py-20">
        <h1 className="text-xl font-semibold">스냅샷을 찾을 수 없어요</h1>
        <Button asChild className="mt-4">
          <Link to="/snapshots">목록으로</Link>
        </Button>
      </div>
    </AppShell>
  ),
  component: () => (
    <AppShell>
      <SnapshotDetail />
    </AppShell>
  ),
});

function SnapshotDetail() {
  const s = Route.useLoaderData();
  const change = ((s.currentPrice - s.savedPrice) / s.savedPrice) * 100;
  const targetDist = ((s.targetPrice - s.currentPrice) / s.currentPrice) * 100;
  const invDist = ((s.currentPrice - s.invalidationPrice) / s.currentPrice) * 100;

  const sameTickerHistory = snapshots.filter(
    (x) => x.ticker === s.ticker && x.id !== s.id,
  );

  return (
    <div className="space-y-6">
      <Link
        to="/snapshots"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> 스냅샷 목록으로
      </Link>

      <Panel className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <TypeBadge type={s.type} />
              <Badge intent="neutral">{s.market}</Badge>
              <StatusBadge status={s.status} />
              <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {s.savedAt} 저장
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mt-2 tracking-tight">
              {s.company} 전략 스냅샷
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {s.ticker} · {s.title}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button>
              <BookmarkCheck className="h-4 w-4" />
              현재와 비교
            </Button>
            <SavePersonalSnapshotDialog
              trigger={
                <Button variant="outline">
                  <CopyPlus className="h-4 w-4" />이 내용으로 새 스냅샷
                </Button>
              }
              preset={{
                company: s.company,
                ticker: s.ticker,
                market: s.market,
                quantity: s.quantity,
                avgCost: s.avgCost ? formatSnapPrice(s.avgCost, s.currency) : "",
                price: formatSnapPrice(s.currentPrice, s.currency),
              }}
            />
            <CloseSnapshotDialog
              trigger={
                <Button variant="ghost" className="text-muted-foreground">
                  <X className="h-4 w-4" />
                  종료 처리
                </Button>
              }
            />
          </div>
        </div>
      </Panel>

      {/* Current Comparison — full width, most important */}
      <Panel className="p-5">
        <PanelHeader
          className="!px-0 !pt-0"
          eyebrow="CURRENT COMPARISON"
          title="현재와 비교"
          subtitle="저장 시점의 전략과 현재 시장 데이터를 대조합니다."
        />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4">
          <Metric label="저장 시점" value={formatSnapPrice(s.savedPrice, s.currency)} />
          <Metric label="현재가" value={formatSnapPrice(s.currentPrice, s.currency)} />
          <Metric
            label="변동"
            valueNode={<Delta value={change} />}
          />
          <Metric
            label="목표까지"
            value={`${targetDist >= 0 ? "+" : ""}${targetDist.toFixed(1)}%`}
            accent={targetDist >= 0 ? "var(--bullish)" : "var(--muted-foreground)"}
          />
          <Metric
            label="무효화 여유"
            value={`${invDist.toFixed(1)}%`}
            accent={invDist < 5 ? "var(--bearish)" : "var(--muted-foreground)"}
          />
          <Metric
            label="시그널"
            value={`${s.signalAtSnapshot} → ${s.currentSignal}`}
          />
        </div>

        <PriceDistanceBar s={s} />

        <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4">
          <div className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-1">
            System Interpretation · 시스템 해석
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {systemInterpretationMap[s.status]}
          </p>
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Saved Strategy */}
        <Panel className="p-5">
          <PanelHeader
            className="!px-0 !pt-0"
            eyebrow="SAVED STRATEGY"
            title="저장된 전략"
          />
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4 text-sm">
            <Row label="유형" value={s.type === "ai" ? "추천 전략" : "내 투자"} />
            <Row label="전략 액션" value={s.strategyAction} />
            <Row label="투자 기간" value={s.timeHorizon} />
            <Row label="저장 시점 가격" value={formatSnapPrice(s.savedPrice, s.currency)} />
            {s.avgCost !== undefined && (
              <Row label="평단" value={formatSnapPrice(s.avgCost, s.currency)} />
            )}
            {s.quantity !== undefined && <Row label="수량" value={`${s.quantity}`} />}
            <Row label="목표가" value={formatSnapPrice(s.targetPrice, s.currency)} accent="var(--bullish)" />
            {s.trimPrice && (
              <Row label="트림가" value={formatSnapPrice(s.trimPrice, s.currency)} />
            )}
            {s.addBuyPrice && (
              <Row label="추가매수" value={formatSnapPrice(s.addBuyPrice, s.currency)} />
            )}
            {s.stopLoss && (
              <Row label="손절" value={formatSnapPrice(s.stopLoss, s.currency)} />
            )}
            <Row
              label="무효화 레벨"
              value={formatSnapPrice(s.invalidationPrice, s.currency)}
              accent="var(--bearish)"
            />
            <Row label="저장 시 시그널" value={s.signalAtSnapshot} />
            <Row label="시장 분위기" value={s.marketMood} />
          </div>
        </Panel>

        {/* Original Thesis */}
        <Panel className="p-5">
          <PanelHeader
            className="!px-0 !pt-0"
            eyebrow="ORIGINAL THESIS"
            title="투자 논리"
          />
          <ul className="mt-4 space-y-2">
            {s.thesis.map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span className="text-foreground/90 leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Key Risks */}
        <Panel className="p-5">
          <PanelHeader
            className="!px-0 !pt-0"
            eyebrow="KEY RISKS"
            title="핵심 리스크"
          />
          <ul className="mt-4 space-y-2">
            {s.risks.map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--bearish)] shrink-0" />
                <span className="text-foreground/90 leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Watch Conditions */}
        <Panel className="p-5">
          <PanelHeader
            className="!px-0 !pt-0"
            eyebrow="WATCH CONDITIONS"
            title="유지 조건"
          />
          <ul className="mt-4 space-y-2">
            {s.watchConditions.map((w) => (
              <li
                key={w.label}
                className="flex items-start gap-2.5 text-sm py-1.5 border-b border-border/50 last:border-0"
              >
                {w.met ? (
                  <Check className="h-4 w-4 mt-0.5 text-[var(--bullish)] shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                )}
                <span
                  className={
                    w.met
                      ? "text-foreground/90"
                      : "text-muted-foreground"
                  }
                >
                  {w.label}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* User Memo */}
      <Panel className="p-5">
        <PanelHeader className="!px-0 !pt-0" eyebrow="MY MEMO" title="내 메모" />
        <p className="mt-3 text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
          {s.memo || (
            <span className="text-muted-foreground">저장된 메모가 없습니다.</span>
          )}
        </p>
      </Panel>

      {/* Same Ticker History */}
      {sameTickerHistory.length > 0 && (
        <div>
          <PanelHeader
            className="!px-0 !pt-0 mb-3"
            eyebrow="HISTORY"
            title={`${s.company} 스냅샷 이력`}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sameTickerHistory.map((h) => (
              <Panel key={h.id} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {h.savedAt}
                  </div>
                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    <TypeBadge type={h.type} />
                    <StatusBadge status={h.status} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1.5 tabular-nums">
                    저장 {formatSnapPrice(h.savedPrice, h.currency)}
                  </div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link to="/snapshots/$snapshotId" params={{ snapshotId: h.id }}>
                    열기 <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </Panel>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  valueNode,
  accent,
}: {
  label: string;
  value?: string;
  valueNode?: React.ReactNode;
  accent?: string;
}) {
  return (
    <div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div
        className="text-base font-semibold tabular-nums mt-1"
        style={accent ? { color: accent } : undefined}
      >
        {valueNode ?? value}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1 border-b border-border/40">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className="text-sm font-medium tabular-nums text-right"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </span>
    </div>
  );
}