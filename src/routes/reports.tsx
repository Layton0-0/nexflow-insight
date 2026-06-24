import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, SectionTitle, Badge } from "@/components/nexflow/primitives";
import { reports } from "@/lib/mock-data";
import { Clock, FileText, TrendingUp, AlertTriangle, Wallet, Star } from "lucide-react";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "리포트 — NEXFLOW" }] }),
  component: () => (<AppShell><Reports /></AppShell>),
});

function Reports() {
  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="BRIEFINGS" title="AI 투자 리포트" description="장전·장중·마감·주간 4가지 리듬으로 시장을 정리합니다." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r) => (
          <Panel key={r.title} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Badge intent="info">{r.type}</Badge>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {r.time}</span>
            </div>
            <div className="text-base font-semibold leading-snug">{r.title}</div>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.summary}</p>
            <button className="mt-4 text-xs text-[var(--cyan-accent)] hover:underline">리포트 전문 보기 →</button>
          </Panel>
        ))}
      </div>

      <Panel className="p-6">
        <PanelHeader eyebrow="TODAY · 06.24" title="오늘의 반도체 전략" subtitle="대표 리포트 미리보기" className="!p-0" right={<FileText className="h-4 w-4 text-muted-foreground" />} />
        <p className="text-sm text-foreground/90 mt-4 leading-relaxed">
          미국 반도체주는 강세를 유지하고 있으나 단기 과열 부담이 있습니다. SK하이닉스는 보유 우위,
          신규 진입은 눌림 확인 후 접근이 유리합니다.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <ReportBlock icon={TrendingUp} title="시장 요약" items={["코스피 +0.82%, 외국인 순매수 우위", "필라델피아 반도체 +1.34%", "원/달러 1,382.5 강세"]} color="var(--cyan-accent)" />
          <ReportBlock icon={Star} title="오늘의 기회" items={["SK하이닉스 익절 구간 근접", "NVDA 눌림 매수 대기", "TSMC 추세 유지"]} color="var(--bullish)" />
          <ReportBlock icon={AlertTriangle} title="리스크 요인" items={["환율 변동성 확대", "반도체 섹터 과열 신호", "VIX 하단권 — 변동성 압축"]} color="var(--neutral-accent)" />
          <ReportBlock icon={Wallet} title="포트폴리오 액션" items={["SK하이닉스 30% 익절 검토", "QLD 비중 축소", "현금 비중 15% 확보"]} color="var(--violet-accent)" />
          <ReportBlock icon={Star} title="관심종목 변화" items={["VST 신규 편입 후보", "ASML 모니터링", "MU 실적 후 재평가"]} color="var(--cyan-accent)" />
          <ReportBlock icon={FileText} title="이벤트 캘린더" items={["06.26 NVIDIA 실적", "06.27 Micron 가이던스", "07.24 SK하이닉스 실적"]} color="var(--muted-foreground)" />
        </div>
      </Panel>
    </div>
  );
}

function ReportBlock({ icon: Icon, title, items, color }: { icon: typeof Clock; title: string; items: string[]; color: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-[var(--surface-2)]/60 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-7 w-7 rounded-md grid place-items-center" style={{ background: `color-mix(in oklab, ${color} 18%, transparent)`, color }}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="text-sm font-semibold">{title}</div>
      </div>
      <ul className="space-y-1.5">
        {items.map((i) => (<li key={i} className="text-xs text-foreground/90 flex gap-2"><span style={{ color }}>•</span>{i}</li>))}
      </ul>
    </div>
  );
}