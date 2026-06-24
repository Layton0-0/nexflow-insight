import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Activity,
  Target,
  Bell,
  ShieldAlert,
  LineChart,
} from "lucide-react";
import { Brand } from "@/components/layout/AppShell";
import { ScenarioBar, ScoreRing, PriceZoneTrack } from "@/components/nexflow/widgets";
import { Panel, Badge } from "@/components/nexflow/primitives";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { priceSeries } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEXFLOW — 조건부 시나리오 기반 투자 판단 시스템" },
      {
        name: "description",
        content:
          "NEXFLOW는 주가를 하나의 숫자로 단정하지 않습니다. 실적·수급·밸류에이션·모멘텀·이벤트를 분석해 상승·중립·하락 시나리오와 실행 가능한 가격 구간을 제시합니다.",
      },
      { property: "og:title", content: "NEXFLOW — 시장의 흐름을 조건부 시나리오로 읽다" },
      {
        property: "og:description",
        content: "AI 트레이딩 터미널 수준의 분석을 개인 투자자에게.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Activity, title: "시나리오 기반 판단", desc: "강세·중립·약세 확률과 각 시나리오의 트리거 조건을 함께 제시합니다." },
  { icon: TrendingUp, title: "실적 추정치 변화 추적", desc: "컨센서스 상향·하향 흐름을 점수화하여 추세를 가시화합니다." },
  { icon: LineChart, title: "수급·모멘텀 점수화", desc: "외국인·기관 수급과 상대강도 모멘텀을 단일 점수로 압축합니다." },
  { icon: Target, title: "보유 평단 기준 전략", desc: "신규매수자, 보유자, 수익자별로 다른 액션을 제안합니다." },
  { icon: Bell, title: "판단 변경 조건 알림", desc: "단순 가격이 아닌 수급·이벤트·기술 조건이 충족될 때 알립니다." },
  { icon: ShieldAlert, title: "포트폴리오 리스크 분석", desc: "집중도·상관관계·섹터 노출도를 한 화면에서 진단합니다." },
];

function Landing() {
  return (
    <div className="min-h-screen grid-bg">
      <header className="px-5 md:px-10 h-16 flex items-center justify-between border-b border-border/40 backdrop-blur-md bg-background/40 sticky top-0 z-20">
        <Brand />
        <nav className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition px-3 py-1.5"
          >
            대시보드
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90 transition"
          >
            시작하기 <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </nav>
      </header>

      <section className="relative px-5 md:px-10 pt-16 md:pt-24 pb-20 max-w-[1280px] mx-auto">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--cyan-accent)]/30 bg-[color-mix(in_oklab,var(--cyan-accent)_10%,transparent)] text-[var(--cyan-accent)] text-[11px] font-medium tracking-wide">
              <Sparkles className="h-3 w-3" /> SCENARIO INTELLIGENCE · MVP 2026
            </div>
            <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              예측이 아니라,
              <br />
              <span className="text-gradient">조건을 설계하세요.</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              NEXFLOW는 주가를 하나의 숫자로 단정하지 않습니다. 실적, 수급, 밸류에이션,
              모멘텀, 이벤트를 분석해 상승·중립·하락 시나리오와 실행 가능한 가격 구간을
              제시합니다.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-[var(--cyan-accent)] text-[oklch(0.12_0.03_270)] text-sm font-semibold glow-cyan hover:opacity-95 transition"
              >
                대시보드 보기 <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/analysis"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-xl border border-border bg-card/60 backdrop-blur text-sm font-semibold hover:bg-muted/50 transition"
              >
                샘플 분석 보기
              </Link>
            </div>
            <p className="mt-6 text-[11px] text-muted-foreground/80 leading-relaxed">
              본 서비스는 투자 판단 보조 도구이며, 투자 결과를 보장하지 않습니다.
            </p>
          </div>

          <HeroPreview />
        </div>
      </section>

      <section className="px-5 md:px-10 pb-24 max-w-[1280px] mx-auto">
        <div className="text-center mb-10">
          <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--cyan-accent)] font-semibold">
            CORE CAPABILITIES
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold mt-2">
            시장의 흐름을 조건부 시나리오로 읽다
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <Panel key={f.title} className="p-6 group hover:border-[var(--cyan-accent)]/40 transition">
                <div className="h-10 w-10 rounded-lg bg-[color-mix(in_oklab,var(--cyan-accent)_15%,transparent)] grid place-items-center text-[var(--cyan-accent)] mb-4 group-hover:shadow-[0_0_18px_-4px_var(--cyan-accent)] transition">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-base font-semibold">{f.title}</div>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{f.desc}</p>
              </Panel>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-border/40 px-5 md:px-10 py-6 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2 max-w-[1280px] mx-auto">
        <div>© 2026 NEXFLOW. Scenario Intelligence for Investors.</div>
        <div className="opacity-70">본 서비스는 투자 판단 보조 도구이며, 투자 결과를 보장하지 않습니다.</div>
      </footer>
    </div>
  );
}

function HeroPreview() {
  const data = priceSeries.slice(-50);
  return (
    <div className="relative">
      <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,var(--cyan-accent)_0%,transparent_60%)] opacity-20 blur-3xl" />
      <Panel className="relative p-5 glass-strong">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--cyan-accent)] font-semibold">
              LIVE SAMPLE · SK하이닉스
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <div className="text-2xl font-bold tabular-nums">2,850,000원</div>
              <span className="text-sm text-[var(--bullish)] font-medium">+2.15%</span>
            </div>
          </div>
          <ScoreRing score={82} size={72} />
        </div>

        <div className="rounded-xl bg-[var(--surface-2)]/60 border border-border/50 p-3 mb-4">
          <div className="text-[10px] text-muted-foreground mb-2">시나리오 확률</div>
          <ScenarioBar bullish={42} neutral={38} bearish={20} />
        </div>

        <div className="h-32 -mx-1 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--cyan-accent)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--cyan-accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <ReferenceArea y1={2700000} y2={2780000} fill="var(--cyan-accent)" fillOpacity={0.07} />
              <ReferenceArea y1={3050000} y2={3200000} fill="var(--bullish)" fillOpacity={0.08} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="var(--cyan-accent)"
                strokeWidth={2}
                fill="url(#heroFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2 mb-3">
          <PriceZoneTrack stock={{} as never} />
        </div>

        <div className="grid grid-cols-3 gap-2 text-[11px]">
          <div className="rounded-lg bg-[var(--surface-2)]/60 border border-border/50 p-2">
            <div className="text-muted-foreground">매수 구간</div>
            <div className="font-semibold mt-0.5 tabular-nums">2,700K</div>
          </div>
          <div className="rounded-lg bg-[var(--surface-2)]/60 border border-border/50 p-2">
            <div className="text-muted-foreground">목표</div>
            <div className="font-semibold mt-0.5 text-[var(--bullish)] tabular-nums">3,050K</div>
          </div>
          <div className="rounded-lg bg-[var(--surface-2)]/60 border border-border/50 p-2">
            <div className="text-muted-foreground">리스크</div>
            <div className="font-semibold mt-0.5 text-[var(--bearish)] tabular-nums">2,620K</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px]">
          <Badge intent="info">보유 우위</Badge>
          <span className="text-muted-foreground">신규매수: 눌림 대기</span>
        </div>
      </Panel>
    </div>
  );
}
