import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, SectionTitle, Stat } from "@/components/nexflow/primitives";
import {
  SnapshotCard,
  SavePersonalSnapshotDialog,
} from "@/components/nexflow/snapshots";
import { snapshots } from "@/lib/mock-snapshots";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookmarkCheck, LineChart, Search, ArchiveX } from "lucide-react";

export const Route = createFileRoute("/snapshots/")({
  head: () => ({ meta: [{ title: "전략 스냅샷 — NEXFLOW" }] }),
  component: () => (
    <AppShell>
      <SnapshotsList />
    </AppShell>
  ),
});

function SnapshotsList() {
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [market, setMarket] = useState("all");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [range, setRange] = useState("all");

  const filtered = useMemo(() => {
    return snapshots.filter((s) => {
      if (q && !`${s.company}${s.ticker}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      if (market !== "all" && s.market !== market) return false;
      if (type !== "all" && s.type !== type) return false;
      if (status !== "all" && s.status !== status) return false;
      if (tab === "ai" && s.type !== "ai") return false;
      if (tab === "personal" && s.type !== "personal") return false;
      if (tab === "near-target" && s.status !== "near-target") return false;
      if (
        tab === "review" &&
        !["watch", "near-invalidation", "invalidated"].includes(s.status)
      )
        return false;
      if (tab === "closed" && s.status !== "closed") return false;
      return true;
    });
  }, [tab, q, market, type, status]);

  const totals = useMemo(() => {
    const total = snapshots.length;
    const ai = snapshots.filter((s) => s.type === "ai").length;
    const personal = snapshots.filter((s) => s.type === "personal").length;
    const nearInv = snapshots.filter((s) => s.status === "near-invalidation").length;
    const worsened = snapshots.filter(
      (s) => s.currentSignal !== s.signalAtSnapshot && s.status !== "closed",
    ).length;
    const nearTarget = snapshots.filter((s) => s.status === "near-target").length;
    const addBuy = snapshots.filter((s) => s.status === "add-buy").length;
    return { total, ai, personal, nearInv, worsened, nearTarget, addBuy };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <SectionTitle
          eyebrow="STRATEGY SNAPSHOTS"
          title="전략 스냅샷"
          description="과거에 저장한 추천 전략과 내 투자 판단을 현재 데이터와 비교합니다."
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/analysis">
              <LineChart className="h-4 w-4" />
              종목 분석 보러가기
            </Link>
          </Button>
          <SavePersonalSnapshotDialog
            trigger={
              <Button>
                <BookmarkCheck className="h-4 w-4" />내 투자 스냅샷 추가
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Panel className="p-5">
          <Stat
            label="저장된 전략"
            value={totals.total}
            suffix="건"
            delta={
              <span className="text-muted-foreground">
                추천 전략 {totals.ai}개 · 내 투자 {totals.personal}개
              </span>
            }
          />
        </Panel>
        <Panel className="p-5">
          <Stat
            label="점검 필요"
            value={totals.nearInv + totals.worsened}
            suffix="건"
            intent="bearish"
            delta={
              <span className="text-muted-foreground">
                무효화 근접 {totals.nearInv}개 · Signal 악화 {totals.worsened}개
              </span>
            }
          />
        </Panel>
        <Panel className="p-5">
          <Stat
            label="액션 구간"
            value={totals.nearTarget + totals.addBuy}
            suffix="건"
            intent="bullish"
            delta={
              <span className="text-muted-foreground">
                목표가 근접 {totals.nearTarget}개 · 추가매수 구간 {totals.addBuy}개
              </span>
            }
          />
        </Panel>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="ai">추천 전략</TabsTrigger>
          <TabsTrigger value="personal">내 투자</TabsTrigger>
          <TabsTrigger value="near-target">목표가 근접</TabsTrigger>
          <TabsTrigger value="review">점검 필요</TabsTrigger>
          <TabsTrigger value="closed">종료</TabsTrigger>
        </TabsList>
      </Tabs>

      <Panel className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="종목명 또는 티커 검색"
              className="pl-9"
            />
          </div>
          <Select value={market} onValueChange={setMarket}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">시장 · 전체</SelectItem>
              <SelectItem value="KR">국내</SelectItem>
              <SelectItem value="US">미국</SelectItem>
              <SelectItem value="ETF">ETF</SelectItem>
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">유형 · 전체</SelectItem>
              <SelectItem value="ai">추천 전략</SelectItem>
              <SelectItem value="personal">내 투자</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">상태 · 전체</SelectItem>
              <SelectItem value="valid">유효</SelectItem>
              <SelectItem value="watch">관찰 필요</SelectItem>
              <SelectItem value="near-target">목표가 근접</SelectItem>
              <SelectItem value="add-buy">추가매수 구간</SelectItem>
              <SelectItem value="near-invalidation">무효화 근접</SelectItem>
              <SelectItem value="invalidated">무효화</SelectItem>
              <SelectItem value="closed">종료</SelectItem>
            </SelectContent>
          </Select>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">기간 · 전체</SelectItem>
              <SelectItem value="7">최근 7일</SelectItem>
              <SelectItem value="30">최근 30일</SelectItem>
              <SelectItem value="90">최근 90일</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Panel>

      {filtered.length === 0 ? (
        <Panel className="p-12 text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-muted grid place-items-center mb-4">
            <ArchiveX className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">아직 저장된 전략 스냅샷이 없어요</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            종목 분석에서 추천 전략을 저장하거나, 포트폴리오에서 내 실제 투자 판단을 스냅샷으로
            남겨보세요. 시간이 지난 뒤 현재 데이터와 비교할 수 있습니다.
          </p>
          <div className="flex justify-center gap-2 mt-5">
            <Button asChild variant="outline">
              <Link to="/analysis">종목 분석으로</Link>
            </Button>
            <Button asChild>
              <Link to="/portfolio">포트폴리오로</Link>
            </Button>
          </div>
        </Panel>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map((s) => (
            <SnapshotCard key={s.id} s={s} />
          ))}
        </div>
      )}
    </div>
  );
}