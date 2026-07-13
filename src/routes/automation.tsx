import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bot,
  ShieldCheck,
  ShieldAlert,
  LockKeyhole,
  Activity,
  Workflow,
  Cpu,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  KeyRound,
  Search,
  Eye,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  Fingerprint,
  Zap,
  Ban,
  Sparkles,
  BookmarkCheck,
  ArrowRight,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, SectionTitle, Stat, Badge as NxBadge } from "@/components/nexflow/primitives";
import { GuestLoginPanel, EmptyState, PreviewBar, PreviewToggle } from "@/components/nexflow/auth-panels";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  brokers, accounts, queueSignals, orderProposals, rules, history, auditLogs,
  automationModeLabel, connectionStatusLabel, signalStatusLabel, historyStatusLabel,
  getBroker, getAccount,
  type Broker, type BrokerAccount, type QueueSignal, type OrderProposal, type Rule,
  type HistoryRow, type AuditEvent, type AutomationMode, type ConnectionStatus,
  type RiskCheckResult,
} from "@/lib/mock-automation";
import { toast } from "sonner";

export const Route = createFileRoute("/automation")({
  head: () => ({ meta: [{ title: "자동투자 — NEXFLOW" }] }),
  component: () => (<AppShell><AutomationPage /></AppShell>),
});

function AutomationPage() {
  const [tab, setTab] = useState("overview");
  const [authState, setAuthState] = useState<"loggedIn" | "guest">("loggedIn");
  const [previewState, setPreviewState] = useState<"populated" | "empty" | "liveConsent">("populated");
  const isEmpty = previewState === "empty";
  const isLiveConsent = previewState === "liveConsent";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <SectionTitle
          eyebrow="TRADING AUTOMATION"
          title="자동투자"
          description="증권 계좌를 연결하고, 시스템 신호가 주문으로 이어지는 방식을 안전하게 관리합니다."
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ShieldCheck className="h-4 w-4" />
            안전 규칙
          </Button>
          <ConnectBrokerDialog trigger={<Button size="sm"><Plus className="h-4 w-4" />계좌 연결</Button>} />
        </div>
      </div>

      <PreviewBar>
        <PreviewToggle
          label="Auth"
          value={authState}
          onChange={setAuthState}
          options={[
            { value: "loggedIn", label: "로그인됨" },
            { value: "guest", label: "게스트" },
          ]}
        />
        <PreviewToggle
          label="State"
          value={previewState}
          onChange={setPreviewState}
          options={[
            { value: "populated", label: "데이터 있음" },
            { value: "empty", label: "비어 있음" },
            { value: "liveConsent", label: "실전 활성화 고지" },
          ]}
        />
      </PreviewBar>

      <SafetyBanner />

      {authState === "guest" ? (
        <GuestLoginPanel
          title="로그인이 필요합니다"
          description="자동투자 설정과 증권 연동은 로그인 후 이용할 수 있습니다."
        />
      ) : (
      <>
      {isLiveConsent && <LiveUnlockConsent />}
      <Tabs value={tab} onValueChange={setTab}>
        <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
          <TabsList className="flex-wrap h-auto justify-start">
            <TabsTrigger value="overview"><Activity className="h-3.5 w-3.5" />개요</TabsTrigger>
            <TabsTrigger value="brokers"><KeyRound className="h-3.5 w-3.5" />증권사 연동</TabsTrigger>
            <TabsTrigger value="rules"><Workflow className="h-3.5 w-3.5" />자동화 규칙</TabsTrigger>
            <TabsTrigger value="queue"><Sparkles className="h-3.5 w-3.5" />신호 대기열</TabsTrigger>
            <TabsTrigger value="review"><ShieldCheck className="h-3.5 w-3.5" />주문 검토</TabsTrigger>
            <TabsTrigger value="history"><BookmarkCheck className="h-3.5 w-3.5" />실행 내역</TabsTrigger>
            <TabsTrigger value="risk"><ShieldAlert className="h-3.5 w-3.5" />리스크 통제</TabsTrigger>
            <TabsTrigger value="audit"><Fingerprint className="h-3.5 w-3.5" />감사 로그</TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-6">
          <TabsContent value="overview">{isEmpty ? <OverviewEmpty onConnect={() => setTab("brokers")} /> : <OverviewTab onNav={setTab} />}</TabsContent>
          <TabsContent value="brokers">{isEmpty ? <BrokersEmpty /> : <BrokersTab />}</TabsContent>
          <TabsContent value="rules">{isEmpty ? <RulesEmpty /> : <RulesTab />}</TabsContent>
          <TabsContent value="queue">{isEmpty ? <QueueEmpty /> : <QueueTab />}</TabsContent>
          <TabsContent value="review">{isEmpty ? <ReviewEmpty /> : <ReviewTab />}</TabsContent>
          <TabsContent value="history">{isEmpty ? <HistoryEmpty /> : <HistoryTab />}</TabsContent>
          <TabsContent value="risk">{isEmpty ? <RiskEmpty onConfigure={() => setTab("risk")} /> : <RiskTab />}</TabsContent>
          <TabsContent value="audit">{isEmpty ? <AuditEmpty /> : <AuditTab />}</TabsContent>
        </div>
      </Tabs>
      </>
      )}
    </div>
  );
}

/* ============ Safety Banner ============ */

function SafetyBanner() {
  return (
    <Panel className="p-5 border-[color-mix(in_oklab,var(--neutral-accent)_28%,var(--border))] bg-[color-mix(in_oklab,var(--neutral-accent)_5%,transparent)]">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-[color-mix(in_oklab,var(--neutral-accent)_18%,transparent)] text-[var(--neutral-accent)] grid place-items-center shrink-0">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold text-[var(--neutral-accent)] tracking-tight mb-1">AUTOMATION SAFETY FIRST</div>
          <div className="text-base font-semibold text-foreground">실전 자동매매는 보안·리스크 통제·명시적 동의 이후에만 활성화됩니다</div>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            NEXFLOW 자동투자는 사용자가 모르는 사이 실전 주문을 실행하지 않습니다.
            실전 자동매매에는 인증된 계좌, 명시적 동의, 계좌별 한도, 전략별 한도, 킬스위치, 감사 로그가 모두 필요합니다.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm"><ShieldCheck className="h-4 w-4" />안전 규칙 보기</Button>
          <Button variant="outline" size="sm"><ShieldAlert className="h-4 w-4" />리스크 통제 열기</Button>
        </div>
      </div>
    </Panel>
  );
}

