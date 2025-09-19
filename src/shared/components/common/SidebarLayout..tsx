import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  LineChart,
  AlertTriangle,
  TableProperties,
  Percent,
  MessageSquare,
  Menu,
  X,
  UtensilsCrossed,
  Search,
  ReceiptPoundSterling
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

const navItems = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/summary", label: "Sumnmary", icon:  ReceiptPoundSterling},
  { to: "/calendar", label: "Stafff Calendar", icon: CalendarDays },
  { to: "/sales", label: "Sales Chart", icon: LineChart },
  { to: "/stock", label: "Stock Alerts", icon: AlertTriangle },
  { to: "/tables", label: "Table View", icon: TableProperties },
  { to: "/promotions", label: "Promotions", icon: Percent },
  { to: "/social", label: "Reviews and Social", icon: MessageSquare },
] as const;

export default function SidebarLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const activeLabel = useMemo(() => {
    const current = navItems.find((n) => n.to === location.pathname);
    return current?.label ?? "Overview";
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-[radial-gradient(1200px_600px_at_100%_0%,hsl(var(--primary)/0.10),transparent)]">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r bg-sidebar p-4 transition-transform md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold tracking-tight">Remy Restaurant</div>
            <div className="text-xs text-muted-foreground">Cool Restaurant</div>
          </div>
        </div>
        <nav className="mt-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground ring-1 ring-sidebar-ring"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
        <div className="mt-auto hidden md:block" />
      </aside>

      {/* Content */}
      <div className="flex w-full flex-col md:pl-72">
        <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center gap-3 px-4">
            <button
              className="inline-flex items-center justify-center rounded-md border px-2 py-2 md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Open menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="truncate text-sm font-medium text-muted-foreground">{activeLabel}</div>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Buscar..."
                  className="h-9 w-56 rounded-md border bg-background pl-8 pr-3 text-sm outline-none ring-0 placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-primary/30"
                />
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UtensilsCrossed className="h-4 w-4" />
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
