export type SignalStatus = "green" | "yellow" | "orange" | "red";

export type MarketPick = {
  rank: number;
  ticker: string;
  company_name: string;
  market: "KR" | "US";
  exchange: string;
  currency: "KRW" | "USD";
  signal_status: SignalStatus;
  score: number;
  current_price: number;
  buy_zone: { low: number; high: number };
  base_target: number;
  stretch_target: number;
  stop_loss: number;
  upside_probability: number;
  theme_name?: string;
  thesis: string;
  watch_condition: string;
  risk_summary: string;
};

export type MarketPicksPage = {
  analysis_date: string;
  market_summary: string;
  picks: MarketPick[];
};

export const krPicks: MarketPicksPage = {
  analysis_date: "2026-06-24",
  market_summary:
    "코스피는 HBM·AI 인프라 중심으로 외국인 매수가 유입되며 상단을 시험하고 있습니다. 다만 단기 상승폭이 커진 종목이 늘면서 신규 진입은 눌림 대기가 유리한 구간입니다. 조선·방산 등 중후장대 테마는 추세를 유지 중이며, 2차전지는 수급 회복 신호가 아직 약합니다.",
  picks: [
    {
      rank: 1, ticker: "000660", company_name: "SK하이닉스", market: "KR", exchange: "KOSPI", currency: "KRW",
      signal_status: "green", score: 86, current_price: 2850000,
      buy_zone: { low: 2700000, high: 2780000 }, base_target: 3050000, stretch_target: 3200000, stop_loss: 2620000,
      upside_probability: 68, theme_name: "HBM",
      thesis: "HBM3E 공급 확대와 4분기 가격 인상 기대, 외국인 12거래일 연속 순매수.",
      watch_condition: "2,780,000원 부근 눌림 시 분할 매수 검토.",
      risk_summary: "Micron 실적 가이던스 하향, 20일선 종가 이탈 시 비중 축소.",
    },
    {
      rank: 2, ticker: "005930", company_name: "삼성전자", market: "KR", exchange: "KOSPI", currency: "KRW",
      signal_status: "yellow", score: 74, current_price: 84500,
      buy_zone: { low: 81000, high: 82500 }, base_target: 92000, stretch_target: 98000, stop_loss: 78500,
      upside_probability: 58, theme_name: "반도체",
      thesis: "파운드리 수주 회복과 HBM 후발 진입 가시화.",
      watch_condition: "82,000원대 지지 확인 후 진입.",
      risk_summary: "파운드리 수율 이슈 재부각 시 신뢰도 훼손.",
    },
    {
      rank: 3, ticker: "042660", company_name: "한화오션", market: "KR", exchange: "KOSPI", currency: "KRW",
      signal_status: "green", score: 81, current_price: 38900,
      buy_zone: { low: 37000, high: 37800 }, base_target: 44000, stretch_target: 48000, stop_loss: 35200,
      upside_probability: 62, theme_name: "조선",
      thesis: "LNG선·해양플랜트 수주 모멘텀 강화.",
      watch_condition: "37,500원 부근 분할 매수.",
      risk_summary: "수주 공백 또는 환율 급변 시 조정.",
    },
    {
      rank: 4, ticker: "012450", company_name: "한화에어로스페이스", market: "KR", exchange: "KOSPI", currency: "KRW",
      signal_status: "yellow", score: 72, current_price: 358000,
      buy_zone: { low: 340000, high: 348000 }, base_target: 410000, stretch_target: 450000, stop_loss: 322000,
      upside_probability: 55, theme_name: "방산",
      thesis: "유럽 방산 발주 사이클 진입, K9·천궁 수출 호조.",
      watch_condition: "거래량 동반 눌림 확인.",
      risk_summary: "지정학 완화 신호, 단기 차익실현 매물.",
    },
    {
      rank: 5, ticker: "247540", company_name: "에코프로비엠", market: "KR", exchange: "KOSDAQ", currency: "KRW",
      signal_status: "orange", score: 58, current_price: 162000,
      buy_zone: { low: 152000, high: 156000 }, base_target: 180000, stretch_target: 195000, stop_loss: 146000,
      upside_probability: 42, theme_name: "2차전지",
      thesis: "리튬 가격 바닥 형성 시그널, EV 수요 점진 회복.",
      watch_condition: "거래대금 회복 확인 후 단계적 접근.",
      risk_summary: "EV 수요 둔화 장기화, 수급 이탈 지속.",
    },
    {
      rank: 6, ticker: "035420", company_name: "NAVER", market: "KR", exchange: "KOSPI", currency: "KRW",
      signal_status: "yellow", score: 70, current_price: 218500,
      buy_zone: { low: 208000, high: 213000 }, base_target: 245000, stretch_target: 265000, stop_loss: 198000,
      upside_probability: 54, theme_name: "AI 플랫폼",
      thesis: "AI 검색·커머스 광고 회복, 일본 라인 가치 재평가.",
      watch_condition: "거래량 증가 동반 박스 상단 돌파.",
      risk_summary: "광고 시장 회복 지연.",
    },
    {
      rank: 7, ticker: "207940", company_name: "삼성바이오로직스", market: "KR", exchange: "KOSPI", currency: "KRW",
      signal_status: "green", score: 79, current_price: 1085000,
      buy_zone: { low: 1035000, high: 1058000 }, base_target: 1180000, stretch_target: 1250000, stop_loss: 985000,
      upside_probability: 60, theme_name: "바이오",
      thesis: "4공장 가동률 상승, 신규 CDMO 수주 확보.",
      watch_condition: "1,060,000원대 지지 확인.",
      risk_summary: "글로벌 바이오 투자 심리 위축.",
    },
    {
      rank: 8, ticker: "086520", company_name: "에코프로", market: "KR", exchange: "KOSDAQ", currency: "KRW",
      signal_status: "orange", score: 55, current_price: 92500,
      buy_zone: { low: 87000, high: 89500 }, base_target: 104000, stretch_target: 112000, stop_loss: 82000,
      upside_probability: 40, theme_name: "2차전지 소재",
      thesis: "전구체 내재화 진척, 단기 반등 시도.",
      watch_condition: "89,000원대 지지 + 거래량 회복.",
      risk_summary: "수급 이탈 지속, 그룹사 리스크.",
    },
    {
      rank: 9, ticker: "267260", company_name: "HD현대일렉트릭", market: "KR", exchange: "KOSPI", currency: "KRW",
      signal_status: "green", score: 83, current_price: 432000,
      buy_zone: { low: 410000, high: 420000 }, base_target: 495000, stretch_target: 540000, stop_loss: 388000,
      upside_probability: 64, theme_name: "전력기기",
      thesis: "미국 전력망 교체 사이클, 변압기 수주잔고 사상 최대.",
      watch_condition: "420,000원 부근 눌림 시 분할 매수.",
      risk_summary: "환율 급락, 미국 인프라 예산 지연.",
    },
    {
      rank: 10, ticker: "066970", company_name: "엘앤에프", market: "KR", exchange: "KOSDAQ", currency: "KRW",
      signal_status: "red", score: 38, current_price: 118500,
      buy_zone: { low: 110000, high: 113000 }, base_target: 132000, stretch_target: 142000, stop_loss: 104000,
      upside_probability: 28, theme_name: "2차전지",
      thesis: "단기 낙폭 과대, 기술적 반등 가능 구간.",
      watch_condition: "거래량 동반 113,000원 회복.",
      risk_summary: "추세 약세 지속, 무리한 진입 비추천.",
    },
  ],
};