/* ============ Overview ============ */

function OverviewTab({ onNav }: { onNav: (t: string) => void }) {
  const connected = accounts.filter((a) => a.status === "connected").length;
  const pending = queueSignals.filter((s) => s.status === "waiting" || s.status === "new").length;
  const paper = queueSignals.filter((s) => s.mode === "paper").length;
  const needApproval = queueSignals.filter((s) => s.status === "waiting").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Panel className="p-5">
          <Stat
            label="Connected Brokers · 연결된 증권사"
            value={`${connected} / ${brokers.length}`}
            delta={<span className="text-muted-foreground">한국투자 연결됨 · 키움 확인 필요 · 토스 미연결</span>}
          />
        </Panel>
        <Panel className="p-5">
          <div className="text-[11px] text-muted-foreground">Automation Mode · 자동화 모드</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">Paper Trading Only</span>
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">모의투자만 · 실전 잠금 상태</div>
          <div className="flex gap-1.5 mt-3">
            <NxBadge intent="info">모의</NxBadge>
            <NxBadge intent="neutral"><LockKeyhole className="h-3 w-3" />실전 잠금</NxBadge>
          </div>
        </Panel>
        <Panel className="p-5">
          <div className="text-[11px] text-muted-foreground">Risk Status · 리스크 상태</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight text-[var(--primary)]">Protected</span>
            <ShieldCheck className="h-4 w-4 text-[var(--primary)]" />
          </div>
          <div className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
            일일 손실 한도 활성화 · 주문 한도 설정됨 · 킬스위치 준비됨
          </div>
        </Panel>
        <Panel className="p-5">
          <Stat
            label="Pending Signals · 대기 신호"
            value={pending}
            suffix="건"
            delta={<span className="text-muted-foreground">승인 필요 {needApproval}개 · 모의 전용 {paper}개</span>}
          />
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel className="p-5 lg:col-span-2">
          <PanelHeader
            eyebrow="AT A GLANCE"
            title="오늘의 자동화 현황"
            subtitle="현재 설정에서는 모의투자만 허용됩니다."
            className="!p-0"
            right={<Button variant="ghost" size="sm" onClick={() => onNav("queue")}>신호 대기열 <ChevronRight className="h-4 w-4" /></Button>}
          />
          <div className="mt-5 space-y-3">
            {queueSignals.slice(0, 4).map((s) => (
              <SignalRow key={s.id} s={s} compact />
            ))}
          </div>
        </Panel>

        <Panel className="p-5">
          <PanelHeader eyebrow="KILL SWITCH" title="전체 킬스위치" subtitle="비상 시 모든 자동화를 즉시 중단합니다." className="!p-0" />
          <div className="mt-4 rounded-xl border border-border p-4 bg-muted/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                <span className="text-sm font-medium">Ready · 준비됨</span>
              </div>
              <NxBadge intent="info">대기</NxBadge>
            </div>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              활성화 시 진행 중인 자동화, 신호 생성, 주문 제안이 모두 중단됩니다.
            </p>
            <Button className="w-full mt-3" variant="outline"><Zap className="h-4 w-4" />킬스위치 활성화</Button>
          </div>
          <div className="mt-4 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><LockKeyhole className="h-3.5 w-3.5" />실전 자동매매 잠금</div>
            <div className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" />모든 이벤트 감사 기록</div>
            <div className="flex items-center gap-2"><Fingerprint className="h-3.5 w-3.5" />기기·IP 기록 보관</div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ============ Brokers Tab ============ */

function BrokersTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-lg font-semibold">증권사 연동</h3>
          <p className="text-sm text-muted-foreground mt-1">
            선택적으로 증권 계좌를 연결하고, 계좌별로 사용할 시장과 자동화 범위를 설정합니다.
          </p>
        </div>
        <ConnectBrokerDialog trigger={<Button size="sm"><Plus className="h-4 w-4" />증권사 연결</Button>} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {brokers.map((b) => {
          const bAccounts = accounts.filter((a) => a.brokerId === b.id);
          const connected = bAccounts.some((a) => a.status === "connected");
          const needs = bAccounts.some((a) => a.status === "needs-verification");
          const status: ConnectionStatus = connected ? "connected" : needs ? "needs-verification" : "not-connected";
          return (
            <Panel key={b.id} className="p-5 flex flex-col">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-muted grid place-items-center text-xs font-bold tracking-tight">
                    {b.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{b.nameKr}</div>
                    <div className="text-[11px] text-muted-foreground">{b.name}</div>
                  </div>
                </div>
                <StatusBadge status={status} />
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <NxBadge intent="neutral">국내주식</NxBadge>
                <NxBadge intent="neutral">미국주식</NxBadge>
                <NxBadge intent="info">{b.method}</NxBadge>
              </div>
              <div className="mt-4 text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between"><span>연결된 계좌</span><span className="text-foreground tabular">{bAccounts.filter((a) => a.status !== "not-connected").length}개</span></div>
                <div className="flex justify-between"><span>자동화 상태</span><span className="text-foreground">{bAccounts.some((a) => a.automationMode !== "off") ? "일부 활성" : "비활성"}</span></div>
                <div className="flex justify-between"><span>마지막 검증</span><span className="text-foreground tabular">{bAccounts.find((a) => a.lastVerified)?.lastVerified ?? "—"}</span></div>
              </div>
              <div className="mt-5 flex items-center gap-2">
                {status === "not-connected" ? (
                  <ConnectBrokerDialog trigger={<Button size="sm" className="flex-1">연결</Button>} />
                ) : (
                  <>
                    <Button size="sm" variant="outline" className="flex-1">관리</Button>
                    <Button size="sm" variant="ghost">검증</Button>
                  </>
                )}
              </div>
            </Panel>
          );
        })}
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-3">연결된 계좌</h4>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {accounts.map((a) => (
            <AccountCard key={a.id} a={a} />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
          실전투자 <NxBadge intent="warn"><LockKeyhole className="h-3 w-3" />기본 잠금</NxBadge>
        </h4>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <LiveAccountCard broker="한국투자증권" initials="KIS" status="not-connected" />
          <LiveAccountCard broker="키움증권" initials="키움" status="locked" />
        </div>
      </div>
    </div>
  );
}

