export type SnapshotStatus =
  | "valid"
  | "watch"
  | "near-target"
  | "add-buy"
  | "near-invalidation"
  | "invalidated"
  | "closed";

export type SnapshotType = "ai" | "personal";

export type StrategyAction =
  | "전량 보유"
  | "일부 매도 대기"
  | "추가 매수 대기"
  | "전량 매도 대기"
  | "관망";

export type Snapshot = {
  id: string;
  title: string;
  company: string;
  ticker: string;
  market: "KR" | "US" | "ETF";
  currency: "KRW" | "USD";
  type: SnapshotType;
  status: SnapshotStatus;
  savedAt: string; // ISO date
  savedPrice: number;
  currentPrice: number;
  avgCost?: number;
  quantity?: number;
  targetPrice: number;
  trimPrice?: number;
  addBuyPrice?: number;
  stopLoss?: number;
  invalidationPrice: number;
  signalAtSnapshot: "Green" | "Yellow" | "Orange" | "Red";
  currentSignal: "Green" | "Yellow" | "Orange" | "Red";
  marketMood: string;
  strategyAction: StrategyAction;
  timeHorizon: string;
  thesis: string[];
  risks: string[];
  watchConditions: { label: string; met: boolean }[];
  memo?: string;
  reasonPreview: string;
  entryZone?: string;
  addZoneLabel?: string;
  trimZoneLabel?: string;
};

