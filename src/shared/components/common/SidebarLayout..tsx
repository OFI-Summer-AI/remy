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
  { to: "/summary", label: "Summary", icon: ReceiptPoundSterling },
  { to: "/calendar", label: "Staff Calendar", icon: CalendarDays },
  { to: "/prediction", label: "Prediction", icon: LineChart },
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
    <div 
      className="flex min-h-screen"
      style={{
        background: `radial-gradient(1200px 600px at 100% 0%, color-mix(in srgb, var(--primary) 10%, transparent), transparent)`,
        backgroundColor: "var(--background)",
      }}
    >
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r p-4 transition-transform md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
        style={{
          backgroundColor: "var(--surface-container-low)",
          borderColor: "var(--outline-variant)",
        }}
      >
        <div className="flex items-center gap-3 px-2 py-1">
          <div 
            className="flex h-10 w-10 items-center justify-center rounded-lg shadow-sm"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--on-primary)",
            }}
          >
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <div>
            <div 
              className="text-lg font-extrabold tracking-tight"
              style={{ color: "var(--on-surface)" }}
            >
              Remy Restaurant
            </div>
            <div 
              className="text-xs"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Cool Restaurant
            </div>
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
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  )
                }
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "var(--surface-container)" : undefined,
                  color: isActive ? "var(--on-surface)" : "var(--on-surface-variant)",
                  borderWidth: isActive ? "1px" : undefined,
                  borderColor: isActive ? "var(--outline-variant)" : undefined,
                })}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  const isActive = target.getAttribute('aria-current') === 'page';
                  if (!isActive) {
                    target.style.backgroundColor = "var(--surface-container)";
                    target.style.color = "var(--on-surface)";
                  }
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  const isActive = target.getAttribute('aria-current') === 'page';
                  if (!isActive) {
                    target.style.backgroundColor = "transparent";
                    target.style.color = "var(--on-surface-variant)";
                  }
                }}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className="h-4 w-4"
                      style={{ color: isActive ? "var(--primary)" : "var(--on-surface-variant)" }}
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
        <header 
          className="sticky top-0 z-30 border-b backdrop-blur"
          style={{
            backgroundColor: "color-mix(in srgb, var(--background) 80%, transparent)",
            borderColor: "var(--outline-variant)",
          }}
        >
          <div className="flex h-14 items-center gap-3 px-4">
            <button
              className="inline-flex items-center justify-center rounded-md border px-2 py-2 md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Open menu"
              style={{
                borderColor: "var(--outline-variant)",
                backgroundColor: "var(--surface-container-low)",
                color: "var(--on-surface)",
              }}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div 
              className="truncate text-sm font-medium"
              style={{ color: "var(--on-surface-variant)" }}
            >
              {activeLabel}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <Search 
                  className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{ color: "var(--on-surface-variant)" }}
                />
                <input
                  placeholder="Buscar..."
                  className="h-9 w-56 rounded-md border pl-8 pr-3 text-sm outline-none ring-0"
                  style={{
                    backgroundColor: "var(--surface-container-low)",
                    borderColor: "var(--outline-variant)",
                    color: "var(--on-surface)",
                  }}
                  onFocus={(e) => {
                    e.target.style.outline = "2px solid";
                    e.target.style.outlineColor = "color-mix(in srgb, var(--primary) 30%, transparent)";
                  }}
                  onBlur={(e) => {
                    e.target.style.outline = "none";
                  }}
                />
              </div>
              <div 
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "var(--primary-container)",
                  color: "var(--primary)",
                }}
              >
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