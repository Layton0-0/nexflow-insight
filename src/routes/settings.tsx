import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, SectionTitle } from "@/components/nexflow/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "설정 — NEXFLOW" }] }),
  component: () => (<AppShell><SettingsPage /></AppShell>),
});

function SettingsPage() {
  const [profile, setProfile] = useState("균형형");
  const [markets, setMarkets] = useState<string[]>(["국내주식", "미국주식", "반도체"]);
  const [horizon, setHorizon] = useState("1개월");
  const [currency, setCurrency] = useState("KRW");
  const [theme, setTheme] = useState("다크 (기본)");
  const [updateFreq, setUpdateFreq] = useState("15분");
  const [notifs, setNotifs] = useState([
    { name: "가격 도달 알림", on: true },
    { name: "수급 변화 알림", on: true },
    { name: "실적 컨센서스 변화", on: true },
    { name: "포트폴리오 리스크 알림", on: false },
    { name: "주간 리포트 이메일", on: true },
  ]);

  const toggleMarket = (m: string) => setMarkets((p) => (p.includes(m) ? p.filter((x) => x !== m) : [...p, m]));

  return (
    <div className="space-y-6 max-w-3xl">
      <SectionTitle eyebrow="SETTINGS" title="설정" description="투자 성향과 표시 옵션을 조정합니다." />

      <Panel className="p-5">
        <PanelHeader title="투자 성향" eyebrow="PROFILE" className="!p-0" />
        <div className="grid grid-cols-3 gap-2 mt-4">
          {["공격형", "균형형", "방어형"].map((p) => (
            <button key={p} onClick={() => setProfile(p)} className={cn("rounded-xl border p-4 text-left transition", profile === p ? "border-[var(--cyan-accent)]/60 bg-[color-mix(in_oklab,var(--cyan-accent)_12%,transparent)]" : "border-border/50 hover:border-border")}>
              <div className="text-sm font-semibold">{p}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{p === "공격형" ? "수익 탄력 우선" : p === "균형형" ? "수익·방어 균형" : "원금 보존 우선"}</div>
            </button>
          ))}
        </div>
      </Panel>

      <Panel className="p-5">
        <PanelHeader title="관심 시장" eyebrow="MARKETS" subtitle="복수 선택 가능" className="!p-0" />
        <div className="flex flex-wrap gap-2 mt-4">
          {["국내주식", "미국주식", "ETF", "반도체", "AI 인프라", "배당주"].map((m) => (
            <button key={m} onClick={() => toggleMarket(m)} className={cn("px-3 py-1.5 rounded-md text-xs border transition", markets.includes(m) ? "border-[var(--cyan-accent)]/60 bg-[color-mix(in_oklab,var(--cyan-accent)_12%,transparent)] text-[var(--cyan-accent)]" : "border-border/50 text-muted-foreground hover:text-foreground")}>
              {m}
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid md:grid-cols-2 gap-4">
        <Panel className="p-5">
          <PanelHeader title="기본 투자 기간" eyebrow="HORIZON" className="!p-0" />
          <select value={horizon} onChange={(e) => setHorizon(e.target.value)} className="w-full h-10 rounded-lg bg-muted/40 border border-border/50 px-3 text-sm mt-4">
            {["단기", "1개월", "3개월", "장기"].map((h) => (<option key={h}>{h}</option>))}
          </select>
        </Panel>
        <Panel className="p-5">
          <PanelHeader title="표시 통화" eyebrow="CURRENCY" className="!p-0" />
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full h-10 rounded-lg bg-muted/40 border border-border/50 px-3 text-sm mt-4">
            {["KRW", "USD", "혼합 (원화 우선)"].map((c) => (<option key={c}>{c}</option>))}
          </select>
        </Panel>
        <Panel className="p-5">
          <PanelHeader title="데이터 업데이트 주기" eyebrow="REFRESH" className="!p-0" />
          <select value={updateFreq} onChange={(e) => setUpdateFreq(e.target.value)} className="w-full h-10 rounded-lg bg-muted/40 border border-border/50 px-3 text-sm mt-4">
            {["실시간", "5분", "15분", "1시간"].map((c) => (<option key={c}>{c}</option>))}
          </select>
        </Panel>
        <Panel className="p-5">
          <PanelHeader title="화면 테마" eyebrow="THEME" className="!p-0" />
          <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full h-10 rounded-lg bg-muted/40 border border-border/50 px-3 text-sm mt-4">
            {["다크 (기본)", "딥 네이비", "고대비"].map((c) => (<option key={c}>{c}</option>))}
          </select>
        </Panel>
      </div>

      <Panel className="p-5">
        <PanelHeader title="알림 설정" eyebrow="NOTIFICATIONS" className="!p-0" />
        <div className="mt-4 space-y-3">
          {notifs.map((n, i) => (
            <div key={n.name} className="flex items-center justify-between text-sm">
              <span>{n.name}</span>
              <button onClick={() => setNotifs((p) => p.map((x, j) => j === i ? { ...x, on: !x.on } : x))} className={cn("relative h-5 w-9 rounded-full transition", n.on ? "bg-[var(--cyan-accent)]" : "bg-muted")}>
                <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-background transition-all", n.on ? "left-[18px]" : "left-0.5")} />
              </button>
            </div>
          ))}
        </div>
      </Panel>

      <div className="flex justify-end gap-2">
        <button className="h-10 px-4 rounded-lg border border-border/60 text-sm">초기화</button>
        <button className="h-10 px-5 rounded-lg bg-[var(--cyan-accent)] text-[oklch(0.12_0.03_270)] text-sm font-semibold glow-cyan">저장</button>
      </div>
    </div>
  );
}