export const usPicks: MarketPicksPage = {
  analysis_date: "2026-06-24",
  market_summary:
    "미국 시장은 AI 인프라·전력 테마가 지수를 끌어올리고 있으며, 빅테크 실적 시즌 진입을 앞두고 변동성이 확대되는 구간입니다. 단기 과열 종목은 눌림 대기, 전력·산업재는 추세 유지가 유효합니다.",
  picks: [
    {
      rank: 1, ticker: "NVDA", company_name: "NVIDIA", market: "US", exchange: "NASDAQ", currency: "USD",
      signal_status: "green", score: 88, current_price: 142.5,
      buy_zone: { low: 132, high: 136 }, base_target: 158, stretch_target: 172, stop_loss: 124,
      upside_probability: 70, theme_name: "AI 인프라",
      thesis: "Blackwell 출하 가속, 하이퍼스케일러 캡엑스 상향.",
      watch_condition: "$136 부근 눌림 시 분할 매수.",
      risk_summary: "캡엑스 둔화 신호, 중국 규제 강화.",
    },
    {
      rank: 2, ticker: "AVGO", company_name: "Broadcom", market: "US", exchange: "NASDAQ", currency: "USD",
      signal_status: "green", score: 82, current_price: 178.3,
      buy_zone: { low: 168, high: 172 }, base_target: 198, stretch_target: 215, stop_loss: 158,
      upside_probability: 64, theme_name: "AI 반도체",
      thesis: "커스텀 AI 칩 수주 확대, VMware 시너지 가시화.",
      watch_condition: "$172 지지 확인.",
      risk_summary: "AI 캡엑스 둔화, 소프트웨어 통합 지연.",
    },
    {
      rank: 3, ticker: "VRT", company_name: "Vertiv", market: "US", exchange: "NYSE", currency: "USD",
      signal_status: "green", score: 80, current_price: 108.9,
      buy_zone: { low: 102, high: 105 }, base_target: 122, stretch_target: 135, stop_loss: 96,
      upside_probability: 62, theme_name: "데이터센터 전력",
      thesis: "데이터센터 냉각·전력 수주잔고 강세.",
      watch_condition: "$105 부근 눌림 매수.",
      risk_summary: "AI 캡엑스 사이클 둔화.",
    },
    {
      rank: 4, ticker: "AAPL", company_name: "Apple", market: "US", exchange: "NASDAQ", currency: "USD",
      signal_status: "yellow", score: 68, current_price: 215.4,
      buy_zone: { low: 205, high: 210 }, base_target: 232, stretch_target: 245, stop_loss: 198,
      upside_probability: 52, theme_name: "온디바이스 AI",
      thesis: "AI 기기 교체 사이클, 서비스 매출 성장 지속.",
      watch_condition: "$210 지지 + 아이폰 판매 데이터 확인.",
      risk_summary: "중국 수요 둔화, 규제 리스크.",
    },
    {
      rank: 5, ticker: "MSFT", company_name: "Microsoft", market: "US", exchange: "NASDAQ", currency: "USD",
      signal_status: "yellow", score: 72, current_price: 438.2,
      buy_zone: { low: 418, high: 425 }, base_target: 472, stretch_target: 495, stop_loss: 402,
      upside_probability: 56, theme_name: "AI 플랫폼",
      thesis: "Azure AI 매출 성장, Copilot 침투율 확대.",
      watch_condition: "$425 부근 박스 지지.",
      risk_summary: "캡엑스 마진 압박 우려.",
    },
    {
      rank: 6, ticker: "GEV", company_name: "GE Vernova", market: "US", exchange: "NYSE", currency: "USD",
      signal_status: "green", score: 78, current_price: 198.5,
      buy_zone: { low: 188, high: 192 }, base_target: 222, stretch_target: 240, stop_loss: 178,
      upside_probability: 60, theme_name: "전력 인프라",
      thesis: "가스터빈·전력망 교체 사이클 진입.",
      watch_condition: "$192 지지 확인.",
      risk_summary: "프로젝트 지연, 원자재 가격 상승.",
    },
    {
      rank: 7, ticker: "TSLA", company_name: "Tesla", market: "US", exchange: "NASDAQ", currency: "USD",
      signal_status: "orange", score: 54, current_price: 218.7,
      buy_zone: { low: 205, high: 210 }, base_target: 245, stretch_target: 268, stop_loss: 192,
      upside_probability: 42, theme_name: "EV·로봇",
      thesis: "로보택시 모멘텀과 에너지 사업 성장.",
      watch_condition: "$210 지지 + 인도량 회복 확인.",
      risk_summary: "EV 가격 경쟁, 로보택시 상용화 지연.",
    },
    {
      rank: 8, ticker: "META", company_name: "Meta Platforms", market: "US", exchange: "NASDAQ", currency: "USD",
      signal_status: "yellow", score: 71, current_price: 512.4,
      buy_zone: { low: 488, high: 498 }, base_target: 558, stretch_target: 590, stop_loss: 468,
      upside_probability: 55, theme_name: "AI 광고",
      thesis: "AI 추천 알고리즘 강화, 광고 ARPU 상승.",
      watch_condition: "$498 지지 확인.",
      risk_summary: "AI 캡엑스 확대에 따른 마진 압박.",
    },
    {
      rank: 9, ticker: "PLTR", company_name: "Palantir", market: "US", exchange: "NYSE", currency: "USD",
      signal_status: "orange", score: 56, current_price: 28.4,
      buy_zone: { low: 26.2, high: 27 }, base_target: 32, stretch_target: 35, stop_loss: 24.5,
      upside_probability: 44, theme_name: "AI 소프트웨어",
      thesis: "상업·정부 부문 AIP 수주 확대.",
      watch_condition: "$27 지지 + 거래량 회복.",
      risk_summary: "밸류에이션 부담, 단기 변동성.",
    },
    {
      rank: 10, ticker: "AMD", company_name: "AMD", market: "US", exchange: "NASDAQ", currency: "USD",
      signal_status: "red", score: 42, current_price: 148.2,
      buy_zone: { low: 138, high: 142 }, base_target: 165, stretch_target: 178, stop_loss: 128,
      upside_probability: 35, theme_name: "AI 반도체",
      thesis: "MI300 출하 본격화 기대.",
      watch_condition: "$142 지지 실패 시 관망.",
      risk_summary: "NVDA 점유율 격차 지속, 가이던스 하향.",
    },
  ],
};

