import { type ReactNode, useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Panel, Badge, Delta } from "@/components/nexflow/primitives";
import {
  type Snapshot,
  type SnapshotStatus,
  formatSnapPrice,
  statusLabelMap,
} from "@/lib/mock-snapshots";
import { BookmarkCheck, X, Calendar, ArrowRight, Sparkles, User } from "lucide-react";

const statusIntentMap: Record<
  SnapshotStatus,
  "bullish" | "bearish" | "info" | "warn" | "neutral"
> = {
  valid: "info",
  watch: "warn",
  "near-target": "bullish",
  "add-buy": "info",
  "near-invalidation": "warn",
  invalidated: "bearish",
  closed: "neutral",
};

export function StatusBadge({ status }: { status: SnapshotStatus }) {
  const info = statusLabelMap[status];
  return (
    <Badge intent={statusIntentMap[status]}>
      <span>{info.korean}</span>
      <span className="opacity-60 ml-1">· {info.label}</span>
    </Badge>
  );
}

export function TypeBadge({ type }: { type: "ai" | "personal" }) {
  return type === "ai" ? (
    <Badge intent="info">
      <Sparkles className="h-2.5 w-2.5" /> 추천 전략
    </Badge>
  ) : (
    <Badge intent="neutral">
      <User className="h-2.5 w-2.5" /> 내 투자
    </Badge>
  );
}

function signalDot(sig: "Green" | "Yellow" | "Orange" | "Red") {
  const map = {
    Green: "var(--bullish)",
    Yellow: "var(--neutral-accent)",
    Orange: "var(--neutral-accent)",
    Red: "var(--bearish)",
  } as const;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span className="h-2 w-2 rounded-full" style={{ background: map[sig] }} />
      <span className="tabular-nums">{sig}</span>
    </span>
  );
}

