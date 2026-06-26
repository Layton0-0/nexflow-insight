import { type ReactNode, useState } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
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
  Sun,
  Moon,
  Monitor,
  Flag,
  Globe,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme, type Theme } from "@/hooks/use-theme";

const NAV = [
  { to: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { to: "/picks/kr", label: "국내 후보", icon: Flag },
  { to: "/picks/us", label: "미국 후보", icon: Globe },
  { to: "/themes", label: "테마 분석", icon: Sparkles },
  { to: "/search", label: "종목 검색", icon: Search },
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
      <div className="relative h-8 w-8 rounded-[10px] bg-primary grid place-items-center">
        <span className="text-[11px] font-bold text-primary-foreground tracking-tight">N</span>
      </div>
      <div className="leading-tight">
        <div className="text-[15px] font-bold tracking-tight text-foreground">NEXFLOW</div>
        <div className="text-[10px] text-muted-foreground hidden lg:block">Insight</div>
      </div>
    </Link>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const opts: { value: Theme; icon: typeof Sun; label: string }[] = [
    { value: "light", icon: Sun, label: "라이트" },
    { value: "dark", icon: Moon, label: "다크" },
    { value: "system", icon: Monitor, label: "시스템" },
  ];
  return (
    <div
      role="group"
      aria-label="테마 전환"
      className="hidden sm:flex items-center gap-0.5 p-0.5 rounded-lg bg-muted border border-border"
    >
      {opts.map((o) => {
        const Icon = o.icon;
        const active = theme === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => setTheme(o.value)}
            aria-label={o.label}
            aria-pressed={active}
            className={cn(
              "h-7 w-7 grid place-items-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}

function ThemeToggleMobile() {
  const { resolvedTheme, setTheme } = useTheme();
  const next = resolvedTheme === "dark" ? "light" : "dark";
  const Icon = resolvedTheme === "dark" ? Sun : Moon;
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label="테마 전환"
      className="sm:hidden h-9 w-9 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-[232px] flex-col border-r border-border bg-sidebar z-40">
      <div className="px-5 h-16 flex items-center border-b border-border">
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
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] transition-colors relative group",
                active
                  ? "bg-sidebar-accent text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />
              )}
              <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="rounded-xl border border-border bg-muted/50 p-3 text-[11px] text-muted-foreground leading-relaxed">
          <div className="text-foreground text-xs font-semibold mb-1">데이터 업데이트</div>
          실시간 · 15분 지연
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
                active ? "text-primary font-medium" : "text-muted-foreground",
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
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="h-full px-4 md:px-6 flex items-center gap-3">
        <div className="md:hidden">
          <Brand />
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: "/search" })}
          className="hidden md:flex items-center flex-1 max-w-md relative h-10 pl-9 pr-3 rounded-lg bg-muted border border-border text-sm text-muted-foreground/90 hover:text-foreground hover:border-primary/40 transition-colors text-left"
        >
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          종목명 또는 티커 검색
        </button>
        <div className="flex-1 md:hidden" />
        <div className="hidden lg:flex items-center gap-0.5 p-0.5 rounded-lg bg-muted border border-border">
          {(["국내", "미국", "전체"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMarket(m)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs transition-colors",
                market === m
                  ? "bg-card text-foreground shadow-sm font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="hidden xl:flex items-center gap-0.5 p-0.5 rounded-lg bg-muted border border-border">
          {(["단기", "1개월", "3개월", "장기"] as const).map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs transition-colors",
                horizon === h
                  ? "bg-card text-foreground shadow-sm font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {h}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center text-xs text-muted-foreground tabular ml-auto md:ml-0">
          2026.06.24 · 13:40 KST
        </div>
        <ThemeToggle />
        <ThemeToggleMobile />
        <button className="relative h-9 w-9 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
        <button className="h-9 w-9 rounded-full bg-secondary text-secondary-foreground grid place-items-center text-xs font-semibold border border-border">
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