export type CycleStage =
  | "forming" | "spreading" | "leading" | "overheated" | "correcting" | "weakening";

export const cycleLabel: Record<CycleStage, string> = {
  forming: "초기 형성",
  spreading: "확산",
  leading: "주도",
  overheated: "과열",
  correcting: "조정",
  weakening: "약화",
};

export type Theme = {
  id: string;
  slug: string;
  name: string;
  sector: string;
  score: number;
  signal_status: SignalStatus;
  cycle_stage: CycleStage;
  duration_estimate: string;
  easy_summary: string;
  why_strong: string[];
  watch_out: string[];
  catalysts?: string[];
  risks?: string[];
};

export type ThemeStock = {
  ticker: string;
  company_name: string;
  signal_status: SignalStatus;
  score: number;
};

export const themes: Theme[] = [
  {
    id: "1", slug: "ai-infra", name: "AI 인프라", sector: "반도체", score: 86, signal_status: "green",
    cycle_stage: "leading", duration_estimate: "6~12개월",
    easy_summary: "전 세계 데이터센터 투자가 빠르게 늘면서 AI 칩과 전력·냉각 장비 수요가 강하게 유지되고 있습니다.",
    why_strong: ["하이퍼스케일러 캡엑스 가이던스 상향", "HBM·고대역폭 메모리 수급 타이트", "주요 빅테크 AI 매출 성장세 확인", "정부·국방 AI 발주 확대"],
    watch_out: ["단기 주가 상승폭이 커 변동성 확대", "캡엑스 둔화 신호 시 빠른 조정 가능"],
    catalysts: ["분기 실적 시즌 가이던스", "신규 AI 칩 출시"],
    risks: ["중국 수출 규제 강화", "전력 인프라 병목"],
  },
  {
    id: "2", slug: "hbm", name: "HBM", sector: "반도체", score: 84, signal_status: "green",
    cycle_stage: "leading", duration_estimate: "6~9개월",
    easy_summary: "AI 가속기에 들어가는 고성능 메모리 수요가 공급을 크게 앞서며 가격 강세가 이어지고 있습니다.",
    why_strong: ["HBM3E 가격 인상", "신규 라인 풀가동", "엔비디아·AMD 동시 수주"],
    watch_out: ["공급 증설 본격화 시점 모니터링"],
  },
  {
    id: "3", slug: "power-grid", name: "전력 인프라", sector: "산업재", score: 80, signal_status: "green",
    cycle_stage: "spreading", duration_estimate: "12~24개월",
    easy_summary: "AI 데이터센터와 전기화 흐름으로 노후 전력망 교체 사이클이 본격화되고 있습니다.",
    why_strong: ["미국·유럽 전력망 교체 예산 확정", "변압기 수주잔고 사상 최대", "데이터센터 전력 수요 급증"],
    watch_out: ["프로젝트 집행 속도 변동성"],
  },
  {
    id: "4", slug: "defense", name: "방산", sector: "산업재", score: 76, signal_status: "yellow",
    cycle_stage: "spreading", duration_estimate: "12~24개월",
    easy_summary: "지정학 리스크 장기화로 글로벌 방산 발주가 다년 사이클에 진입한 상태입니다.",
    why_strong: ["유럽 방산 예산 증액", "한국·미국 무기 수출 확대"],
    watch_out: ["지정학 완화 시 단기 차익실현"],
  },
  {
    id: "5", slug: "shipbuilding", name: "조선", sector: "산업재", score: 74, signal_status: "yellow",
    cycle_stage: "spreading", duration_estimate: "12~24개월",
    easy_summary: "LNG선과 친환경 선박 발주 사이클이 지속되며 한국 조선사의 수주잔고가 견조합니다.",
    why_strong: ["LNG선 신규 발주 강세", "선가 우상향"],
    watch_out: ["환율 변동성, 후판 가격"],
  },
  {
    id: "6", slug: "ev-battery", name: "2차전지", sector: "소재", score: 48, signal_status: "orange",
    cycle_stage: "correcting", duration_estimate: "3~6개월",
    easy_summary: "전기차 수요 둔화로 조정 국면이 이어지고 있으나, 리튬 가격 바닥 신호가 일부 나타나고 있습니다.",
    why_strong: ["리튬 가격 바닥 형성 시그널", "북미 IRA 수혜 지속"],
    watch_out: ["EV 수요 회복 지연 가능성", "수급 이탈 지속"],
  },
  {
    id: "7", slug: "biotech", name: "바이오 CDMO", sector: "헬스케어", score: 72, signal_status: "yellow",
    cycle_stage: "spreading", duration_estimate: "9~12개월",
    easy_summary: "글로벌 신약 위탁생산 수주가 늘면서 한국 CDMO 기업의 가동률이 상승하고 있습니다.",
    why_strong: ["대형 CDMO 수주 확보", "공장 가동률 상승"],
    watch_out: ["바이오 투자 심리 변동성"],
  },
  {
    id: "8", slug: "robotics", name: "로봇", sector: "산업재", score: 62, signal_status: "yellow",
    cycle_stage: "forming", duration_estimate: "12개월+",
    easy_summary: "휴머노이드·산업용 로봇 상용화 기대가 형성 중이며 관련 부품주가 먼저 반응하고 있습니다.",
    why_strong: ["빅테크 휴머노이드 개발 가속", "감속기·부품 수요 증가"],
    watch_out: ["상용화 시점 불확실"],
  },
];

