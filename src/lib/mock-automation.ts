export type BrokerId = "kis" | "kiwoom" | "toss";

export type ConnectionStatus =
  | "not-connected"
  | "connected"
  | "needs-verification"
  | "expired"
  | "disabled"
  | "revoked";

export type AutomationMode = "off" | "paper" | "manual" | "semi" | "autonomous";

export const automationModeLabel: Record<AutomationMode, string> = {
  off: "꺼짐",
  paper: "모의투자만",
  manual: "수동 승인",
  semi: "반자동",
  autonomous: "완전 자율 잠금",
};

export const connectionStatusLabel: Record<ConnectionStatus, string> = {
  "not-connected": "미연결",
  connected: "연결됨",
  "needs-verification": "확인 필요",
  expired: "만료됨",
  disabled: "비활성화",
  revoked: "폐기됨",
};

export type Broker = {
  id: BrokerId;
  name: string;
  nameKr: string;
  initials: string;
  supportsKr: boolean;
  supportsUs: boolean;
  method: string;
};

export const brokers: Broker[] = [
  { id: "kis", name: "Korea Investment & Securities", nameKr: "한국투자증권", initials: "KIS", supportsKr: true, supportsUs: true, method: "OpenAPI · REST" },
  { id: "kiwoom", name: "Kiwoom Securities", nameKr: "키움증권", initials: "키움", supportsKr: true, supportsUs: true, method: "OpenAPI+ · WebSocket" },
  { id: "toss", name: "Toss Securities", nameKr: "토스증권", initials: "토스", supportsKr: true, supportsUs: true, method: "OAuth · 준비 중" },
];

export type BrokerAccount = {
  id: string;
  brokerId: BrokerId;
  label: string;
  masked: string;
  status: ConnectionStatus;
  markets: { kr: boolean; us: boolean };
  paperEnabled: boolean;
  liveLocked: boolean;
  automationMode: AutomationMode;
  killSwitch: "ready" | "engaged";
  riskProfile: "보수형" | "균형형" | "공격형";
  lastVerified: string | null;
};

export const accounts: BrokerAccount[] = [
  { id: "acc-kis-1", brokerId: "kis", label: "KIS Main Account", masked: "****-**-1234", status: "connected", markets: { kr: true, us: true }, paperEnabled: true, liveLocked: true, automationMode: "paper", killSwitch: "ready", riskProfile: "균형형", lastVerified: "2026.06.24 09:12" },
  { id: "acc-kiwoom-1", brokerId: "kiwoom", label: "Kiwoom Domestic", masked: "****-**-8890", status: "needs-verification", markets: { kr: true, us: false }, paperEnabled: false, liveLocked: true, automationMode: "off", killSwitch: "ready", riskProfile: "보수형", lastVerified: "2026.06.10 21:40" },
  { id: "acc-toss-1", brokerId: "toss", label: "Toss US Night (Waitlist)", masked: "—", status: "not-connected", markets: { kr: false, us: true }, paperEnabled: false, liveLocked: true, automationMode: "off", killSwitch: "ready", riskProfile: "보수형", lastVerified: null },
];

export type SignalStatus = "new" | "waiting" | "paper-executed" | "rejected" | "expired" | "blocked" | "live-locked";

export const signalStatusLabel: Record<SignalStatus, string> = {
  new: "신규",
  waiting: "승인 대기",
  "paper-executed": "모의 체결",
  rejected: "거절",
  expired: "만료",
  blocked: "리스크 차단",
  "live-locked": "실전 잠금",
};

export type QueueSignal = {
  id: string;
  ticker: string;
  company: string;
  market: "KR" | "US";
  source: string;
  action: string;
  proposedOrder: string;
  reason: string;
  warning?: string;
  accountId: string;
  status: SignalStatus;
  confidence: "안정" | "중립" | "주의";
  generatedAt: string;
  mode: AutomationMode;
};

export const queueSignals: QueueSignal[] = [
  { id: "sig-1", ticker: "000660", company: "SK하이닉스", market: "KR", source: "전략 스냅샷 · 목표가 근접", action: "부분 트림 제안", proposedOrder: "보유 수량의 20% 매도", reason: "저장된 트림 존 진입 · 신호 안정 유지", accountId: "acc-kis-1", status: "waiting", confidence: "안정", generatedAt: "13:22 KST", mode: "manual" },
  { id: "sig-2", ticker: "NVDA", company: "NVIDIA", market: "US", source: "AI 추천 · Signal 개선", action: "모의 매수 제안", proposedOrder: "가용 현금의 4% 시장가 매수", reason: "구조 회복 · 컨센 상향 지속", accountId: "acc-kis-1", status: "new", confidence: "중립", generatedAt: "13:05 KST", mode: "paper" },
  { id: "sig-3", ticker: "QLD", company: "ProShares Ultra QQQ", market: "US", source: "포트폴리오 리스크 · Signal 악화", action: "알림 전용", proposedOrder: "주문 생성 안 함", reason: "레버리지 ETF · 변동성 확대", warning: "리스크 규칙에 의해 실전 주문이 차단되었습니다.", accountId: "acc-kis-1", status: "blocked", confidence: "주의", generatedAt: "12:48 KST", mode: "off" },
  { id: "sig-4", ticker: "005930", company: "삼성전자", market: "KR", source: "알림 규칙 · 추가매수 존", action: "매수 제안 생성", proposedOrder: "정액 500,000원 매수", reason: "1차 지지선 리테스트 · 수급 개선", accountId: "acc-kis-1", status: "waiting", confidence: "안정", generatedAt: "11:36 KST", mode: "manual" },
  { id: "sig-5", ticker: "AAPL", company: "Apple", market: "US", source: "AI 추천 · Signal 개선", action: "실전 매수 준비", proposedOrder: "가용 현금의 3% 매수", reason: "실적 컨센 상향 · 구조 안정", accountId: "acc-kis-1", status: "live-locked", confidence: "안정", generatedAt: "10:12 KST", mode: "autonomous" },
];