function LiveAccountCard({ broker, initials, status }: { broker: string; initials: string; status: "not-connected" | "connected" | "locked" }) {
  const badge =
    status === "connected" ? <NxBadge intent="bullish"><CheckCircle2 className="h-3 w-3" />연동됨</NxBadge>
    : status === "locked" ? <NxBadge intent="warn"><LockKeyhole className="h-3 w-3" />잠김</NxBadge>
    : <NxBadge intent="neutral">미연동</NxBadge>;
  return (
    <Panel className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-8 w-8 rounded-lg bg-muted grid place-items-center text-[10px] font-bold">{initials}</div>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{broker} · 실전투자</div>
            <div className="text-[11px] text-muted-foreground">실계좌 · 실제 자금 · 실전 자동매매는 별도 동의 필요</div>
          </div>
        </div>
        {badge}
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <NxBadge intent="neutral">국내주식</NxBadge>
        <NxBadge intent="neutral">미국주식</NxBadge>
        <NxBadge intent="warn"><LockKeyhole className="h-3 w-3" />실전 자동매매 잠금</NxBadge>
      </div>
      <div className="mt-4 text-xs text-muted-foreground space-y-1">
        <div className="flex justify-between"><span>계좌</span><span className="text-foreground">—</span></div>
        <div className="flex justify-between"><span>마지막 검증</span><span className="text-foreground">—</span></div>
      </div>
      <div className="mt-5 flex items-center gap-2">
        <ConnectBrokerDialog trigger={<Button size="sm" className="flex-1" disabled={status === "locked"}>실계좌 연결</Button>} />
        <Button size="sm" variant="ghost">자세히</Button>
      </div>
    </Panel>
  );
}

/* ============ Live Unlock Consent ============ */