export const themeStocksBySlug: Record<string, ThemeStock[]> = {
  "ai-infra": [
    { ticker: "NVDA", company_name: "NVIDIA", signal_status: "green", score: 88 },
    { ticker: "AVGO", company_name: "Broadcom", signal_status: "green", score: 82 },
    { ticker: "VRT", company_name: "Vertiv", signal_status: "green", score: 80 },
    { ticker: "000660", company_name: "SK하이닉스", signal_status: "green", score: 86 },
    { ticker: "GEV", company_name: "GE Vernova", signal_status: "green", score: 78 },
    { ticker: "AMD", company_name: "AMD", signal_status: "red", score: 42 },
  ],
  "hbm": [
    { ticker: "000660", company_name: "SK하이닉스", signal_status: "green", score: 86 },
    { ticker: "005930", company_name: "삼성전자", signal_status: "yellow", score: 74 },
    { ticker: "MU", company_name: "Micron", signal_status: "yellow", score: 70 },
    { ticker: "036570", company_name: "한미반도체", signal_status: "green", score: 79 },
  ],
  "power-grid": [
    { ticker: "267260", company_name: "HD현대일렉트릭", signal_status: "green", score: 83 },
    { ticker: "GEV", company_name: "GE Vernova", signal_status: "green", score: 78 },
    { ticker: "VRT", company_name: "Vertiv", signal_status: "green", score: 80 },
    { ticker: "ETN", company_name: "Eaton", signal_status: "yellow", score: 72 },
  ],
  "defense": [
    { ticker: "012450", company_name: "한화에어로스페이스", signal_status: "yellow", score: 72 },
    { ticker: "047810", company_name: "한국항공우주", signal_status: "yellow", score: 68 },
    { ticker: "LMT", company_name: "Lockheed Martin", signal_status: "yellow", score: 66 },
    { ticker: "RTX", company_name: "RTX", signal_status: "yellow", score: 64 },
  ],
  "shipbuilding": [
    { ticker: "042660", company_name: "한화오션", signal_status: "green", score: 81 },
    { ticker: "329180", company_name: "HD현대중공업", signal_status: "yellow", score: 73 },
    { ticker: "010140", company_name: "삼성중공업", signal_status: "yellow", score: 70 },
  ],
  "ev-battery": [
    { ticker: "247540", company_name: "에코프로비엠", signal_status: "orange", score: 58 },
    { ticker: "086520", company_name: "에코프로", signal_status: "orange", score: 55 },
    { ticker: "066970", company_name: "엘앤에프", signal_status: "red", score: 38 },
    { ticker: "373220", company_name: "LG에너지솔루션", signal_status: "yellow", score: 64 },
  ],
  "biotech": [
    { ticker: "207940", company_name: "삼성바이오로직스", signal_status: "green", score: 79 },
    { ticker: "068270", company_name: "셀트리온", signal_status: "yellow", score: 68 },
    { ticker: "LLY", company_name: "Eli Lilly", signal_status: "yellow", score: 70 },
  ],
  "robotics": [
    { ticker: "108490", company_name: "로보티즈", signal_status: "yellow", score: 62 },
    { ticker: "056190", company_name: "에스에프에이", signal_status: "yellow", score: 60 },
    { ticker: "ISRG", company_name: "Intuitive Surgical", signal_status: "yellow", score: 66 },
  ],
};

