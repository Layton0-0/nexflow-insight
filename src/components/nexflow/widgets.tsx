import { cn } from "@/lib/utils";
import { Panel, Badge } from "./primitives";
import type { Stock } from "@/lib/mock-data";

export function ScenarioBar({
  bullish,
  neutral,
  bearish,
  className,
  showLabels = true,
}: {
  bullish: number;
  neutral: number;
  bearish: number;
  className?: string;
  showLabels?: boolean;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabels && (
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>강세 {bullish}%</span>
          <span>중립 {neutral}%</span>
          <span>약세 {bearish}%</span>
        </div>
      )}
      <div className="flex h-2 rounded-full overflow-hidden bg-muted/40">
        <div
          className="bg-[var(--bullish)]"
          style={{ width: `${bullish}%`, boxShadow: "0 0 8px var(--bullish)" }}
        />
        <div className="bg-[var(--neutral-accent)]" style={{ width: `${neutral}%` }} />
        <div className="bg-[var(--bearish)]" style={{ width: `${bearish}%` }} />
      </div>
    </div>
  );
}

export function ScoreRing({
  score,
  size = 96,
  label,
}: {
  score: number;
  size?: number;
  label?: string;
}) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);
  const color =
    score >= 75 ? "var(--bullish)" : score >= 55 ? "var(--cyan-accent)" : "var(--neutral-accent)";
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="oklch(0.3 0.03 265 / 0.4)"
          strokeWidth={6}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={6}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-2xl font-bold tabular-nums" style={{ color }}>
            {score}
          </div>
          {label && <div className="text-[9px] text-muted-foreground -mt-0.5">{label}</div>}
        </div>
      </div>
    </div>
  );
}

export function ScoreBar({
  label,
  value,
  inverted,
}: {
  label: string;
  value: number;
  inverted?: boolean;
}) {
  const color = inverted
    ? value > 60
      ? "var(--bearish)"
      : value > 40
        ? "var(--neutral-accent)"
        : "var(--bullish)"
    : value >= 75
      ? "var(--bullish)"
      : value >= 55
        ? "var(--cyan-accent)"
        : "var(--neutral-accent)";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums" style={{ color }}>
          {value}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, background: color, boxShadow: `0 0 8px ${color}` }}
        />
      </div>
    </div>
  );
}

export function PriceZoneTrack({ stock }: { stock: Stock }) {
  // Visual: stop | buy | current | target | overheat
  return (
    <div className="space-y-2">
      <div className="relative h-2 rounded-full bg-muted/40 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-[14%] bg-[var(--bearish)]/60" />
        <div className="absolute inset-y-0 left-[14%] w-[24%] bg-[var(--cyan-accent)]/50" />
        <div className="absolute inset-y-0 left-[60%] w-[24%] bg-[var(--bullish)]/50" />
        <div className="absolute inset-y-0 left-[84%] w-[16%] bg-[var(--neutral-accent)]/60" />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-[var(--cyan-accent)] ring-2 ring-[var(--cyan-accent)]/30 shadow-[0_0_12px_var(--cyan-accent)]"
          style={{ left: "calc(50% - 7px)" }}
        />
      </div>
      <div className="flex justify-between text-[9px] text-muted-foreground tabular-nums">
        <span>손절</span>
        <span>매수</span>
        <span className="text-[var(--cyan-accent)]">현재</span>
        <span>목표</span>
        <span>과열</span>
      </div>
    </div>
  );
}

export function NexflowScoreCard({
  score,
  decision,
  confidence,
  note,
}: {
  score: number;
  decision: string;
  confidence: "높음" | "중간" | "낮음";
  note: string;
}) {
  return (
    <Panel className="p-5">
      <div className="flex items-start gap-4">
        <ScoreRing score={score} label="SCORE" />
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--cyan-accent)] font-semibold">
            NEXFLOW SCORE
          </div>
          <div className="text-lg font-semibold mt-1">{decision}</div>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge intent="info">신뢰도 {confidence}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{note}</p>
        </div>
      </div>
    </Panel>
  );
}

export function EvidenceCard({
  positive,
  negative,
}: {
  positive: string[];
  negative: string[];
}) {
  return (
    <Panel className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <div className="text-xs font-semibold text-[var(--bullish)] mb-3 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--bullish)] shadow-[0_0_6px_var(--bullish)]" />
            긍정 근거
          </div>
          <ul className="space-y-2">
            {positive.map((p) => (
              <li key={p} className="text-sm text-foreground/90 flex gap-2">
                <span className="text-[var(--bullish)] mt-1">+</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold text-[var(--bearish)] mb-3 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--bearish)] shadow-[0_0_6px_var(--bearish)]" />
            부정 근거
          </div>
          <ul className="space-y-2">
            {negative.map((n) => (
              <li key={n} className="text-sm text-foreground/90 flex gap-2">
                <span className="text-[var(--bearish)] mt-1">−</span>
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Panel>
  );
}