export type RiskCheckResult = "pass" | "warn" | "fail";

export type OrderProposal = {
  id: string;
  ticker: string;
  company: string;
  market: "KR" | "US";
  side: "매수" | "매도";
  orderType: "시장가" | "지정가";
  quantity: number;
  estAmount: string;
  cashImpact: string;
  accountId: string;
  linkedSignal: string;
  linkedSnapshot: string;
  liveAllowed: boolean;
  checks: { label: string; result: RiskCheckResult; detail: string }[];
};

export const orderProposals: OrderProposal[] = [
  { id: "ord-1", ticker: "000660", company: "SK하이닉스", market: "KR", side: "매도", orderType: "지정가", quantity: 12, estAmount: "2,880,000원", cashImpact: "+2,880,000원 (현금)", accountId: "acc-kis-1", linkedSignal: "sig-1", linkedSnapshot: "SK하이닉스 추천 전략 · 2026.05.18", liveAllowed: false, checks: [
    { label: "계좌 활성화", result: "pass", detail: "KIS Main · 정상" },
    { label: "시장 권한", result: "pass", detail: "국내주식 주문 허용" },
    { label: "일일 손실 한도", result: "pass", detail: "잔여 82%" },
    { label: "1회 주문 한도", result: "pass", detail: "2,880,000원 / 5,000,000원" },
    { label: "종목 보유 한도", result: "warn", detail: "매도 후 잔여 63%" },
    { label: "킬스위치", result: "pass", detail: "정상" },
    { label: "쿨다운", result: "pass", detail: "18분 경과" },
    { label: "실전 자동매매 권한", result: "fail", detail: "실전 잠금 상태" },
  ]},
  { id: "ord-2", ticker: "005930", company: "삼성전자", market: "KR", side: "매수", orderType: "지정가", quantity: 8, estAmount: "500,000원", cashImpact: "-500,000원 (현금)", accountId: "acc-kis-1", linkedSignal: "sig-4", linkedSnapshot: "삼성전자 내 투자 스냅샷 · 2026.06.02", liveAllowed: false, checks: [
    { label: "계좌 활성화", result: "pass", detail: "KIS Main · 정상" },
    { label: "시장 권한", result: "pass", detail: "국내주식 주문 허용" },
    { label: "일일 손실 한도", result: "pass", detail: "잔여 82%" },
    { label: "1회 주문 한도", result: "pass", detail: "500,000원 / 5,000,000원" },
    { label: "종목 보유 한도", result: "pass", detail: "매수 후 42%" },
    { label: "킬스위치", result: "pass", detail: "정상" },
    { label: "쿨다운", result: "pass", detail: "정상" },
    { label: "실전 자동매매 권한", result: "fail", detail: "실전 잠금 상태" },
  ]},
];

export type Rule = {
  id: string;
  name: string;
  source: string;
  accountId: string;
  market: "KR" | "US";
  scope: string;
  trigger: string;
  action: string;
  mode: AutomationMode;
  status: "active" | "paused";
  lastTriggered: string;
};

export const rules: Rule[] = [
  { id: "rule-1", name: "SK하이닉스 트림 규칙", source: "전략 스냅샷 · 목표가 근접", accountId: "acc-kis-1", market: "KR", scope: "특정 종목 · 000660", trigger: "저장된 트림 존 도달 & Signal ≠ 위험", action: "보유 수량의 20% 매도 제안", mode: "manual", status: "active", lastTriggered: "오늘 13:22" },
  { id: "rule-2", name: "AI 추천 모의 매수", source: "AI 추천 · Signal 개선", accountId: "acc-kis-1", market: "US", scope: "관심종목", trigger: "Signal이 중립→양호로 전환", action: "가용 현금의 4% 모의 매수", mode: "paper", status: "active", lastTriggered: "오늘 13:05" },
  { id: "rule-3", name: "포트폴리오 리스크 알림", source: "포트폴리오 리스크 신호", accountId: "acc-kis-1", market: "US", scope: "포트폴리오 보유 종목", trigger: "Signal이 주의 이하로 악화", action: "알림만 전송 · 주문 생성 안 함", mode: "off", status: "paused", lastTriggered: "어제 21:11" },
];