export function formatSnapPrice(p: number, c: "KRW" | "USD") {
  if (c === "KRW") return `₩${p.toLocaleString("ko-KR")}`;
  return `$${p.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export const snapshots: Snapshot[] = [
  {
    id: "snap-001",
    title: "SK하이닉스 HBM 사이클 — 실적 발표 전 점검",
    company: "SK하이닉스",
    ticker: "000660",
    market: "KR",
    currency: "KRW",
    type: "personal",
    status: "near-target",
    savedAt: "2026-06-14",
    savedPrice: 2_555_000,
    currentPrice: 2_720_000,
    avgCost: 2_410_000,
    quantity: 26,
    targetPrice: 3_100_000,
    trimPrice: 2_900_000,
    addBuyPrice: 2_380_000,
    stopLoss: 2_280_000,
    invalidationPrice: 2_250_000,
    signalAtSnapshot: "Green",
    currentSignal: "Yellow",
    marketMood: "위험 선호 · 반도체 주도",
    strategyAction: "일부 매도 대기",
    timeHorizon: "3개월",
    thesis: [
      "HBM 수요는 구조적으로 유효",
      "AI 반도체 사이클 아직 유효",
      "실적 컨센서스 상향이 상승 동력",
      "전고점 부근에서는 차익실현 리스크 상승",
    ],
    risks: [
      "메모리 가격 조정 리스크",
      "NVIDIA 밸류체인 집중도",
      "원/달러 환율 변동성",
      "역사적 고점 부근 차익실현",
    ],
    watchConditions: [
      { label: "현재가가 무효화 레벨 위 유지", met: true },
      { label: "시그널이 오렌지/레드로 악화되지 않음", met: false },
      { label: "HBM 관련 뉴스 흐름 우호적", met: true },
      { label: "거래량에서 분산 패턴 미출현", met: true },
      { label: "목표 구간 접근 시 시장 폭 강함", met: true },
    ],
    memo:
      "이사 자금 필요 시점 이전에 가능한 한 고점에서 부분 매도. 원래 트림 구간 도달 시 감정적 FOMO 자제.",
    reasonPreview:
      "HBM 수요는 구조적으로 유효하지만, 전고점 부근에서는 밸류에이션 부담과 차익실현 리스크를 점검해야 합니다.",
    entryZone: "₩2,450,000–₩2,555,000",
    addZoneLabel: "₩2,380,000 이하",
    trimZoneLabel: "₩2,850,000–₩2,950,000",
  },
  {
    id: "snap-002",
    title: "NVIDIA — AI 사이클 유지, 눌림 매수 관점",
    company: "NVIDIA",
    ticker: "NVDA",
    market: "US",
    currency: "USD",
    type: "ai",
    status: "valid",
    savedAt: "2026-06-20",
    savedPrice: 148.7,
    currentPrice: 156.2,
    targetPrice: 184.0,
    trimPrice: 175.0,
    addBuyPrice: 142.0,
    invalidationPrice: 138.0,
    signalAtSnapshot: "Green",
    currentSignal: "Green",
    marketMood: "위험 선호 · 성장주 강세",
    strategyAction: "관망",
    timeHorizon: "6개월+",
    thesis: [
      "데이터센터 수요 견조",
      "Blackwell 사이클 초기 국면",
      "가격 결정력 유지",
      "GPU 재고 순환 안정",
    ],
    risks: [
      "밸류에이션 부담",
      "빅테크 CAPEX 하향 조정 리스크",
      "환율/무역 정책",
    ],
    watchConditions: [
      { label: "$142 방어선 유지", met: true },
      { label: "SOX 지수 상대 강세 유지", met: true },
      { label: "실적 컨센서스 상향 흐름 지속", met: true },
    ],
    memo: "",
    reasonPreview:
      "AI 사이클 초기 국면으로 판단됩니다. 눌림 매수 관점을 유지하되 밸류에이션 부담은 지속 점검합니다.",
    entryZone: "$148–$152",
    addZoneLabel: "$142 이하",
    trimZoneLabel: "$172–$184",
  },
  {
    id: "snap-003",
    title: "QLD — 레버리지 ETF 변동성 점검",
    company: "ProShares Ultra QQQ",
    ticker: "QLD",
    market: "ETF",
    currency: "USD",
    type: "personal",
    status: "watch",
    savedAt: "2026-05-28",
    savedPrice: 112.4,
    currentPrice: 118.3,
    avgCost: 102.6,
    quantity: 117,
    targetPrice: 128.0,
    trimPrice: 124.0,
    addBuyPrice: 108.0,
    stopLoss: 104.0,
    invalidationPrice: 106.0,
    signalAtSnapshot: "Yellow",
    currentSignal: "Yellow",
    marketMood: "혼조",
    strategyAction: "일부 매도 대기",
    timeHorizon: "1개월",
    thesis: [
      "나스닥 강세 지속 시 레버리지 효과 극대화",
      "단기 스윙 관점",
    ],
    risks: [
      "레버리지 감쇠 (decay)",
      "변동성 확대 국면 손실 확대",
    ],
    watchConditions: [
      { label: "VIX 20 이하 유지", met: false },
      { label: "QQQ 20일선 위 유지", met: true },
    ],
    memo: "레버리지 비중은 총 자산 대비 10% 이내로 제한.",
    reasonPreview:
      "레버리지 특성상 단기 스윙 관점. 변동성 확대 시 즉시 비중 축소가 필요합니다.",
    entryZone: "$110–$115",
    addZoneLabel: "$108 이하",
    trimZoneLabel: "$124–$128",
  },
  {
    id: "snap-004",
    title: "SPY — 코어 자산 장기 보유",
    company: "SPDR S&P 500",
    ticker: "SPY",
    market: "ETF",
    currency: "USD",
    type: "personal",
    status: "valid",
    savedAt: "2026-04-10",
    savedPrice: 528.4,
    currentPrice: 542.8,
    avgCost: 478.2,
    quantity: 18,
    targetPrice: 580.0,
    trimPrice: 570.0,
    addBuyPrice: 508.0,
    invalidationPrice: 496.0,
    signalAtSnapshot: "Green",
    currentSignal: "Green",
    marketMood: "안정적 상승",
    strategyAction: "전량 보유",
    timeHorizon: "6개월+",
    thesis: [
      "코어 자산 장기 보유 전략",
      "미국 대형주 이익 안정성",
    ],
    risks: [
      "경기침체 진입 리스크",
      "금리 재상승",
    ],
    watchConditions: [
      { label: "200일선 위 유지", met: true },
      { label: "장기 이익 추정치 상향", met: true },
    ],
    memo: "코어 자산. 이벤트 헤드라인에 흔들리지 말 것.",
    reasonPreview:
      "코어 자산으로 장기 보유 관점을 유지합니다. 단기 노이즈에 흔들리지 않는 원칙이 중요합니다.",
    entryZone: "$515–$530",
    addZoneLabel: "$508 이하",
    trimZoneLabel: "$570–$580",
  },
  {
    id: "snap-005",
    title: "삼성전자 — HBM3E 진입 시나리오",
    company: "삼성전자",
    ticker: "005930",
    market: "KR",
    currency: "KRW",
    type: "ai",
    status: "add-buy",
    savedAt: "2026-06-02",
    savedPrice: 74_500,
    currentPrice: 69_800,
    targetPrice: 92_000,
    trimPrice: 88_000,
    addBuyPrice: 70_000,
    invalidationPrice: 64_000,
    signalAtSnapshot: "Yellow",
    currentSignal: "Yellow",
    marketMood: "관망",
    strategyAction: "추가 매수 대기",
    timeHorizon: "3개월",
    thesis: [
      "HBM3E 고객사 인증 진행",
      "파운드리 회복 시나리오",
      "저평가 매력 구간",
    ],
    risks: [
      "HBM 인증 지연",
      "메모리 가격 반등 지연",
    ],
    watchConditions: [
      { label: "₩64,000 지지", met: true },
      { label: "외국인 순매수 전환", met: false },
    ],
    memo: "",
    reasonPreview:
      "저평가 구간 진입에 근접했습니다. 다만 원래 논리가 유효한지 재확인이 필요합니다.",
    entryZone: "₩72,000–₩76,000",
    addZoneLabel: "₩70,000 이하",
    trimZoneLabel: "₩88,000–₩92,000",
  },
  {
    id: "snap-006",
    title: "TSMC — 익절 완료 후 종료",
    company: "TSMC",
    ticker: "TSM",
    market: "US",
    currency: "USD",
    type: "personal",
    status: "closed",
    savedAt: "2026-03-15",
    savedPrice: 158.2,
    currentPrice: 186.4,
    avgCost: 142.0,
    quantity: 40,
    targetPrice: 185.0,
    trimPrice: 180.0,
    addBuyPrice: 148.0,
    invalidationPrice: 138.0,
    signalAtSnapshot: "Green",
    currentSignal: "Green",
    marketMood: "강세",
    strategyAction: "전량 매도 대기",
    timeHorizon: "3개월",
    thesis: ["파운드리 독점적 지위", "AI GPU 위탁 생산 수혜"],
    risks: ["지정학 리스크", "고평가 부담"],
    watchConditions: [
      { label: "$180 도달 시 익절", met: true },
    ],
    memo: "목표 도달 후 전량 매도. 원 전략대로 실행 완료.",
    reasonPreview: "목표가에 도달하여 전량 매도 완료. 원 전략대로 실행되었습니다.",
    entryZone: "$150–$160",
    addZoneLabel: "$148 이하",
    trimZoneLabel: "$180–$185",
  },
];

export const statusLabelMap: Record<SnapshotStatus, { label: string; korean: string }> = {
  valid: { label: "Valid", korean: "유효" },
  watch: { label: "Needs Review", korean: "관찰 필요" },
  "near-target": { label: "Near Target", korean: "목표가 근접" },
  "add-buy": { label: "Add-buy Zone", korean: "추가매수 구간" },
  "near-invalidation": { label: "Near Invalidation", korean: "무효화 근접" },
  invalidated: { label: "Invalidated", korean: "무효화" },
  closed: { label: "Closed", korean: "종료" },
};

export const systemInterpretationMap: Record<SnapshotStatus, string> = {
  valid:
    "원 전략은 아직 대체로 유효해 보입니다. 현재가는 무효화 레벨 위에 있으며 목표 구간에는 아직 도달하지 않았습니다. 시그널 품질과 시장 폭을 계속 관찰하세요.",
  watch:
    "일부 조건이 흔들리고 있습니다. 원 전략의 근거가 여전히 유효한지 재점검이 필요한 구간입니다.",
  "near-target":
    "현재가가 저장된 트림 또는 목표 구간에 근접하고 있습니다. 새로운 감정적 판단보다 부분 익절을 검토하기에 합리적인 위치입니다.",
  "add-buy":
    "현재가가 저장된 추가매수 구간에 진입했습니다. 다만 원래 논리가 여전히 유효한지 확인한 뒤 비중을 추가하세요.",
  "near-invalidation":
    "현재가가 저장된 무효화 레벨에 근접했습니다. 조정이 여전히 건강한지 재점검이 필요합니다.",
  invalidated:
    "현재가가 저장된 무효화 레벨을 이탈했습니다. 새로운 근거 없이 원 전략을 유효하다고 간주해서는 안 됩니다.",
  closed:
    "이 스냅샷은 종료 처리되었습니다. 실행 결과와 다음 전략을 위한 회고 기록으로 참고하세요.",
};