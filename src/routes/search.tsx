import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel } from "@/components/nexflow/primitives";
import { searchUniverse, signalColor, type SearchStock } from "@/lib/mock-market-screens";
import { useEffect, useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "종목 검색 — NEXFLOW" }] }),
  component: () => (<AppShell><SearchPage /></AppShell>),
});

const POPULAR = ["NVDA", "삼성전자", "AI 인프라", "반도체", "테슬라", "SK하이닉스", "HBM", "전력"];

function SearchPage() {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!q) {
      setDebounced("");
      setSearching(false);
      return;
    }
    setSearching(true);
    const t = setTimeout(() => {
      setDebounced(q);
      setSearching(false);
    }, 220);
    return () => clearTimeout(t);
  }, [q]);

  const results = useMemo(() => {
    const term = debounced.trim().toLowerCase();
    if (!term) return [] as SearchStock[];
    return searchUniverse.filter((s) =>
      [s.ticker, s.company_name, s.company_name_en ?? ""].some((v) =>
        v.toLowerCase().includes(term),
      ),
    );
  }, [debounced]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">종목 검색</h1>
        <p className="text-sm text-muted-foreground mt-1">티커 또는 종목명으로 검색하세요</p>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="종목명, 티커 검색... (예: NVDA, 삼성, AI)"
          className="w-full h-12 pl-11 pr-4 rounded-xl bg-card border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-ring/40 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>검색 결과</span>
            {debounced && (
              <span className="px-1.5 py-0.5 rounded bg-muted tabular-nums">{results.length}개</span>
            )}
          </div>

          {!q && (
            <Panel className="p-10 text-center text-sm text-muted-foreground">
              티커 또는 종목명을 입력해 주세요.
            </Panel>
          )}

          {searching && (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 rounded-xl bg-muted/50 animate-pulse" />
              ))}
            </div>
          )}

          {!searching && debounced && results.length === 0 && (
            <Panel className="p-10 text-center text-sm text-muted-foreground">
              검색 결과가 없습니다.
            </Panel>
          )}

          {!searching && results.length > 0 && (
            <Panel className="divide-y divide-border overflow-hidden">
              {results.map((s) => (
                <Link
                  key={s.id}
                  to="/analysis"
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ background: signalColor(s.signal_status) }} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate">{s.company_name}</span>
                        <span className="text-[10px] text-muted-foreground tabular-nums">{s.ticker}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{s.exchange}</span>
                        <span className="text-[10px] text-muted-foreground">{s.instrument_type === "etf" ? "ETF" : "주식"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-semibold tabular-nums px-2 py-1 rounded-md border border-border" style={{ color: signalColor(s.signal_status) }}>
                    {s.score}
                  </div>
                </Link>
              ))}
            </Panel>
          )}
        </div>

        <div>
          <div className="text-xs text-muted-foreground mb-2">인기 검색</div>
          <Panel className="p-4">
            <div className="flex flex-wrap gap-2">
              {POPULAR.map((p) => (
                <button
                  key={p}
                  onClick={() => setQ(p)}
                  className="px-3 py-1.5 rounded-full text-xs border border-border text-foreground/80 hover:text-primary hover:border-primary/40 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}