export type SearchStock = {
  id: string;
  ticker: string;
  company_name: string;
  company_name_en?: string;
  exchange: string;
  market: "KR" | "US";
  instrument_type: "stock" | "etf";
  signal_status: SignalStatus;
  score: number;
};

export const searchUniverse: SearchStock[] = [
  { id: "1", ticker: "000660", company_name: "SK하이닉스", company_name_en: "SK Hynix", exchange: "KOSPI", market: "KR", instrument_type: "stock", signal_status: "green", score: 86 },
  { id: "2", ticker: "005930", company_name: "삼성전자", company_name_en: "Samsung Electronics", exchange: "KOSPI", market: "KR", instrument_type: "stock", signal_status: "yellow", score: 74 },
  { id: "3", ticker: "042660", company_name: "한화오션", exchange: "KOSPI", market: "KR", instrument_type: "stock", signal_status: "green", score: 81 },
  { id: "4", ticker: "012450", company_name: "한화에어로스페이스", exchange: "KOSPI", market: "KR", instrument_type: "stock", signal_status: "yellow", score: 72 },
  { id: "5", ticker: "247540", company_name: "에코프로비엠", exchange: "KOSDAQ", market: "KR", instrument_type: "stock", signal_status: "orange", score: 58 },
  { id: "6", ticker: "086520", company_name: "에코프로", exchange: "KOSDAQ", market: "KR", instrument_type: "stock", signal_status: "orange", score: 55 },
  { id: "7", ticker: "035420", company_name: "NAVER", company_name_en: "Naver", exchange: "KOSPI", market: "KR", instrument_type: "stock", signal_status: "yellow", score: 70 },
  { id: "8", ticker: "035720", company_name: "카카오", company_name_en: "Kakao", exchange: "KOSPI", market: "KR", instrument_type: "stock", signal_status: "orange", score: 52 },
  { id: "9", ticker: "207940", company_name: "삼성바이오로직스", exchange: "KOSPI", market: "KR", instrument_type: "stock", signal_status: "green", score: 79 },
  { id: "10", ticker: "068270", company_name: "셀트리온", exchange: "KOSPI", market: "KR", instrument_type: "stock", signal_status: "yellow", score: 68 },
  { id: "11", ticker: "267260", company_name: "HD현대일렉트릭", exchange: "KOSPI", market: "KR", instrument_type: "stock", signal_status: "green", score: 83 },
  { id: "12", ticker: "329180", company_name: "HD현대중공업", exchange: "KOSPI", market: "KR", instrument_type: "stock", signal_status: "yellow", score: 73 },
  { id: "13", ticker: "373220", company_name: "LG에너지솔루션", exchange: "KOSPI", market: "KR", instrument_type: "stock", signal_status: "yellow", score: 64 },
  { id: "14", ticker: "036570", company_name: "한미반도체", exchange: "KOSDAQ", market: "KR", instrument_type: "stock", signal_status: "green", score: 79 },
  { id: "15", ticker: "069500", company_name: "KODEX 200", exchange: "KOSPI", market: "KR", instrument_type: "etf", signal_status: "yellow", score: 66 },
  { id: "16", ticker: "091160", company_name: "KODEX 반도체", exchange: "KOSPI", market: "KR", instrument_type: "etf", signal_status: "green", score: 80 },
  { id: "17", ticker: "305720", company_name: "KODEX 2차전지산업", exchange: "KOSPI", market: "KR", instrument_type: "etf", signal_status: "orange", score: 50 },
  { id: "18", ticker: "NVDA", company_name: "엔비디아", company_name_en: "NVIDIA", exchange: "NASDAQ", market: "US", instrument_type: "stock", signal_status: "green", score: 88 },
  { id: "19", ticker: "AVGO", company_name: "브로드컴", company_name_en: "Broadcom", exchange: "NASDAQ", market: "US", instrument_type: "stock", signal_status: "green", score: 82 },
  { id: "20", ticker: "AAPL", company_name: "애플", company_name_en: "Apple", exchange: "NASDAQ", market: "US", instrument_type: "stock", signal_status: "yellow", score: 68 },
  { id: "21", ticker: "MSFT", company_name: "마이크로소프트", company_name_en: "Microsoft", exchange: "NASDAQ", market: "US", instrument_type: "stock", signal_status: "yellow", score: 72 },
  { id: "22", ticker: "GOOGL", company_name: "알파벳", company_name_en: "Alphabet", exchange: "NASDAQ", market: "US", instrument_type: "stock", signal_status: "yellow", score: 71 },
  { id: "23", ticker: "META", company_name: "메타", company_name_en: "Meta Platforms", exchange: "NASDAQ", market: "US", instrument_type: "stock", signal_status: "yellow", score: 71 },
  { id: "24", ticker: "TSLA", company_name: "테슬라", company_name_en: "Tesla", exchange: "NASDAQ", market: "US", instrument_type: "stock", signal_status: "orange", score: 54 },
  { id: "25", ticker: "AMD", company_name: "AMD", exchange: "NASDAQ", market: "US", instrument_type: "stock", signal_status: "red", score: 42 },
  { id: "26", ticker: "VRT", company_name: "버티브", company_name_en: "Vertiv", exchange: "NYSE", market: "US", instrument_type: "stock", signal_status: "green", score: 80 },
  { id: "27", ticker: "GEV", company_name: "GE Vernova", exchange: "NYSE", market: "US", instrument_type: "stock", signal_status: "green", score: 78 },
  { id: "28", ticker: "PLTR", company_name: "팔란티어", company_name_en: "Palantir", exchange: "NYSE", market: "US", instrument_type: "stock", signal_status: "orange", score: 56 },
  { id: "29", ticker: "MU", company_name: "마이크론", company_name_en: "Micron", exchange: "NASDAQ", market: "US", instrument_type: "stock", signal_status: "yellow", score: 70 },
  { id: "30", ticker: "QQQ", company_name: "Invesco QQQ", exchange: "NASDAQ", market: "US", instrument_type: "etf", signal_status: "yellow", score: 72 },
  { id: "31", ticker: "SMH", company_name: "VanEck 반도체 ETF", exchange: "NASDAQ", market: "US", instrument_type: "etf", signal_status: "green", score: 81 },
  { id: "32", ticker: "SOXL", company_name: "Direxion 반도체 3X", exchange: "NYSE", market: "US", instrument_type: "etf", signal_status: "yellow", score: 64 },
];

