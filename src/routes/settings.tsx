import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, SectionTitle } from "@/components/nexflow/primitives";
import { cn } from "@/lib/utils";
import { KeyRound, ShieldCheck, ShieldAlert, LockKeyhole, Fingerprint, ChevronRight, Bot } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { Panel as BrokerPanel } from "@/components/nexflow/primitives";
import { Badge as NxBadge } from "@/components/nexflow/primitives";

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

      <SectionTitle eyebrow="BROKER & AUTOMATION" title="증권사 및 자동투자 설정" description="증권 계좌 연결, 자동화 모드, 리스크 한도, 감사 로그를 한 곳에서 관리합니다." />

      <div>
        <div className="text-sm font-semibold mb-3">증권사 연결 상태</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BrokerStatusCard type="paper" broker="한국투자증권" account="KIS Paper · ****-**-1234" connected lastVerified="2026.06.24 09:12" />
          <BrokerStatusCard type="live" broker="한국투자증권" account="—" connected={false} lastVerified={null} />
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          자격증명 입력·수정은 자동투자 화면의 증권사 연동 탭에서만 가능합니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {[
          { icon: KeyRound, title: "증권사 연동", desc: "한국투자 · 키움 · 토스 계좌를 안전하게 관리합니다.", to: "/automation" },
          { icon: Bot, title: "자동화 모드", desc: "모의투자만 · 실전 자동매매는 잠금 상태입니다.", to: "/automation" },
          { icon: ShieldAlert, title: "리스크 한도", desc: "일일 손실 · 주문 한도 · 킬스위치를 설정합니다.", to: "/automation" },
          { icon: Fingerprint, title: "감사 로그", desc: "자동화와 관련된 모든 이벤트를 추적합니다.", to: "/automation" },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.title} to={c.to} className="block">
              <Panel className="p-5 hover:border-primary/40 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-muted grid place-items-center"><Icon className="h-5 w-5 text-primary" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{c.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{c.desc}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </Panel>
            </Link>
          );
        })}
      </div>

      <Panel className="p-5">
        <PanelHeader eyebrow="SECURITY & SECRETS" title="보안 및 자격증명" subtitle="자격증명은 암호화되어 저장되며, 저장 후 다시 전체 값으로 표시되지 않습니다." className="!p-0" />
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between p-3 rounded-xl border border-border">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[var(--primary)]" />자격증명 암호화</div>
            <span className="text-xs text-muted-foreground">활성 · AES-256 GCM</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border border-border">
            <div className="flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-[var(--primary)]" />비밀 값 마스킹</div>
            <span className="text-xs text-muted-foreground">저장 후 재표시 불가</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border border-border">
            <div className="flex items-center gap-2"><Fingerprint className="h-4 w-4 text-[var(--primary)]" />마지막 자격증명 검증</div>
            <span className="text-xs text-muted-foreground tabular">2026.06.24 09:12</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="h-9 px-3 rounded-lg border border-border text-sm">모든 자동화 비활성화</button>
          <button className="h-9 px-3 rounded-lg border border-[color-mix(in_oklab,var(--bearish)_28%,var(--border))] text-sm text-[var(--bearish)]">모든 자격증명 폐기</button>
        </div>
      </Panel>
    </div>
  );
}

function BrokerStatusCard({ type, broker, account, connected, lastVerified }: { type: "paper" | "live"; broker: string; account: string; connected: boolean; lastVerified: string | null }) {
  const isPaper = type === "paper";
  return (
    <BrokerPanel className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-muted grid place-items-center">
            {isPaper ? <Bot className="h-4 w-4 text-primary" /> : <LockKeyhole className="h-4 w-4 text-[var(--neutral-accent)]" />}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">
              {broker} · {isPaper ? "모의투자" : "실전투자"}
            </div>
            <div className="text-[11px] text-muted-foreground truncate">{account}</div>
          </div>
        </div>
        {connected ? (
          <NxBadge intent="bullish"><CheckCircle2 className="h-3 w-3" />연동됨</NxBadge>
        ) : (
          <NxBadge intent="neutral">미연동</NxBadge>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <NxBadge intent="neutral">국내주식</NxBadge>
        <NxBadge intent="neutral">미국주식</NxBadge>
        {isPaper ? (
          <NxBadge intent="info">모의</NxBadge>
        ) : (
          <NxBadge intent="warn"><LockKeyhole className="h-3 w-3" />실전 자동매매 잠금</NxBadge>
        )}
      </div>
      <div className="mt-4 text-xs text-muted-foreground flex items-center justify-between">
        <span>마지막 검증</span>
        <span className="text-foreground tabular">{lastVerified ?? "—"}</span>
      </div>
      <div className="mt-4">
        <Link to="/automation" className="inline-flex items-center gap-1 text-xs text-[var(--cyan-accent)] hover:underline">
          자동투자에서 관리 <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </BrokerPanel>
  );
}