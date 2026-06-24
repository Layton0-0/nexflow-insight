import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, SectionTitle, Badge } from "@/components/nexflow/primitives";
import { alerts as ALERTS } from "@/lib/mock-data";
import { Bell, BellOff, Clock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const CATS = ["전체", "가격 알림", "수급 알림", "실적 알림", "뉴스 알림", "리스크 알림", "포트폴리오 알림"] as const;

export const Route = createFileRoute("/alerts")({
  head: () => ({ meta: [{ title: "알림 — NEXFLOW" }] }),
  component: () => (<AppShell><Alerts /></AppShell>),
});

function Alerts() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("전체");
  const [items, setItems] = useState(ALERTS);

  const filtered = cat === "전체" ? items : items.filter((a) => a.category === cat);

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="ALERTS" title="조건부 알림" description="단순 가격이 아닌 수급·이벤트·기술 조건이 충족될 때 알립니다."
        right={
          <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-[var(--cyan-accent)] text-[oklch(0.12_0.03_270)] text-sm font-semibold glow-cyan">
            <Plus className="h-4 w-4" /> 알림 추가
          </button>
        }
      />

      <Panel className="p-4">
        <div className="flex flex-wrap gap-1.5">
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={cn("px-3 py-1.5 rounded-md text-xs border transition", cat === c ? "border-[var(--cyan-accent)]/60 bg-[color-mix(in_oklab,var(--cyan-accent)_12%,transparent)] text-[var(--cyan-accent)]" : "border-border/50 text-muted-foreground hover:text-foreground")}>
              {c}
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((a) => (
          <Panel key={a.id} className={cn("p-4 transition", !a.enabled && "opacity-60")}>
            <div className="flex items-start gap-3">
              <div className={cn("h-9 w-9 rounded-lg grid place-items-center shrink-0", a.severity === "경고" ? "bg-[color-mix(in_oklab,var(--bearish)_18%,transparent)] text-[var(--bearish)]" : a.severity === "주의" ? "bg-[color-mix(in_oklab,var(--neutral-accent)_18%,transparent)] text-[var(--neutral-accent)]" : "bg-[color-mix(in_oklab,var(--cyan-accent)_18%,transparent)] text-[var(--cyan-accent)]")}>
                {a.enabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge intent="neutral">{a.category}</Badge>
                  <Badge intent={a.severity === "경고" ? "bearish" : a.severity === "주의" ? "warn" : "info"}>{a.severity}</Badge>
                  <span className="text-[10px] text-muted-foreground ml-auto flex items-center gap-1"><Clock className="h-3 w-3" />최근 {a.lastTriggered}</span>
                </div>
                <div className="text-sm text-foreground/95 leading-relaxed">{a.condition}</div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[11px] text-muted-foreground">관련: {a.stock}</span>
                  <button onClick={() => setItems((prev) => prev.map((x) => x.id === a.id ? { ...x, enabled: !x.enabled } : x))} className={cn("relative h-5 w-9 rounded-full transition", a.enabled ? "bg-[var(--cyan-accent)]" : "bg-muted")}>
                    <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-background transition-all", a.enabled ? "left-[18px]" : "left-0.5")} />
                  </button>
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}