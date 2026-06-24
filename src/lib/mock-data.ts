export type Decision =
  | "보유 우위"
  | "눌림 매수"
  | "보유"
  | "조건부 매수"
  | "관심"
  | "비중축소"
  | "일부 익절";

export type Stock = {
  name: string;
  ticker: string;
  market: "KR" | "US" | "ETF";
  price: number;
  currency: "KRW" | "USD";
  changePercent: number;
  score: number;
  upside: number;
  risk: "낮음" | "중간" | "높음";
  decision: Decision;
  action: string;
  newBuyerAction: string;
  holderAction: string;
  profitAction: string;
  bullishProbability: number;
  neutralProbability: number;
  bearishProbability: number;
  buyZone: string;
  targetZone: string;
  invalidationZone: string;
};

export const stocks: Stock[] = [
  {
    name: "SK하이닉스",
    ticker: "000660",
    market: "KR",
    price: 2_850_000,
    currency: "KRW",
    changePercent: 2.15,
    score: 82,
    upside: 14,
    risk: "중간",
    decision: "보유 우위",
    action: "일부 익절 대기",
    newBuyerAction: "눌림 대기",
    holderAction: "유지",
    profitAction: "일부 익절",
    bullishProbability: 42,
    neutralProbability: 38,
    bearishProbability: 20,
    buyZone: "2,700,000~2,780,000원",
    targetZone: "3,050,000~3,200,000원",
    invalidationZone: "2,620,000원 이탈",
  },
  {
    name: "NVIDIA",
    ticker: "NVDA",
    market: "US",
    price: 156.2,
    currency: "USD",
    changePercent: 1.35,
    score: 78,
    upside: 11,
    risk: "중간",
    decision: "눌림 매수",
    action: "1차 매수 대기",
    newBuyerAction: "눌림 매수",
    holderAction: "유지",
    profitAction: "추세 관찰",
    bullishProbability: 48,
    neutralProbability: 34,
    bearishProbability: 18,
    buyZone: "$148~$152",
    targetZone: "$172~$184",
    invalidationZone: "$142 이탈",
  },
  {
    name: "TSMC",
    ticker: "TSM",
    market: "US",
    price: 186.4,
    currency: "USD",
    changePercent: 0.62,
    score: 74,
    upside: 9,
    risk: "낮음",
    decision: "보유",
    action: "유지",
    newBuyerAction: "분할 매수",
    holderAction: "유지",
    profitAction: "추세 유지",
    bullishProbability: 44,
    neutralProbability: 42,
    bearishProbability: 14,
    buyZone: "$178~$182",
    targetZone: "$202~$210",
    invalidationZone: "$172 이탈",
  },
  {
    name: "ProShares Ultra QQQ",
    ticker: "QLD",
    market: "ETF",
    price: 118.3,
    currency: "USD",
    changePercent: -0.82,
    score: 69,
    upside: 13,
    risk: "높음",
    decision: "조건부 매수",
    action: "변동성 주의",
    newBuyerAction: "분할 진입",
    holderAction: "비중 관리",
    profitAction: "고점 시 부분 익절",
    bullishProbability: 40,
    neutralProbability: 34,
    bearishProbability: 26,
    buyZone: "$112~$115",
    targetZone: "$128~$134",
    invalidationZone: "$108 이탈",
  },
  {
    name: "Vistra Corp",
    ticker: "VST",
    market: "US",
    price: 198.5,
    currency: "USD",
    changePercent: 1.08,
    score: 71,
    upside: 10,
    risk: "중간",
    decision: "관심",
    action: "조정 시 접근",
    newBuyerAction: "조정 대기",
    holderAction: "유지",
    profitAction: "이벤트 전 관망",
    bullishProbability: 41,
    neutralProbability: 39,
    bearishProbability: 20,
    buyZone: "$184~$190",
    targetZone: "$214~$222",
    invalidationZone: "$178 이탈",
  },
];

export const marketIndices = [
  { name: "코스피", value: "2,724.18", change: 0.82 },
  { name: "나스닥 선물", value: "20,418.50", change: -0.15 },
  { name: "필라델피아 반도체", value: "5,832.10", change: 1.34 },
  { name: "원/달러", value: "1,382.5", change: 0.31 },
];

export const portfolioHoldings = [
  {
    name: "SK하이닉스",
    ticker: "000660",
    shares: 26,
    avgPrice: 2_410_000,
    price: 2_850_000,
    currency: "KRW" as const,
    decision: "보유 우위",
    action: "일부 익절 대기",
    targetZone: "3,050,000원",
    defenseZone: "2,620,000원",
  },
  {
    name: "NVIDIA",
    ticker: "NVDA",
    shares: 2,
    avgPrice: 132.5,
    price: 156.2,
    currency: "USD" as const,
    decision: "눌림 매수",
    action: "추가매수 대기",
    targetZone: "$184",
    defenseZone: "$142",
  },
  {
    name: "ProShares Ultra QQQ",
    ticker: "QLD",
    shares: 117,
    avgPrice: 102.6,
    price: 118.3,
    currency: "USD" as const,
    decision: "비중축소",
    action: "고점 분할 매도",
    targetZone: "$128",
    defenseZone: "$108",
  },
  {
    name: "SPDR S&P 500",
    ticker: "SPY",
    shares: 18,
    avgPrice: 478.2,
    price: 542.8,
    currency: "USD" as const,
    decision: "보유",
    action: "유지",
    targetZone: "$580",
    defenseZone: "$508",
  },
  {
    name: "SPDR Portfolio S&P 500",
    ticker: "SPYM",
    shares: 58,
    avgPrice: 58.4,
    price: 64.9,
    currency: "USD" as const,
    decision: "보유",
    action: "유지",
    targetZone: "$70",
    defenseZone: "$60",
  },
];