function LiveUnlockConsent() {
  const [checks, setChecks] = useState({ loss: false, live: false, own: false });
  const allChecked = checks.loss && checks.live && checks.own;
  const items: { key: keyof typeof checks; label: string }[] = [
    { key: "loss", label: "실전 자동매매로 손실이 발생할 수 있음을 이해합니다." },
    { key: "live", label: "추가 승인 절차 전까지 실전 자동매매는 계속 비활성 상태로 유지됩니다." },
    { key: "own", label: "본인 명의의 증권 계좌 정보만 사용하고 있음을 확인합니다." },
  ];
  return (
    <Panel className="p-5 border-[color-mix(in_oklab,var(--primary)_28%,var(--border))] bg-[color-mix(in_oklab,var(--primary)_5%,transparent)]">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="h-10 w-10 rounded-xl bg-[color-mix(in_oklab,var(--primary)_16%,transparent)] text-[var(--primary)] grid place-items-center shrink-0">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="text-[11px] font-semibold text-[var(--primary)] tracking-tight mb-1">LIVE UNLOCK · 실전 자동매매 활성화 전 고지</div>
          <div className="text-base font-semibold text-foreground">실전 자동매매를 활성화하기 전에 아래 항목을 확인해주세요</div>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            NEXFLOW는 사용자의 명시적 동의 없이 실전 주문을 실행하지 않습니다. 아래 항목을 모두 확인해야 다음 단계로 넘어갈 수 있습니다.
          </p>
          <div className="mt-4 space-y-2">
            {items.map((it) => (
              <label key={it.key} className="flex items-start gap-2 text-sm">
                <Checkbox
                  checked={checks[it.key]}
                  onCheckedChange={(v) => setChecks((p) => ({ ...p, [it.key]: !!v }))}
                  className="mt-0.5"
                />
                <span>{it.label}</span>
              </label>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button size="sm" disabled={!allChecked}>
              <LockKeyhole className="h-4 w-4" />
              다음 단계 (추가 승인 필요)
            </Button>
            <Button size="sm" variant="outline">모의투자만 계속</Button>
            <span className="text-[11px] text-muted-foreground">완전 자율 모드는 이 단계에서 활성화되지 않습니다.</span>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ============ Empty States ============ */

function OverviewEmpty({ onConnect }: { onConnect: () => void }) {
  return (
    <EmptyState
      icon={<KeyRound className="h-5 w-5" />}
      title="연동된 증권사가 없습니다"
      description="증권 계좌를 연결하면 자동화 개요, 신호 현황, 리스크 상태를 한눈에 확인할 수 있습니다."
      ctaLabel="증권사 연동"
      onCta={onConnect}
    />
  );
}
function BrokersEmpty() {
  return (
    <EmptyState
      icon={<KeyRound className="h-5 w-5" />}
      title="연동된 계좌가 없습니다"
      description="한국투자 · 키움 · 토스 계좌를 안전하게 연결해 자동화를 시작하세요."
      secondary={<ConnectBrokerDialog trigger={<Button size="sm"><Plus className="h-4 w-4" />증권사 연결</Button>} />}
    />
  );
}
function RulesEmpty() {
  return (
    <EmptyState
      icon={<Workflow className="h-5 w-5" />}
      title="등록된 자동화 규칙이 없습니다"
      description="관심종목 · 포트폴리오 · 알림 규칙을 조건으로 자동화 규칙을 만들 수 있습니다."
      secondary={<CreateRuleDialog />}
    />
  );
}
function QueueEmpty() {
  return (
    <EmptyState
      icon={<Sparkles className="h-5 w-5" />}
      title="대기 중인 신호가 없습니다"
      description="신호가 생성되면 이곳에서 모의 승인 또는 검토 흐름으로 이동합니다."
    />
  );
}
function ReviewEmpty() {
  return (
    <EmptyState
      icon={<ShieldCheck className="h-5 w-5" />}
      title="검토할 주문이 없습니다"
      description="주문 제안이 만들어지면 실행 전 리스크 체크와 함께 이곳에 표시됩니다."
    />
  );
}
function HistoryEmpty() {
  return (
    <EmptyState
      icon={<BookmarkCheck className="h-5 w-5" />}
      title="실행 이력이 없습니다"
      description="모의 체결, 거절, 실전 실행 내역이 발생하면 이곳에 기록됩니다."
    />
  );
}
function RiskEmpty({ onConfigure }: { onConfigure: () => void }) {
  return (
    <EmptyState
      icon={<ShieldAlert className="h-5 w-5" />}
      title="리스크 한도가 설정되지 않았습니다"
      description="일일 손실 · 주문 한도 · 종목별 상한을 설정해 자동화를 안전하게 운영하세요."
      ctaLabel="한도 설정"
      onCta={onConfigure}
    />
  );
}
function AuditEmpty() {
  return (
    <EmptyState
      icon={<Fingerprint className="h-5 w-5" />}
      title="감사 로그가 없습니다"
      description="자동화와 관련된 이벤트가 발생하면 이곳에 기기 · IP 정보와 함께 기록됩니다."
    />
  );
}

function AccountCard({ a }: { a: BrokerAccount }) {
  const b = getBroker(a.brokerId);
  return (
    <Panel className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-muted grid place-items-center text-[10px] font-bold">{b.initials}</div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{a.label}</div>
              <div className="text-[11px] text-muted-foreground tabular">{b.nameKr} · {a.masked}</div>
            </div>
          </div>
        </div>
        <StatusBadge status={a.status} />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {a.markets.kr && <NxBadge intent="neutral">국내주식</NxBadge>}
        {a.markets.us && <NxBadge intent="neutral">미국주식</NxBadge>}
        {a.paperEnabled && <NxBadge intent="info">모의투자</NxBadge>}
        <NxBadge intent={a.automationMode === "off" ? "neutral" : "info"}>{automationModeLabel[a.automationMode]}</NxBadge>
        {a.liveLocked && <NxBadge intent="warn"><LockKeyhole className="h-3 w-3" />실전 잠금</NxBadge>}
      </div>

      <Separator className="my-4" />

      <div className="space-y-3">
        <ToggleRow label="국내주식 데이터/주문" defaultOn={a.markets.kr} disabled={a.status !== "connected"} />
        <ToggleRow label="미국주식 데이터/주문" defaultOn={a.markets.us} disabled={a.status !== "connected"} />
        <ToggleRow label="모의투자" defaultOn={a.paperEnabled} disabled={a.status !== "connected"} />
        <ToggleRow label="실전 자동매매" defaultOn={false} disabled locked />
        <ToggleRow label="자동화 활성화" defaultOn={a.automationMode !== "off"} disabled={a.status !== "connected"} />
        <ToggleRow label="킬스위치" defaultOn={a.killSwitch === "engaged"} intent="danger" />
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>리스크 프로필 · {a.riskProfile}</span>
        <span className="tabular">마지막 검증 · {a.lastVerified ?? "—"}</span>
      </div>

      <div className="mt-4 flex gap-2">
        <Button size="sm" variant="outline" className="flex-1">관리</Button>
        <Button size="sm" variant="ghost" className="text-[var(--bearish)] hover:text-[var(--bearish)]"><Ban className="h-4 w-4" />폐기</Button>
      </div>
    </Panel>
  );
}

function ToggleRow({ label, defaultOn, disabled, locked, intent }: { label: string; defaultOn: boolean; disabled?: boolean; locked?: boolean; intent?: "danger" }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className={cn("flex items-center justify-between", disabled && "opacity-60")}>
      <div className="flex items-center gap-2 text-sm">
        {locked && <LockKeyhole className="h-3.5 w-3.5 text-muted-foreground" />}
        <span className={intent === "danger" ? "text-[var(--bearish)]" : ""}>{label}</span>
      </div>
      <Switch checked={on} onCheckedChange={setOn} disabled={disabled || locked} />
    </div>
  );
}

function StatusBadge({ status }: { status: ConnectionStatus }) {
  const map: Record<ConnectionStatus, { intent: "info" | "warn" | "neutral" | "bearish" | "bullish"; icon?: React.ReactNode }> = {
    connected: { intent: "bullish", icon: <CheckCircle2 className="h-3 w-3" /> },
    "needs-verification": { intent: "warn", icon: <AlertTriangle className="h-3 w-3" /> },
    "not-connected": { intent: "neutral" },
    expired: { intent: "warn" },
    disabled: { intent: "neutral" },
    revoked: { intent: "bearish", icon: <Ban className="h-3 w-3" /> },
  };
  const m = map[status];
  return <NxBadge intent={m.intent}>{m.icon}{connectionStatusLabel[status]}</NxBadge>;
}

/* ============ Connect Dialog ============ */

function ConnectBrokerDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [brokerId, setBrokerId] = useState<Broker["id"] | null>(null);
  const [mode, setMode] = useState<AutomationMode>("paper");
  const [krData, setKrData] = useState(true);
  const [krOrder, setKrOrder] = useState(false);
  const [usData, setUsData] = useState(true);
  const [usOrder, setUsOrder] = useState(false);
  const [consents, setConsents] = useState<Record<string, boolean>>({ loss: false, live: false, own: false });

  const reset = () => { setStep(1); setBrokerId(null); setMode("paper"); setConsents({ loss: false, live: false, own: false }); };
  const canFinish = consents.loss && consents.live && consents.own;

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>증권 계좌 연결</DialogTitle>
          <DialogDescription>단계별로 계좌를 안전하게 연결합니다. 민감 정보는 암호화되어 저장됩니다.</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className={cn("flex-1 h-1.5 rounded-full", n <= step ? "bg-primary" : "bg-muted")} />
          ))}
        </div>
        <div className="text-[11px] text-muted-foreground">STEP {step} / 6</div>

        {step === 1 && (
          <div className="space-y-3 py-2">
            <div className="text-sm font-medium">증권사 선택</div>
            <div className="grid grid-cols-1 gap-2">
              {brokers.map((b) => (
                <button key={b.id} onClick={() => setBrokerId(b.id)}
                  className={cn("flex items-center gap-3 p-4 rounded-xl border text-left transition-colors",
                    brokerId === b.id ? "border-primary bg-[color-mix(in_oklab,var(--primary)_8%,transparent)]" : "border-border hover:border-primary/40")}>
                  <div className="h-10 w-10 rounded-lg bg-muted grid place-items-center text-xs font-bold">{b.initials}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{b.nameKr}</div>
                    <div className="text-[11px] text-muted-foreground">{b.name} · {b.method}</div>
                  </div>
                  <div className="flex gap-1">
                    {b.supportsKr && <NxBadge intent="neutral">국내</NxBadge>}
                    {b.supportsUs && <NxBadge intent="neutral">미국</NxBadge>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3 py-2">
            <div className="text-sm font-medium">계좌 정보</div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="계좌 라벨" placeholder="예: KIS Main" />
              <Field label="계좌 번호" placeholder="000-00-000000" />
              <Field label="API Key" placeholder="••••••••" type="password" />
              <Field label="Secret Key" placeholder="••••••••" type="password" />
              <Field label="App Key (선택)" placeholder="••••••••" type="password" />
              <Field label="App Secret (선택)" placeholder="••••••••" type="password" />
              <Field label="Approval Key (선택)" placeholder="••••••••" type="password" />
              <div className="col-span-2">
                <Label className="text-xs">메모 (선택)</Label>
                <Textarea placeholder="용도 · 담당자 등" className="mt-1.5" />
              </div>
            </div>
            <div className="flex gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span className="text-muted-foreground leading-relaxed">
                민감 정보는 암호화되어 저장되며, 저장 후 다시 전체 값으로 표시되지 않습니다.
              </span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 py-2">
            <div className="text-sm font-medium">시장 권한</div>
            <div className="space-y-3">
              <PermRow label="국내주식 시세 사용" checked={krData} onChange={setKrData} />
              <PermRow label="국내주식 주문 허용" checked={krOrder} onChange={setKrOrder} />
              <PermRow label="미국주식 시세 사용" checked={usData} onChange={setUsData} />
              <PermRow label="미국주식 주문 허용" checked={usOrder} onChange={setUsOrder} />
            </div>
            <div className="flex gap-2 rounded-lg border border-[color-mix(in_oklab,var(--neutral-accent)_28%,var(--border))] bg-[color-mix(in_oklab,var(--neutral-accent)_5%,transparent)] p-3 text-xs">
              <AlertTriangle className="h-4 w-4 text-[var(--neutral-accent)] shrink-0 mt-0.5" />
              <span className="text-muted-foreground leading-relaxed">
                브로커 API와 계좌가 실제로 지원하는 시장만 활성화해주세요.
              </span>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3 py-2">
            <div className="text-sm font-medium">자동화 모드</div>
            <RadioGroup value={mode} onValueChange={(v) => setMode(v as AutomationMode)} className="space-y-2">
              {([
                ["off", "꺼짐", "신호도 주문도 만들지 않습니다."],
                ["paper", "모의투자만", "모든 신호를 모의 주문으로만 처리합니다. (기본)"],
                ["manual", "수동 승인", "신호가 주문 제안이 되지만 사용자가 승인해야 실행됩니다."],
                ["semi", "반자동", "정해진 조건에서만 자동 실행되고, 그 외는 승인이 필요합니다."],
                ["autonomous", "완전 자율, 잠금", "추가 안전 검증·리스크 고지·명시적 옵트인 이후에만 사용할 수 있습니다."],
              ] as const).map(([val, label, desc]) => {
                const locked = val === "autonomous";
                return (
                  <label key={val} className={cn("flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
                    mode === val ? "border-primary bg-[color-mix(in_oklab,var(--primary)_6%,transparent)]" : "border-border hover:border-primary/40",
                    locked && "opacity-60 cursor-not-allowed")}>
                    <RadioGroupItem value={val} disabled={locked} className="mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium flex items-center gap-2">
                        {label}
                        {locked && <LockKeyhole className="h-3.5 w-3.5 text-muted-foreground" />}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{desc}</div>
                    </div>
                  </label>
                );
              })}
            </RadioGroup>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-3 py-2">
            <div className="text-sm font-medium">리스크 한도</div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="1회 주문 최대 금액" placeholder="5,000,000원" />
              <Field label="일일 주문 최대 금액" placeholder="20,000,000원" />
              <Field label="일일 손실 한도" placeholder="1,000,000원" />
              <Field label="종목별 최대 보유 한도" placeholder="포트폴리오의 20%" />
              <Field label="일일 최대 주문 횟수" placeholder="10회" />
              <Field label="주문 간 대기 시간" placeholder="10분" />
              <div className="col-span-2">
                <Label className="text-xs">허용 종목 (선택)</Label>
                <Input placeholder="예: 005930, 000660, NVDA" className="mt-1.5" />
              </div>
              <div className="col-span-2">
                <Label className="text-xs">차단 종목 (선택)</Label>
                <Input placeholder="예: 레버리지 ETF, 인버스" className="mt-1.5" />
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-3 py-2">
            <div className="text-sm font-medium">검토 및 확인</div>
            <div className="rounded-xl border border-border p-4 space-y-2 text-sm bg-muted/40">
              <SumRow label="증권사" value={brokerId ? getBroker(brokerId).nameKr : "—"} />
              <SumRow label="계좌 번호" value="****-**-1234" />
              <SumRow label="시장 권한" value={[krData && "국내 시세", krOrder && "국내 주문", usData && "미국 시세", usOrder && "미국 주문"].filter(Boolean).join(" · ") || "없음"} />
              <SumRow label="자동화 모드" value={automationModeLabel[mode]} />
              <SumRow label="모의투자" value="사용" />
              <SumRow label="실전 자동매매" value={<span className="inline-flex items-center gap-1"><LockKeyhole className="h-3 w-3" />잠금</span>} />
            </div>
            <div className="space-y-2 pt-2">
              {[
                ["loss", "자동매매로 손실이 발생할 수 있음을 이해합니다."],
                ["live", "추가 승인 전까지 실전 자동매매가 비활성화됨을 이해합니다."],
                ["own", "본인 명의의 증권 계좌 정보를 사용하고 있음을 확인합니다."],
              ].map(([k, label]) => (
                <label key={k} className="flex items-start gap-2 text-sm">
                  <Checkbox checked={consents[k]} onCheckedChange={(v) => setConsents((p) => ({ ...p, [k]: !!v }))} className="mt-0.5" />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="!justify-between">
          <div>
            {step > 1 && <Button variant="ghost" onClick={() => setStep(step - 1)}>이전</Button>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>취소</Button>
            {step < 6 ? (
              <Button onClick={() => setStep(step + 1)} disabled={step === 1 && !brokerId}>다음</Button>
            ) : (
              <Button disabled={!canFinish} onClick={() => { toast.success("계좌가 안전하게 저장되었습니다."); setOpen(false); reset(); }}>
                연결 저장
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, ...rest }: { label: string; placeholder?: string; type?: string }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input className="mt-1.5" {...rest} />
    </div>
  );
}

function SumRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}

function PermRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-border">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

/* ============ Rules Tab ============ */

function RulesTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-lg font-semibold">자동화 규칙</h3>
          <p className="text-sm text-muted-foreground mt-1">저장된 NEXFLOW 신호가 어떤 조건에서 주문 제안으로 바뀌는지 설정합니다.</p>
        </div>
        <CreateRuleDialog />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {rules.map((r) => <RuleCard key={r.id} r={r} />)}
      </div>
    </div>
  );
}

function RuleCard({ r }: { r: Rule }) {
  const acc = getAccount(r.accountId);
  return (
    <Panel className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-muted grid place-items-center"><Workflow className="h-4 w-4 text-primary" /></div>
            <div>
              <div className="text-sm font-semibold">{r.name}</div>
              <div className="text-[11px] text-muted-foreground">{r.source}</div>
            </div>
          </div>
        </div>
        <NxBadge intent={r.status === "active" ? "bullish" : "neutral"}>{r.status === "active" ? "활성" : "일시정지"}</NxBadge>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-muted/40 p-3 space-y-2 text-xs">
        <RuleLine label="계좌" value={`${acc?.label ?? "—"} · ${r.market}`} />
        <RuleLine label="대상" value={r.scope} />
        <RuleLine label="트리거" value={r.trigger} />
        <RuleLine label="액션" value={r.action} />
        <RuleLine label="모드" value={automationModeLabel[r.mode]} />
        <RuleLine label="마지막 실행" value={r.lastTriggered} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button size="sm" variant="outline" className="flex-1"><Eye className="h-4 w-4" />보기</Button>
        <Button size="sm" variant="ghost">{r.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</Button>
        <Button size="sm" variant="ghost"><RotateCcw className="h-4 w-4" /></Button>
      </div>
    </Panel>
  );
}

function RuleLine({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground w-16 shrink-0">{label}</span>
      <span className="text-foreground flex-1">{value}</span>
    </div>
  );
}

function CreateRuleDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4" />규칙 만들기</Button></DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>자동화 규칙 만들기</DialogTitle>
          <DialogDescription>신호가 언제 주문 제안으로 바뀔지 정의합니다.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="col-span-2"><Field label="규칙 이름" placeholder="예: SK하이닉스 트림 규칙" /></div>
          <SelectField label="신호 소스" options={["전략 스냅샷", "AI 추천", "알림 규칙", "포트폴리오 리스크", "수동 조건"]} />
          <SelectField label="브로커 계좌" options={accounts.map((a) => a.label)} />
          <SelectField label="시장" options={["국내", "미국"]} />
          <SelectField label="대상 범위" options={["특정 종목", "관심종목", "포트폴리오 보유", "테마 바스켓"]} />
          <SelectField label="트리거 유형" options={["목표가 도달", "추가매수 존", "무효화 이탈", "Signal 개선", "Signal 악화", "거래량 급증", "리스크 알림", "커스텀 조건"]} />
          <SelectField label="액션 유형" options={["매수 제안", "매도 제안", "트림 제안", "스탑로스 제안", "모의 전용", "알림만"]} />
          <SelectField label="주문 사이징" options={["정액 금액", "정량 수량", "보유 % 비중", "현금 % 비중", "전략 정의"]} />
          <SelectField label="승인 모드" options={["알림만", "모의투자", "수동 승인", "반자동", "자율 (잠금)"]} />
          <Field label="쿨다운" placeholder="예: 30분" />
          <Field label="만료" placeholder="예: 24시간" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>취소</Button>
          <Button onClick={() => { toast.success("규칙이 저장되었습니다."); setOpen(false); }}>규칙 저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Select>
        <SelectTrigger className="mt-1.5"><SelectValue placeholder="선택" /></SelectTrigger>
        <SelectContent>
          {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

/* ============ Queue Tab ============ */

function QueueTab() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const filtered = useMemo(() => queueSignals.filter((s) => {
    if (q && !`${s.ticker}${s.company}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (status !== "all" && s.status !== status) return false;
    return true;
  }), [q, status]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">신호 대기열</h3>
        <p className="text-sm text-muted-foreground mt-1">시스템 신호가 모의 주문 또는 주문 제안으로 바뀌기 전에 검토합니다.</p>
      </div>

      <Panel className="p-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="종목명 또는 티커 검색" className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">상태 · 전체</SelectItem>
            {Object.entries(signalStatusLabel).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </Panel>

      <div className="space-y-3">
        {filtered.map((s) => <SignalRow key={s.id} s={s} />)}
      </div>
    </div>
  );
}

function SignalRow({ s, compact }: { s: QueueSignal; compact?: boolean }) {
  const acc = getAccount(s.accountId);
  const statusIntent: Record<string, "bullish" | "bearish" | "neutral" | "info" | "warn"> = {
    new: "info", waiting: "warn", "paper-executed": "bullish",
    rejected: "neutral", expired: "neutral", blocked: "bearish", "live-locked": "warn",
  };
  return (
    <Panel className="p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-3 min-w-0 md:w-64">
          <div className="h-9 w-9 rounded-lg bg-muted grid place-items-center text-[10px] font-bold">{s.market}</div>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{s.company}</div>
            <div className="text-[11px] text-muted-foreground tabular">{s.ticker} · {s.generatedAt}</div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-muted-foreground">{s.source}</div>
          <div className="text-sm font-medium mt-0.5">{s.action}</div>
          {!compact && <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.reason}</div>}
          {s.warning && !compact && (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[var(--bearish)]">
              <AlertTriangle className="h-3 w-3" />{s.warning}
            </div>
          )}
        </div>

        <div className="flex md:flex-col md:items-end items-center gap-2 md:w-48">
          <div className="text-[11px] text-muted-foreground truncate">{acc?.label}</div>
          <div className="flex gap-1.5">
            <NxBadge intent={statusIntent[s.status]}>{signalStatusLabel[s.status]}</NxBadge>
            <NxBadge intent="neutral">{automationModeLabel[s.mode]}</NxBadge>
          </div>
        </div>

        {!compact && (
          <div className="flex items-center gap-2 shrink-0">
            {s.status === "waiting" && <Button size="sm">모의 승인</Button>}
            {s.status === "new" && <Button size="sm" variant="outline">검토</Button>}
            {s.status === "blocked" && <Button size="sm" variant="outline" disabled><Ban className="h-4 w-4" />차단</Button>}
            {s.status === "live-locked" && <Button size="sm" variant="outline" disabled><LockKeyhole className="h-4 w-4" />실전 잠금</Button>}
            <Button size="sm" variant="ghost"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        )}
      </div>
    </Panel>
  );
}

/* ============ Review Tab ============ */

function ReviewTab() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">주문 검토</h3>
        <p className="text-sm text-muted-foreground mt-1">브로커로 전송되기 전 주문 제안을 검토합니다.</p>
      </div>
      <div className="space-y-4">
        {orderProposals.map((o) => <OrderCard key={o.id} o={o} />)}
      </div>
    </div>
  );
}

function OrderCard({ o }: { o: OrderProposal }) {
  const acc = getAccount(o.accountId);
  const failing = o.checks.some((c) => c.result === "fail");
  return (
    <Panel className="p-5">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={cn("h-11 w-11 rounded-xl grid place-items-center text-xs font-bold",
            o.side === "매수" ? "bg-[color-mix(in_oklab,var(--bullish)_14%,transparent)] text-[var(--bullish)]"
              : "bg-[color-mix(in_oklab,var(--bearish)_14%,transparent)] text-[var(--bearish)]")}>
            {o.side}
          </div>
          <div>
            <div className="text-sm font-semibold">{o.company} <span className="text-muted-foreground tabular">· {o.ticker}</span></div>
            <div className="text-[11px] text-muted-foreground">{acc?.label} · {acc?.masked} · {o.market}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <NxBadge intent="neutral">{o.orderType}</NxBadge>
          <NxBadge intent="neutral">{o.quantity}주</NxBadge>
          <NxBadge intent="info">{o.estAmount}</NxBadge>
          <NxBadge intent="warn"><LockKeyhole className="h-3 w-3" />실전 잠금</NxBadge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        <MiniStat label="예상 금액" value={o.estAmount} />
        <MiniStat label="현금 영향" value={o.cashImpact} />
        <MiniStat label="연결 스냅샷" value={o.linkedSnapshot} small />
      </div>

      <div className="mt-4">
        <div className="text-[11px] font-semibold text-muted-foreground mb-2">리스크 체크</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {o.checks.map((c) => <CheckRow key={c.label} label={c.label} result={c.result} detail={c.detail} />)}
        </div>
      </div>

      {failing && (
        <div className="mt-4 flex gap-2 rounded-lg border border-[color-mix(in_oklab,var(--bearish)_28%,var(--border))] bg-[color-mix(in_oklab,var(--bearish)_5%,transparent)] p-3 text-xs">
          <AlertTriangle className="h-4 w-4 text-[var(--bearish)] shrink-0 mt-0.5" />
          <span className="text-muted-foreground leading-relaxed">
            현재 설정에서는 모의투자만 허용됩니다. 실전 승인 버튼은 리스크 조건이 모두 통과되어야 활성화됩니다.
          </span>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline">규모 조정</Button>
        <Button size="sm" variant="outline"><Fingerprint className="h-4 w-4" />감사 로그</Button>
        <div className="flex-1" />
        <Button size="sm" variant="ghost" className="text-[var(--bearish)] hover:text-[var(--bearish)]">거절</Button>
        <Button size="sm" variant="outline">모의로 실행</Button>
        <Button size="sm" disabled={!o.liveAllowed}>
          <LockKeyhole className="h-4 w-4" />실전 승인
        </Button>
      </div>
    </Panel>
  );
}

function MiniStat({ label, value, small }: { label: string; value: React.ReactNode; small?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-3">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={cn("mt-0.5 font-semibold tabular", small ? "text-xs" : "text-sm")}>{value}</div>
    </div>
  );
}

function CheckRow({ label, result, detail }: { label: string; result: RiskCheckResult; detail: string }) {
  const map = {
    pass: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: "text-[var(--primary)]" },
    warn: { icon: <AlertTriangle className="h-3.5 w-3.5" />, color: "text-[var(--neutral-accent)]" },
    fail: { icon: <XCircle className="h-3.5 w-3.5" />, color: "text-[var(--bearish)]" },
  }[result];
  return (
    <div className="flex items-start gap-2 text-xs p-2 rounded-lg border border-border">
      <span className={cn("shrink-0 mt-0.5", map.color)}>{map.icon}</span>
      <div className="min-w-0 flex-1">
        <div className="font-medium">{label}</div>
        <div className="text-muted-foreground text-[11px]">{detail}</div>
      </div>
    </div>
  );
}

/* ============ History Tab ============ */

function HistoryTab() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">실행 내역</h3>
        <p className="text-sm text-muted-foreground mt-1">모의 체결, 거절된 신호, 주문 제안, 향후 실전 실행 내역을 모두 추적합니다.</p>
      </div>
      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase text-muted-foreground bg-muted/40">
                <th className="text-left px-4 py-3 font-medium">시간</th>
                <th className="text-left px-4 py-3 font-medium">계좌</th>
                <th className="text-left px-4 py-3 font-medium">종목</th>
                <th className="text-left px-4 py-3 font-medium">액션</th>
                <th className="text-left px-4 py-3 font-medium">모드</th>
                <th className="text-right px-4 py-3 font-medium">금액</th>
                <th className="text-left px-4 py-3 font-medium">상태</th>
                <th className="text-left px-4 py-3 font-medium">결과</th>
                <th className="text-left px-4 py-3 font-medium">스냅샷</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {history.map((h) => <HistoryRowUI key={h.id} h={h} />)}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function HistoryRowUI({ h }: { h: HistoryRow }) {
  const acc = getAccount(h.accountId);
  const intents: Record<string, "bullish" | "bearish" | "neutral" | "info" | "warn"> = {
    "paper-filled": "info",
    "paper-rejected": "neutral",
    "proposal-created": "warn",
    "user-approved": "bullish",
    "user-rejected": "neutral",
    "broker-sent": "info",
    "broker-accepted": "bullish",
    "broker-rejected": "bearish",
    cancelled: "neutral",
    failed: "bearish",
    "live-locked": "warn",
  };
  return (
    <tr className="border-t border-border">
      <td className="px-4 py-3 text-muted-foreground tabular">{h.time}</td>
      <td className="px-4 py-3">{acc?.label}</td>
      <td className="px-4 py-3 font-medium tabular">{h.ticker}</td>
      <td className="px-4 py-3">{h.action}</td>
      <td className="px-4 py-3"><NxBadge intent="neutral">{automationModeLabel[h.mode]}</NxBadge></td>
      <td className="px-4 py-3 text-right tabular">{h.amount}</td>
      <td className="px-4 py-3"><NxBadge intent={intents[h.status]}>{historyStatusLabel[h.status as keyof typeof historyStatusLabel]}</NxBadge></td>
      <td className="px-4 py-3 text-muted-foreground text-xs">{h.result}</td>
      <td className="px-4 py-3 text-xs text-muted-foreground">{h.linkedSnapshot}</td>
      <td className="px-4 py-3 text-right"><Button size="sm" variant="ghost"><ChevronRight className="h-4 w-4" /></Button></td>
    </tr>
  );
}

/* ============ Risk Tab ============ */

function RiskTab() {
  const [killOn, setKillOn] = useState(false);
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">리스크 통제</h3>
        <p className="text-sm text-muted-foreground mt-1">계좌·전략·시장 조건별 자동화 한도를 관리합니다.</p>
      </div>

      <Panel className={cn("p-5", killOn && "border-[color-mix(in_oklab,var(--bearish)_40%,var(--border))] bg-[color-mix(in_oklab,var(--bearish)_5%,transparent)]")}>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className={cn("h-12 w-12 rounded-2xl grid place-items-center",
            killOn ? "bg-[color-mix(in_oklab,var(--bearish)_16%,transparent)] text-[var(--bearish)]"
              : "bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] text-[var(--primary)]")}>
            <Zap className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold tracking-tight text-muted-foreground">GLOBAL KILL SWITCH</div>
            <div className="text-base font-semibold">전체 킬스위치</div>
            <p className="text-sm text-muted-foreground mt-1">
              모든 자동화를 즉시 중단하고 신규 주문 제안을 차단합니다.
            </p>
          </div>
          <Button
            variant={killOn ? "outline" : "default"}
            onClick={() => { setKillOn((v) => !v); toast(killOn ? "킬스위치 해제됨" : "킬스위치 활성화됨"); }}
            className={cn(killOn ? "" : "bg-[var(--bearish)] hover:bg-[var(--bearish)]/90 text-white")}
          >
            {killOn ? "검토 후 해제" : "킬스위치 활성화"}
          </Button>
        </div>
      </Panel>

      <Panel className="p-5">
        <PanelHeader eyebrow="GLOBAL LIMITS" title="전체 한도" className="!p-0" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <LimitField label="총 자동화 자본" value="30,000,000원" />
          <LimitField label="일일 손실 한도" value="1,000,000원" />
          <LimitField label="일일 주문 최대 금액" value="20,000,000원" />
          <LimitField label="일일 최대 주문 횟수" value="10회" />
          <LimitField label="1회 주문 최대 금액" value="5,000,000원" />
          <LimitField label="주문 간 대기 시간" value="10분" />
        </div>
      </Panel>

      <Panel className="p-5">
        <PanelHeader eyebrow="PER ACCOUNT" title="계좌별 한도" className="!p-0" />
        <div className="mt-4 space-y-2">
          {accounts.filter((a) => a.status === "connected").map((a) => (
            <div key={a.id} className="flex items-center justify-between p-3 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted grid place-items-center text-[10px] font-bold">{getBroker(a.brokerId).initials}</div>
                <div>
                  <div className="text-sm font-medium">{a.label}</div>
                  <div className="text-[11px] text-muted-foreground tabular">{a.masked} · {a.riskProfile}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <NxBadge intent="neutral">일일 500만원</NxBadge>
                <NxBadge intent="neutral">1회 100만원</NxBadge>
                <Button size="sm" variant="ghost"><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="p-5">
        <PanelHeader eyebrow="PER STRATEGY" title="전략별 한도" className="!p-0" />
        <div className="mt-4 space-y-2">
          {rules.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-3 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <Workflow className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="text-[11px] text-muted-foreground">{automationModeLabel[r.mode]}</div>
                </div>
              </div>
              <NxBadge intent="neutral">최대 3회/일</NxBadge>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="p-5">
        <PanelHeader eyebrow="BLOCKLISTS" title="차단 조건" className="!p-0" />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <BlockCard title="차단 종목" items={["레버리지 ETF (2x, 3x)", "인버스 ETF", "관리종목"]} />
          <BlockCard title="차단 테마" items={["의료 대마초", "블랭크체크 기업"]} />
          <BlockCard title="시장 조건" items={["시장 심리 · 공포 극단", "실적 시즌 24시간 전"]} />
        </div>
      </Panel>
    </div>
  );
}

function LimitField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <Input defaultValue={value} className="mt-1.5 h-9" />
    </div>
  );
}

function BlockCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="text-sm font-semibold mb-2">{title}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((i) => <NxBadge key={i} intent="neutral"><Ban className="h-3 w-3" />{i}</NxBadge>)}
      </div>
    </div>
  );
}

/* ============ Audit Tab ============ */

function AuditTab() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">감사 로그</h3>
        <p className="text-sm text-muted-foreground mt-1">
          계정 연결, 규칙 변경, 신호 생성, 승인, 주문 관련 이벤트를 모두 추적합니다.
        </p>
      </div>
      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase text-muted-foreground bg-muted/40">
                <th className="text-left px-4 py-3 font-medium">시간</th>
                <th className="text-left px-4 py-3 font-medium">주체</th>
                <th className="text-left px-4 py-3 font-medium">이벤트</th>
                <th className="text-left px-4 py-3 font-medium">계좌</th>
                <th className="text-left px-4 py-3 font-medium">규칙 / 신호</th>
                <th className="text-left px-4 py-3 font-medium">결과</th>
                <th className="text-left px-4 py-3 font-medium">기기 · IP</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((e) => <AuditRow key={e.id} e={e} />)}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function AuditRow({ e }: { e: AuditEvent }) {
  const intent = e.result === "success" ? "bullish" : e.result === "warning" ? "warn" : "bearish";
  return (
    <tr className="border-t border-border">
      <td className="px-4 py-3 text-muted-foreground tabular">{e.time}</td>
      <td className="px-4 py-3 text-xs">{e.actor}</td>
      <td className="px-4 py-3 font-mono text-[11px]">{e.type}</td>
      <td className="px-4 py-3 text-xs">{e.broker ? `${e.broker} · ${e.account}` : "—"}</td>
      <td className="px-4 py-3 text-xs text-muted-foreground">{e.rule ?? e.signal ?? "—"}</td>
      <td className="px-4 py-3"><NxBadge intent={intent}>{e.result}</NxBadge></td>
      <td className="px-4 py-3 text-xs text-muted-foreground">{e.device}</td>
      <td className="px-4 py-3 text-right"><Button size="sm" variant="ghost">상세<ArrowRight className="h-3.5 w-3.5" /></Button></td>
    </tr>
  );
}