export type PullbackAnalysis = {
  ticker: string;
  company_name: string;
  signal_status: SignalStatus;
  one_line_summary: string;
  pullback_type: string;
  pullback_label: string;
  context_paragraph: string;
  signal_checks: {
    structural_damage: "yes" | "no" | "unclear";
    short_term_volatility: "yes" | "no" | "unclear";
    liquidity_exit: "yes" | "no" | "unclear";
    notes: Record<string, string>;
  };
  key_signals: string[];
  support_zones: { label: string; low: number; high: number }[];
  invalidation_conditions: string[];
  response_scenarios: { action: string; rationale: string }[];
};

export const pullbackByTicker: Record<string, PullbackAnalysis> = {
  "000660": {
    ticker: "000660", company_name: "SK하이닉스", signal_status: "yellow",
    one_line_summary: "단기 과열 해소 성격의 정상 조정으로 보이며, 구조적 훼손은 확인되지 않습니다.",
    pullback_type: "short_term_cooldown", pullback_label: "단기 과열 해소",
    context_paragraph:
      "최근 3주간의 급등 이후 차익실현 매물이 출회되고 있으나, 거래량은 평균 수준을 유지하고 있습니다. 외국인 누적 순매수 흐름은 유지되고 있으며 20일선 위에서의 박스권 횡보 가능성이 큽니다.",
    signal_checks: {
      structural_damage: "no",
      short_term_volatility: "yes",
      liquidity_exit: "no",
      notes: {
        structural_damage: "20일선·60일선 정배열 유지",
        short_term_volatility: "장중 변동성 확대, ATR 상승",
        liquidity_exit: "외국인 누적 순매수 12거래일 연속",
      },
    },
    key_signals: [
      "20일 이동평균선 위 종가 유지",
      "외국인 순매수 흐름 유지",
      "HBM 가격 가이던스 변화 없음",
      "동종 종목(Micron) 동조 흐름",
    ],
    support_zones: [
      { label: "1차 지지", low: 2780000, high: 2820000 },
      { label: "강한 지지", low: 2700000, high: 2750000 },
      { label: "최후 방어선", low: 2620000, high: 2660000 },
    ],
    invalidation_conditions: [
      "20일선 종가 이탈 후 3거래일 미회복",
      "외국인 3거래일 연속 대량 순매도",
      "Micron 실적 가이던스 하향",
    ],
    response_scenarios: [
      { action: "추가 매수 검토", rationale: "2,780,000원대 지지 확인 시 분할 매수 유효" },
      { action: "관망", rationale: "박스권 횡보 가능성, 방향성 확인 후 대응" },
      { action: "비중 축소 검토", rationale: "20일선 이탈 + 거래량 급증 동반 시" },
    ],
  },
  "005930": {
    ticker: "005930", company_name: "삼성전자", signal_status: "yellow",
    one_line_summary: "수급 혼조 속 박스권 하단을 시험 중이며, 단기 변동성 확대 구간입니다.",
    pullback_type: "liquidity_rotation", pullback_label: "수급 이탈",
    context_paragraph:
      "기관 매도와 외국인 매수가 엇갈리며 박스권 하단을 시험하고 있습니다. 파운드리 수율 이슈가 단기 노이즈로 작용 중이나, 장기 추세선은 유지되고 있습니다.",
    signal_checks: {
      structural_damage: "unclear", short_term_volatility: "yes", liquidity_exit: "yes",
      notes: {
        structural_damage: "60일선 근접, 추가 확인 필요",
        short_term_volatility: "거래량 평균 대비 1.4배",
        liquidity_exit: "기관 5거래일 순매도",
      },
    },
    key_signals: ["60일선 지지 시험", "기관 순매도 지속", "외국인 매수 일부 유입", "파운드리 뉴스 노이즈"],
    support_zones: [
      { label: "1차 지지", low: 82000, high: 83000 },
      { label: "강한 지지", low: 78500, high: 80000 },
    ],
    invalidation_conditions: ["78,500원 종가 이탈", "외국인 매수 전환 실패", "파운드리 추가 악재"],
    response_scenarios: [
      { action: "관망", rationale: "수급 방향성 확인 전 신규 진입 보류" },
      { action: "추가 매수 검토", rationale: "82,000원대 지지 + 거래량 회복 시 일부 분할" },
      { action: "비중 축소 검토", rationale: "78,500원 이탈 시 단기 비중 조정" },
    ],
  },
  "NVDA": {
    ticker: "NVDA", company_name: "NVIDIA", signal_status: "green",
    one_line_summary: "추세는 유지되고 있으며 단기 과열 해소 성격의 건강한 조정입니다.",
    pullback_type: "healthy_pullback", pullback_label: "정상 조정",
    context_paragraph:
      "급등 이후 차익실현 매물이 일부 출회되었으나 거래량과 옵션 흐름은 정상 범위입니다. 하이퍼스케일러 캡엑스 가이던스는 견조하며 50일선 위에서 박스권 형성이 예상됩니다.",
    signal_checks: {
      structural_damage: "no", short_term_volatility: "yes", liquidity_exit: "no",
      notes: {
        structural_damage: "50일·200일선 정배열",
        short_term_volatility: "IV 단기 상승",
        liquidity_exit: "ETF 순유입 유지",
      },
    },
    key_signals: ["50일선 지지 유지", "옵션 풋콜 비율 정상", "AI 캡엑스 가이던스 견조", "동종(AVGO) 동조"],
    support_zones: [
      { label: "1차 지지", low: 136, high: 140 },
      { label: "강한 지지", low: 128, high: 132 },
    ],
    invalidation_conditions: ["$128 종가 이탈", "하이퍼스케일러 캡엑스 하향", "거래량 급감 동반 하락"],
    response_scenarios: [
      { action: "추가 매수 검토", rationale: "$136 부근 지지 확인 시 분할 매수" },
      { action: "관망", rationale: "변동성 확인 후 진입" },
      { action: "비중 축소 검토", rationale: "$128 이탈 시 일부 익절" },
    ],
  },
  "AAPL": {
    ticker: "AAPL", company_name: "Apple", signal_status: "yellow",
    one_line_summary: "실적 시즌을 앞둔 단기 변동성 확대 구간이며, 추세 훼손은 확인되지 않았습니다.",
    pullback_type: "earnings_concern", pullback_label: "실적 우려 반영",
    context_paragraph:
      "중국 수요 둔화 우려가 단기 매물을 유발하고 있으나, 서비스 매출 성장과 AI 기기 교체 사이클 기대는 유지되고 있습니다. 50일선 근접에서 지지 시험 중입니다.",
    signal_checks: {
      structural_damage: "no", short_term_volatility: "yes", liquidity_exit: "unclear",
      notes: {
        structural_damage: "200일선 위 유지",
        short_term_volatility: "실적 발표 임박",
        liquidity_exit: "기관 비중 소폭 감소",
      },
    },
    key_signals: ["50일선 지지 시험", "서비스 매출 성장 유지", "중국 판매 데이터 약세", "AI 기기 모멘텀"],
    support_zones: [
      { label: "1차 지지", low: 210, high: 213 },
      { label: "강한 지지", low: 198, high: 205 },
    ],
    invalidation_conditions: ["$198 종가 이탈", "서비스 매출 가이던스 하향", "중국 판매 추가 둔화"],
    response_scenarios: [
      { action: "관망", rationale: "실적 발표 전 신규 진입 보류" },
      { action: "추가 매수 검토", rationale: "$210 지지 확인 후 분할" },
      { action: "비중 축소 검토", rationale: "$198 이탈 시 일부 익절" },
    ],
  },
};