export const portfolioCashKRW = 10_000_000;

export const exposureBreakdown = [
  { name: "AI 반도체", value: 48, color: "var(--cyan-accent)" },
  { name: "미국 성장주", value: 31, color: "var(--violet-accent)" },
  { name: "현금", value: 12, color: "var(--neutral-accent)" },
  { name: "기타", value: 9, color: "var(--muted-foreground)" },
];

export const priceSeries = Array.from({ length: 90 }).map((_, i) => {
  const base = 2_500_000;
  const drift = i * 4500;
  const wave = Math.sin(i / 6) * 80_000 + Math.cos(i / 11) * 50_000;
  const noise = (Math.sin(i * 1.7) + Math.cos(i * 2.3)) * 25_000;
  return {
    day: i + 1,
    price: Math.round(base + drift + wave + noise),
  };
});

export const sectorPulse = Array.from({ length: 30 }).map((_, i) => ({
  day: i + 1,
  sox: 100 + Math.sin(i / 4) * 6 + i * 0.4,
  usdkrw: 1370 + Math.sin(i / 3) * 8 + Math.cos(i / 5) * 4,
  us10y: 4.2 + Math.sin(i / 6) * 0.15,
  vix: 14 + Math.cos(i / 4) * 2.5 + Math.sin(i / 9) * 1.2,
}));

export const scoreBreakdown = [
  { label: "실적", value: 88 },
  { label: "수급", value: 76 },
  { label: "모멘텀", value: 84 },
  { label: "밸류에이션", value: 68 },
  { label: "이벤트", value: 73 },
  { label: "리스크", value: 45, inverted: true },
];

export const newsEvents: { date: string; title: string; category: string; impact: "긍정" | "중립" | "부정"; score: number }[] = [
  { date: "06.26", title: "NVIDIA 실적 발표", category: "실적", impact: "긍정", score: 8 },
  { date: "06.27", title: "Micron 가이던스", category: "실적", impact: "중립", score: 5 },
  { date: "07.24", title: "SK하이닉스 실적 발표", category: "실적", impact: "긍정", score: 9 },
  { date: "06.25", title: "DART 공시 — 자기주식 처분", category: "공시", impact: "중립", score: 4 },
  { date: "08.12", title: "MSCI/KOSPI200 리밸런싱", category: "이벤트", impact: "긍정", score: 6 },
];

export const alerts = [
  {
    id: 1,
    condition: "SK하이닉스가 3,050,000원에 도달하면 일부 익절 알림",
    stock: "SK하이닉스",
    severity: "정보",
    category: "가격 알림",
    status: "활성",
    lastTriggered: "—",
    enabled: true,
  },
  {
    id: 2,
    condition: "외국인 3거래일 연속 순매도 시 알림",
    stock: "SK하이닉스",
    severity: "주의",
    category: "수급 알림",
    status: "활성",
    lastTriggered: "2026.06.18",
    enabled: true,
  },
  {
    id: 3,
    condition: "실적 컨센서스 하향 발생 시 알림",
    stock: "NVDA",
    severity: "주의",
    category: "실적 알림",
    status: "활성",
    lastTriggered: "—",
    enabled: true,
  },
  {
    id: 4,
    condition: "SOX 지수 3% 이상 하락 시 알림",
    stock: "섹터",
    severity: "경고",
    category: "리스크 알림",
    status: "활성",
    lastTriggered: "2026.05.30",
    enabled: true,
  },
  {
    id: 5,
    condition: "포트폴리오 AI 반도체 비중 50% 초과 시 알림",
    stock: "포트폴리오",
    severity: "주의",
    category: "포트폴리오 알림",
    status: "활성",
    lastTriggered: "—",
    enabled: false,
  },
  {
    id: 6,
    condition: "NVDA $148 이탈 시 알림",
    stock: "NVDA",
    severity: "정보",
    category: "가격 알림",
    status: "비활성",
    lastTriggered: "—",
    enabled: false,
  },
];

export const reports = [
  {
    type: "장전 브리핑",
    title: "06.24 장전 — 미국 반도체 강세, 외국인 동향 주시",
    summary:
      "미국 반도체주는 강세를 유지하고 있으나 단기 과열 부담이 있습니다. SK하이닉스는 보유 우위, 신규 진입은 눌림 확인 후 접근이 유리합니다.",
    time: "08:10",
  },
  {
    type: "장중 업데이트",
    title: "코스피 1.2% 강세 — AI 반도체 주도",
    summary:
      "외국인 순매수가 반도체에 집중되며 지수 상승을 이끌고 있습니다. 단기 차익 매물 가능성에 유의하세요.",
    time: "13:35",
  },
  {
    type: "장마감 리포트",
    title: "06.23 마감 — 코스피 +0.6%, 나스닥 +0.4%",
    summary:
      "글로벌 위험선호 흐름이 이어졌습니다. 다만 환율 변동성 확대로 외국인 수급 둔화 가능성이 있어 다음 거래일 시초가 흐름이 중요합니다.",
    time: "16:05",
  },
  {
    type: "주간 전략 리포트",
    title: "이번 주 전략 — HBM 사이클과 환율 이중 변수",
    summary:
      "HBM 수요 강세는 유지되지만, 환율 급등 시 외국인 수급이 흔들릴 수 있습니다. 보유자는 비중 유지, 신규 진입은 분할 접근을 권장합니다.",
    time: "월요일 07:30",
  },
];

export function formatPrice(price: number, currency: "KRW" | "USD") {
  if (currency === "KRW") return `${price.toLocaleString("ko-KR")}원`;
  return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}