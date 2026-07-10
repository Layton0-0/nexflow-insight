import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calendar, ExternalLink, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, Badge, SectionTitle } from "@/components/nexflow/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "실적 캘린더 — NEXFLOW" },
      {
        name: "description",
        content: "관심종목과 보유 종목의 실적 발표 일정을 한곳에서 확인하세요.",
      },
    ],
  }),
  component: () => (
    <AppShell>
      <EarningsCalendarScreen />
    </AppShell>
  ),
});

type Market = "KR" | "US";
type EarningsEvent = {
  id: string;
  date: string; // ISO date
  ticker: string;
  name: string;
  market: Market;
  title: string;
  session?: "bmo" | "amc"; // before market open / after market close (US)
  summary?: string;
  url?: string;
};

const MOCK_EVENTS: EarningsEvent[] = [
  {
    id: "1",
    date: "2026-07-15",
    ticker: "005930.KS",
    name: "삼성전자",
    market: "KR",
    title: "2분기 잠정실적 공시",
    summary: "메모리 사이클 회복 국면에서의 분기 매출·영업이익 가이던스 확인.",
    url: "https://dart.fss.or.kr/",
  },
  {
    id: "2",
    date: "2026-07-18",
    ticker: "000660.KS",
    name: "SK하이닉스",
    market: "KR",
    title: "분기보고서",
    summary: "HBM 매출 비중 및 가동률 코멘트에 주목합니다.",
    url: "https://dart.fss.or.kr/",
  },
  {
    id: "3",
    date: "2026-07-22",
    ticker: "NVDA",
    name: "NVIDIA",
    market: "US",
    title: "Q2 2026 Earnings",
    session: "amc",
    summary: "데이터센터 세그먼트 성장률과 차기 분기 가이던스 확인.",
  },
  {
    id: "4",
    date: "2026-07-25",
    ticker: "AAPL",
    name: "Apple",
    market: "US",
    title: "Q3 2026 Earnings",
    session: "bmo",
    summary: "서비스 매출 성장률과 아이폰 판매 지역별 믹스 관전 포인트.",
  },
  {
    id: "5",
    date: "2026-07-30",
    ticker: "035420.KS",
    name: "NAVER",
    market: "KR",
    title: "2분기 실적발표",
    summary: "커머스·광고 부문 성장률 및 AI 관련 투자 코멘트.",
    url: "https://dart.fss.or.kr/",
  },
  {
    id: "6",
    date: "2026-08-05",
    ticker: "TSLA",
    name: "Tesla",
    market: "US",
    title: "Q2 2026 Earnings",
    session: "amc",
    summary: "차량 인도량 대비 마진, FSD/에너지 부문 코멘트 확인.",
  },
];

function formatMMDD(iso: string) {
  const d = new Date(iso + "T00:00:00");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}.${dd}`;
}

function weekdayKo(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
}

type MarketFilter = "전체" | "국내" | "미국";
type HorizonFilter = "이번 주" | "이번 달" | "전체";

function EarningsCalendarScreen() {
  const [market, setMarket] = useState<MarketFilter>("전체");
  const [horizon, setHorizon] = useState<HorizonFilter>("전체");

  const filtered = useMemo(() => {
    const now = new Date("2026-07-14T00:00:00");
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 7);
    const monthEnd = new Date(now);
    monthEnd.setDate(now.getDate() + 30);

    return MOCK_EVENTS.filter((e) => {
      if (market === "국내" && e.market !== "KR") return false;
      if (market === "미국" && e.market !== "US") return false;
      const d = new Date(e.date + "T00:00:00");
      if (horizon === "이번 주" && d > weekEnd) return false;
      if (horizon === "이번 달" && d > monthEnd) return false;
      return true;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [market, horizon]);

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="EARNINGS"
        title="실적 캘린더"
        description="관심종목과 보유 종목의 실적 일정을 한곳에서 확인합니다."
      />

      <Panel className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <FilterGroup
            label="시장"
            value={market}
            options={["전체", "국내", "미국"] as const}
            onChange={setMarket}
          />
          <FilterGroup
            label="기간"
            value={horizon}
            options={["이번 주", "이번 달", "전체"] as const}
            onChange={setHorizon}
          />
          <div className="ml-auto text-[11px] text-muted-foreground tabular-nums">
            총 {filtered.length}건
          </div>
        </div>
      </Panel>

      {filtered.length === 0 ? (
        <Panel className="p-10 text-center">
          <div className="mx-auto h-10 w-10 rounded-full bg-muted grid place-items-center text-muted-foreground mb-3">
            <Calendar className="h-4 w-4" />
          </div>
          <div className="text-sm font-semibold">예정된 실적 일정이 없습니다.</div>
          <div className="text-xs text-muted-foreground mt-1">
            수집 주기에 따라 일정이 갱신됩니다.
          </div>
        </Panel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((e) => (
            <EarningsCalendarCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <div className="flex p-1 rounded-lg bg-muted/40 border border-border/40">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs transition",
              value === o
                ? "bg-[var(--surface-3)] text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function EarningsCalendarCard({ event }: { event: EarningsEvent }) {
  const marketLabel = event.market === "KR" ? "국내" : "미국";
  return (
    <Panel className="p-5 hover:border-[var(--cyan-accent)]/40 transition h-full flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span className="tabular-nums font-medium text-foreground">
            {formatMMDD(event.date)}
          </span>
          <span>({weekdayKo(event.date)})</span>
          {event.session && (
            <span className="uppercase text-[10px] text-muted-foreground">
              {event.session}
            </span>
          )}
        </div>
        <Badge intent={event.market === "KR" ? "info" : "neutral"}>{marketLabel}</Badge>
      </div>

      <div className="mt-3">
        <Link
          to="/analysis"
          className="text-base font-semibold hover:text-[var(--cyan-accent)] transition"
        >
          {event.name}
        </Link>
        <div className="text-[10px] text-muted-foreground tabular-nums mt-0.5">
          {event.ticker}
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2">
        <Badge intent="warn" className="shrink-0 mt-0.5">
          실적
        </Badge>
        <div
          className="text-sm text-foreground/90 leading-snug break-keep line-clamp-2"
          title={event.title}
        >
          {event.title}
        </div>
      </div>

      {event.summary && (
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2 break-keep">
          {event.summary}
        </p>
      )}

      <div className="mt-auto pt-4 flex items-center justify-between text-xs">
        {event.url ? (
          <a
            href={event.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[var(--cyan-accent)] hover:underline"
          >
            공시 원문 보기 <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span />
        )}
        <Link
          to="/analysis"
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition"
        >
          분석 보기 <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </Panel>
  );
}