export const pullbackTypeSpectrum: { key: string; label: string; tone: "good" | "warn" | "bad" }[] = [
  { key: "healthy_pullback", label: "정상 조정", tone: "good" },
  { key: "short_term_cooldown", label: "단기 과열 해소", tone: "good" },
  { key: "liquidity_rotation", label: "수급 이탈", tone: "warn" },
  { key: "news_driven", label: "뉴스 기반", tone: "warn" },
  { key: "earnings_concern", label: "실적 우려", tone: "warn" },
  { key: "structural_weakening", label: "구조 약화", tone: "bad" },
  { key: "trend_break", label: "추세 훼손", tone: "bad" },
];

export function signalIntent(s: SignalStatus): "bullish" | "warn" | "bearish" | "neutral" {
  if (s === "green") return "bullish";
  if (s === "yellow") return "neutral";
  if (s === "orange") return "warn";
  return "bearish";
}

export function signalColor(s: SignalStatus): string {
  if (s === "green") return "var(--bullish)";
  if (s === "yellow") return "var(--neutral-accent)";
  if (s === "orange") return "var(--neutral-accent)";
  return "var(--bearish)";
}

export function signalLabel(s: SignalStatus): string {
  return s === "green" ? "양호" : s === "yellow" ? "관망" : s === "orange" ? "주의" : "경고";
}

export function formatPrice(p: number, currency: "KRW" | "USD"): string {
  if (currency === "KRW") return `${p.toLocaleString("ko-KR")}원`;
  return `$${p.toLocaleString("en-US", { minimumFractionDigits: p < 10 ? 2 : 0, maximumFractionDigits: 2 })}`;
}