export type HistoryStatus = "paper-filled" | "paper-rejected" | "proposal-created" | "user-approved" | "user-rejected" | "broker-sent" | "broker-accepted" | "broker-rejected" | "cancelled" | "failed" | "live-locked";

export const historyStatusLabel: Record<HistoryStatus, string> = {
  "paper-filled": "모의 체결",
  "paper-rejected": "모의 거절",
  "proposal-created": "제안 생성",
  "user-approved": "사용자 승인",
  "user-rejected": "사용자 거절",
  "broker-sent": "브로커 전송",
  "broker-accepted": "브로커 접수",
  "broker-rejected": "브로커 거절",
  cancelled: "취소",
  failed: "실패",
  "live-locked": "실전 잠금",
};

export type HistoryRow = {
  id: string;
  time: string;
  accountId: string;
  ticker: string;
  action: string;
  mode: AutomationMode;
  amount: string;
  status: HistoryStatus;
  result: string;
  linkedSignal: string;
  linkedSnapshot: string;
};

export const history: HistoryRow[] = [
  { id: "h1", time: "13:22", accountId: "acc-kis-1", ticker: "000660", action: "매도 제안", mode: "manual", amount: "2,880,000원", status: "proposal-created", result: "승인 대기", linkedSignal: "sig-1", linkedSnapshot: "SK하이닉스 추천 전략" },
  { id: "h2", time: "13:05", accountId: "acc-kis-1", ticker: "NVDA", action: "모의 매수", mode: "paper", amount: "$620.14", status: "paper-filled", result: "체결 완료 · 모의", linkedSignal: "sig-2", linkedSnapshot: "NVIDIA AI 추천" },
  { id: "h3", time: "12:48", accountId: "acc-kis-1", ticker: "QLD", action: "알림", mode: "off", amount: "—", status: "live-locked", result: "리스크 규칙 차단", linkedSignal: "sig-3", linkedSnapshot: "포트폴리오 리스크" },
  { id: "h4", time: "11:36", accountId: "acc-kis-1", ticker: "005930", action: "매수 제안", mode: "manual", amount: "500,000원", status: "proposal-created", result: "승인 대기", linkedSignal: "sig-4", linkedSnapshot: "삼성전자 내 투자" },
  { id: "h5", time: "어제 21:11", accountId: "acc-kis-1", ticker: "QQQ", action: "모의 매수", mode: "paper", amount: "$1,204.20", status: "paper-filled", result: "체결 완료 · 모의", linkedSignal: "sig-past-a", linkedSnapshot: "QQQ 관심종목" },
  { id: "h6", time: "어제 18:02", accountId: "acc-kis-1", ticker: "AAPL", action: "실전 매수", mode: "autonomous", amount: "$980.44", status: "live-locked", result: "실전 자동매매 미승인", linkedSignal: "sig-5", linkedSnapshot: "AAPL AI 추천" },
];

export type AuditEvent = {
  id: string;
  time: string;
  actor: string;
  type: string;
  broker?: string;
  account?: string;
  rule?: string;
  signal?: string;
  result: "success" | "warning" | "blocked";
  device: string;
};

export const auditLogs: AuditEvent[] = [
  { id: "a1", time: "13:22:41", actor: "system", type: "signal_generated", broker: "KIS", account: "****-**-1234", rule: "SK하이닉스 트림 규칙", signal: "sig-1", result: "success", device: "server · KR-1" },
  { id: "a2", time: "13:22:44", actor: "system", type: "order_proposed", broker: "KIS", account: "****-**-1234", signal: "sig-1", result: "success", device: "server · KR-1" },
  { id: "a3", time: "12:48:02", actor: "system", type: "live_order_blocked", broker: "KIS", account: "****-**-1234", rule: "포트폴리오 리스크 알림", signal: "sig-3", result: "blocked", device: "server · KR-1" },
  { id: "a4", time: "09:12:03", actor: "jaekim", type: "credential_updated", broker: "KIS", account: "****-**-1234", result: "success", device: "macOS · Safari · 서울" },
  { id: "a5", time: "어제 21:41", actor: "jaekim", type: "automation_enabled", broker: "KIS", account: "****-**-1234", result: "success", device: "iOS · NEXFLOW · 서울" },
  { id: "a6", time: "어제 18:02", actor: "system", type: "live_order_blocked", broker: "KIS", account: "****-**-1234", signal: "sig-5", result: "blocked", device: "server · US-1" },
  { id: "a7", time: "2026.06.20", actor: "jaekim", type: "broker_connected", broker: "KIS", account: "****-**-1234", result: "success", device: "macOS · Safari · 서울" },
  { id: "a8", time: "2026.06.10", actor: "jaekim", type: "kill_switch_deactivated", result: "warning", device: "macOS · Safari · 서울" },
];

export function getBroker(id: BrokerId) { return brokers.find((b) => b.id === id)!; }
export function getAccount(id: string) { return accounts.find((a) => a.id === id); }
