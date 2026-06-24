import { type ReactNode, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Star,
  LineChart,
  Wallet,
  GitBranch,
  Bell,
  FileText,
  Settings,
  Search,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { to: "/watchlist", label: "관심종목", icon: Star },
  { to: "/analysis", label: "종목 분석", icon: LineChart },
  { to: "/portfolio", label: "포트폴리오", icon: Wallet },
  { to: "/scenario", label: "시나리오", icon: GitBranch },
  { to: "/alerts", label: "알림", icon: Bell },
  { to: "/reports", label: "리포트", icon: FileText },
  { to: "/settings", label: "설정", icon: Settings },
] as const;

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--cyan-accent)] to-[var(--violet-accent)] shadow-[0_0_20px_-4px_var(--cyan-accent)] grid place-items-center">
        <span className="text-[10px] font-black text-[oklch(0.12_0.03_270)] tracking-tighter">NX</span>
      </div>
      <div className="leading-tight">
        <div className="text-sm font-black tracking-[0.18em] text-foreground">NEXFLOW</div>
        <div className="text-[9px] text-muted-foreground tracking-wider hidden lg:block">SCENARIO INTELLIGENCE</div>
      </div>
    </Link>
  );
}

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-[232px] flex-col border-r border-border bg-sidebar/80 backdrop-blur-xl z-40">
      <div className="px-5 h-16 flex items-center border-b border-border/60">
        <Brand />
      </div>
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all relative group",
                active
                  ? "bg-[color-mix(in_oklab,var(--cyan-accent)_12%,transparent)] text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-[var(--cyan-accent)] shadow-[0_0_10px_var(--cyan-accent)]" />
              )}
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border/60">
        <div className="glass rounded-xl p-3 text-[11px] text-muted-foreground leading-relaxed">
          <div className="text-foreground text-xs font-semibold mb-1">데이터 업데이트</div>
          실시간 (15분 지연)
        </div>
      </div>
    </aside>
  );
}

function BottomNav({ pathname }: { pathname: string }) {
  const items = NAV.slice(0, 5);
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border bg-sidebar/95 backdrop-blur-xl">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] transition-colors",
                active ? "text-[var(--cyan-accent)]" : "text-muted-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function Header() {
  const [market, setMarket] = useState<"국내" | "미국" | "전체">("전체");
  const [horizon, setHorizon] = useState<"단기" | "1개월" | "3개월" | "장기">("1개월");

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="h-full px-4 md:px-6 flex items-center gap-3">
        <div className="md:hidden">
          <Brand />
        </div>
        <div className="hidden md:flex items-center flex-1 max-w-md relative">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="종목명 또는 티커 검색"
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-muted/40 border border-border/60 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-[var(--cyan-accent)]/60 focus:ring-1 focus:ring-[var(--cyan-accent)]/40"
          />
        </div>
        <div className="flex-1 md:hidden" />
        <div className="hidden lg:flex items-center gap-1 p-1 rounded-lg bg-muted/40 border border-border/40">
          {(["국내", "미국", "전체"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMarket(m)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs transition-colors",
                market === m
                  ? "bg-[var(--surface-3)] text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="hidden xl:flex items-center gap-1 p-1 rounded-lg bg-muted/40 border border-border/40">
          {(["단기", "1개월", "3개월", "장기"] as const).map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs transition-colors",
                horizon === h
                  ? "bg-[var(--surface-3)] text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {h}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center text-xs text-muted-foreground tabular-nums ml-auto md:ml-0">
          2026.06.24 · 13:40 KST
        </div>
        <button className="relative h-9 w-9 grid place-items-center rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--cyan-accent)] shadow-[0_0_8px_var(--cyan-accent)]" />
        </button>
        <button className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--violet-accent)] to-[var(--cyan-accent)] text-[oklch(0.12_0.03_270)] grid place-items-center text-xs font-bold">
          JK
        </button>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen">
      <Sidebar pathname={pathname} />
      <div className="md:pl-[232px]">
        <Header />
        <main className="px-4 md:px-6 py-6 pb-24 md:pb-10 max-w-[1600px] mx-auto">{children}</main>
      </div>
      <BottomNav pathname={pathname} />
    </div>
  );
}

export { Brand };