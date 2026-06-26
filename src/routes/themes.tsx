import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, Badge } from "@/components/nexflow/primitives";
import { themes, cycleLabel, signalColor, signalIntent } from "@/lib/mock-market-screens";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/themes")({
  head: () => ({ meta: [{ title: "테마 분석 — NEXFLOW" }] }),
  component: () => (<AppShell><ThemesList /></AppShell>),
});

const SECTORS = ["전체", "반도체", "산업재", "소재", "헬스케어"] as const;

function ThemesList() {
  const [sector, setSector] = useState<(typeof SECTORS)[number]>("전체");
  const filtered = useMemo(
    () => (sector === "전체" ? themes : themes.filter((t) => t.sector === sector)),
    [sector],
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">테마 분석</h1>
        <p className="text-sm text-muted-foreground mt-1">시장을 움직이는 흐름과 사이클 단계</p>
      </div>

      <div className="-mx-1 overflow-x-auto">
        <div className="flex items-center gap-1.5 px-1 min-w-min">
          {SECTORS.map((s) => (
            <button
              key={s}
              onClick={() => setSector(s)}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full text-xs border transition-colors",
                sector === s
                  ? "border-primary/40 bg-[color-mix(in_oklab,var(--primary)_10%,transparent)] text-primary font-medium"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Panel className="p-10 text-center text-sm text-muted-foreground">
          표시할 테마가 없습니다.
        </Panel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <Link
              key={t.id}
              to="/themes/$slug"
              params={{ slug: t.slug }}
              className="group"
            >
              <Panel className="p-5 h-full hover:border-primary/40 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] text-muted-foreground mb-1">{t.sector}</div>
                    <div className="text-base font-semibold truncate group-hover:text-primary">
                      {t.name}
                    </div>
                  </div>
                  <Badge intent={signalIntent(t.signal_status)}>{cycleLabel[t.cycle_stage]}</Badge>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${t.score}%`, background: signalColor(t.signal_status) }}
                    />
                  </div>
                  <span className="text-xs font-semibold tabular-nums" style={{ color: signalColor(t.signal_status) }}>
                    {t.score}
                  </span>
                </div>
                <p className="mt-3 text-xs text-foreground/80 leading-relaxed line-clamp-3">
                  {t.easy_summary}
                </p>
                <div className="mt-3 text-[10px] text-muted-foreground">예상 지속 {t.duration_estimate}</div>
              </Panel>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}