export function PriceDistanceBar({ s }: { s: Snapshot }) {
  const points = [
    { key: "inv", label: "무효화", value: s.invalidationPrice, color: "var(--bearish)" },
    s.addBuyPrice
      ? { key: "add", label: "추가매수", value: s.addBuyPrice, color: "var(--primary)" }
      : null,
    { key: "saved", label: "저장", value: s.savedPrice, color: "var(--muted-foreground)" },
    { key: "now", label: "현재", value: s.currentPrice, color: "var(--foreground)" },
    s.trimPrice
      ? { key: "trim", label: "트림", value: s.trimPrice, color: "var(--neutral-accent)" }
      : null,
    { key: "tgt", label: "목표", value: s.targetPrice, color: "var(--bullish)" },
  ].filter(Boolean) as { key: string; label: string; value: number; color: string }[];

  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  return (
    <div className="pt-4 pb-8">
      <div className="relative h-2 rounded-full bg-muted">
        <div
          className="absolute inset-y-0 rounded-full bg-gradient-to-r from-[var(--bearish)]/40 via-primary/40 to-[var(--bullish)]/60"
        />
        {points.map((p) => {
          const pct = ((p.value - min) / range) * 100;
          const emphasize = p.key === "saved" || p.key === "now";
          return (
            <div
              key={p.key}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pct}%` }}
            >
              <div
                className={cn(
                  "rounded-full border-2 border-background",
                  emphasize ? "h-3.5 w-3.5" : "h-2.5 w-2.5",
                )}
                style={{ background: p.color }}
              />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] leading-tight text-center">
                <div
                  className={cn(
                    "font-medium",
                    emphasize ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {p.label}
                </div>
                <div className="tabular-nums text-muted-foreground">
                  {formatSnapPrice(p.value, s.currency)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SnapshotCard({ s }: { s: Snapshot }) {
  const change = ((s.currentPrice - s.savedPrice) / s.savedPrice) * 100;
  return (
    <Panel className="p-5 flex flex-col gap-4 hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-base font-semibold truncate">{s.company}</div>
            <span className="text-xs text-muted-foreground tabular-nums">{s.ticker}</span>
            <Badge intent="neutral">{s.market}</Badge>
          </div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <TypeBadge type={s.type} />
            <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {s.savedAt}
            </span>
          </div>
        </div>
        <StatusBadge status={s.status} />
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div>
          <div className="text-[10px] text-muted-foreground">저장 시점</div>
          <div className="text-sm font-semibold tabular-nums mt-0.5">
            {formatSnapPrice(s.savedPrice, s.currency)}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground">현재가</div>
          <div className="text-sm font-semibold tabular-nums mt-0.5">
            {formatSnapPrice(s.currentPrice, s.currency)}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground">변동</div>
          <div className="text-sm font-semibold mt-0.5">
            <Delta value={change} />
          </div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground">현재 시그널</div>
          <div className="mt-0.5">{signalDot(s.currentSignal)}</div>
        </div>
      </div>

      <div className="rounded-xl bg-muted/40 border border-border/60 p-3 grid grid-cols-2 md:grid-cols-5 gap-3 text-[11px]">
        <ZoneCell label="진입" value={s.entryZone} />
        <ZoneCell label="추가매수" value={s.addZoneLabel} />
        <ZoneCell label="트림" value={s.trimZoneLabel} />
        <ZoneCell
          label="목표"
          value={formatSnapPrice(s.targetPrice, s.currency)}
          accent="var(--bullish)"
        />
        <ZoneCell
          label="무효화"
          value={formatSnapPrice(s.invalidationPrice, s.currency)}
          accent="var(--bearish)"
        />
      </div>

      <div>
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          Reason
        </div>
        <p className="text-xs text-foreground/90 leading-relaxed line-clamp-2">
          {s.reasonPreview}
        </p>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Button asChild size="sm" className="flex-1">
          <Link to="/snapshots/$snapshotId" params={{ snapshotId: s.id }}>
            상세 보기
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => toast.success("현재 데이터로 비교를 갱신했어요.")}
        >
          현재와 비교
        </Button>
        <CloseSnapshotDialog
          trigger={
            <Button size="sm" variant="ghost" className="text-muted-foreground">
              <X className="h-3.5 w-3.5" />
              종료
            </Button>
          }
        />
      </div>
    </Panel>
  );
}

function ZoneCell({
  label,
  value,
  accent,
}: {
  label: string;
  value?: string;
  accent?: string;
}) {
  return (
    <div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div
        className="text-[11.5px] font-medium tabular-nums mt-0.5"
        style={accent ? { color: accent } : undefined}
      >
        {value ?? <span className="text-muted-foreground/70">미설정</span>}
      </div>
    </div>
  );
}

/* -------------------- Dialogs -------------------- */

export function SaveAiSnapshotDialog({
  trigger,
  defaultCompany = "SK하이닉스",
  defaultTicker = "000660",
  defaultPrice = "₩2,850,000",
}: {
  trigger: ReactNode;
  defaultCompany?: string;
  defaultTicker?: string;
  defaultPrice?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>추천 전략 스냅샷 저장</DialogTitle>
          <DialogDescription>
            현재 AI 분석의 매수·매도 구간과 판단 근거를 스냅샷으로 남깁니다. 이후 현재 데이터와 비교할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="rounded-xl border border-border bg-muted/40 p-3 grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
            <ReadOnlyRow label="종목" value={`${defaultCompany} · ${defaultTicker}`} />
            <ReadOnlyRow label="현재가" value={defaultPrice} />
            <ReadOnlyRow label="시그널" value="Yellow" />
            <ReadOnlyRow label="투자 기간" value="1개월" />
            <ReadOnlyRow label="진입 구간" value="₩2,700,000–₩2,780,000" />
            <ReadOnlyRow label="추가매수" value="₩2,620,000 이하" />
            <ReadOnlyRow label="트림" value="₩2,900,000–₩2,950,000" />
            <ReadOnlyRow label="무효화" value="₩2,620,000 이탈" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="snap-title">스냅샷 제목</Label>
            <Input
              id="snap-title"
              placeholder="예: SK하이닉스 HBM 사이클 — 실적 발표 전 점검"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="snap-note">개인 메모</Label>
            <Textarea
              id="snap-note"
              rows={3}
              placeholder="이 전략을 저장하는 이유를 남겨보세요..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="snap-watch">유지 조건 (Watch Conditions)</Label>
            <Textarea
              id="snap-watch"
              rows={3}
              placeholder="이 전략이 유효하려면 어떤 조건이 유지되어야 하나요?"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              toast.success("추천 전략 스냅샷을 저장했어요.");
            }}
          >
            <BookmarkCheck className="h-4 w-4" />
            스냅샷 저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums text-right">{value}</span>
    </div>
  );
}

export function SavePersonalSnapshotDialog({
  trigger,
  preset,
}: {
  trigger: ReactNode;
  preset?: {
    company: string;
    ticker: string;
    market: string;
    quantity?: number;
    avgCost?: string;
    price?: string;
  };
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>내 투자 스냅샷 저장</DialogTitle>
          <DialogDescription>
            현재 보유 상태와 내가 세운 목표·판단 근거를 저장합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <Section title="종목">
            <div className="grid grid-cols-2 gap-3">
              <Field label="종목명" defaultValue={preset?.company ?? ""} placeholder="SK하이닉스" />
              <Field label="티커" defaultValue={preset?.ticker ?? ""} placeholder="000660" />
              <SelectField label="시장" placeholder="KR" options={["KR", "US", "ETF"]} />
            </div>
          </Section>

          <Section title="포지션">
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="수량"
                defaultValue={preset?.quantity?.toString() ?? ""}
                placeholder="26"
              />
              <Field
                label="평단"
                defaultValue={preset?.avgCost ?? ""}
                placeholder="₩2,410,000"
              />
              <Field
                label="현재가"
                defaultValue={preset?.price ?? ""}
                placeholder="₩2,720,000"
              />
              <Field label="평가금액" placeholder="자동 계산" />
            </div>
          </Section>

          <Section title="전략">
            <div className="grid grid-cols-2 gap-3">
              <SelectField
                label="전략 액션"
                placeholder="선택"
                options={[
                  "전량 보유",
                  "일부 매도 대기",
                  "추가 매수 대기",
                  "전량 매도 대기",
                  "관망",
                ]}
              />
              <SelectField
                label="투자 기간"
                placeholder="선택"
                options={["오늘", "1주", "1개월", "3개월", "6개월+", "다음 실적까지", "특정 이벤트까지"]}
              />
            </div>
          </Section>

          <Section title="가격 레벨">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Field label="목표가" placeholder="₩3,100,000" />
              <Field label="트림가" placeholder="₩2,900,000" />
              <Field label="추가매수가" placeholder="₩2,380,000" />
              <Field label="손절가" placeholder="₩2,280,000" />
              <Field label="무효화 레벨" placeholder="₩2,250,000" />
            </div>
          </Section>

          <Section title="근거">
            <div className="grid gap-3">
              <TextareaField
                label="투자 논리 (Thesis)"
                placeholder="이 종목을 보유하거나 진입하려는 근거는 무엇인가요?"
              />
              <TextareaField
                label="핵심 리스크"
                placeholder="이 전략을 무효화할 수 있는 요인은 무엇인가요?"
              />
              <TextareaField
                label="유지 조건"
                placeholder="앞으로 어떤 지표를 관찰해야 하나요?"
              />
              <TextareaField
                label="개인 메모"
                placeholder="감정적 판단 자제, FOMO 경고, 현금 흐름 필요성 등을 남겨보세요."
              />
            </div>
          </Section>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              toast.success("내 투자 스냅샷을 저장했어요.");
            }}
          >
            <BookmarkCheck className="h-4 w-4" />
            스냅샷 저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-2">
        {title}
      </div>
      {children}
    </div>
  );
}
function Field({
  label,
  placeholder,
  defaultValue,
}: {
  label: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs">{label}</Label>
      <Input placeholder={placeholder} defaultValue={defaultValue} />
    </div>
  );
}
function TextareaField({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs">{label}</Label>
      <Textarea rows={2} placeholder={placeholder} />
    </div>
  );
}
function SelectField({
  label,
  placeholder,
  options,
}: {
  label: string;
  placeholder?: string;
  options: string[];
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs">{label}</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function CloseSnapshotDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>스냅샷 종료 처리</DialogTitle>
          <DialogDescription>
            이미 매도했거나 더 이상 이 전략을 추적하지 않는다면 종료 처리할 수 있습니다. 기록은 삭제되지 않고 보관됩니다.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <SelectField
            label="종료 사유"
            placeholder="선택"
            options={[
              "목표 도달",
              "일부 트림 완료",
              "전량 매도 완료",
              "손절 / 무효화",
              "판단 근거 변경",
              "포트폴리오 정리",
              "기타",
            ]}
          />
          <TextareaField label="메모" placeholder="스냅샷을 종료하는 이유를 남겨보세요." />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setOpen(false);
              toast.success("스냅샷을 종료 처리했어요.");
            }}
          >
            종료 처리
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}