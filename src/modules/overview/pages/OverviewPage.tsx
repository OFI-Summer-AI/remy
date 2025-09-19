import { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { cn } from "@/shared/lib/utils";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, ShoppingCart, Users, Utensils } from "lucide-react";

const orangePalette = ["#ff7a00", "#ff9d3d", "#ffb26b", "#ffc69a", "#ffe0c7"]; // brand shades

function StatCard({ title, value, delta, up, icon: Icon }: { title: string; value: string; delta: string; up?: boolean; icon: any }) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <div className="text-sm text-muted-foreground">{title}</div>
        </div>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-md", up ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive")}>
          {up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
        </div>
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight">{value}</div>
      <div className={cn("mt-1 text-xs", up ? "text-primary" : "text-destructive")}>{delta}</div>
    </div>
  );
}

export default function IndexTest() {
  const salesTrend = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        day: `D${i + 1}`,
        sales: Math.round(1200 + Math.sin(i / 2) * 300 + Math.random() * 200),
      })),
    [],
  );

  const categorySales = useMemo(
    () => [
      { name: "Starters", value: 3200 },
      { name: "Main Dishes", value: 8600 },
      { name: "Drinks", value: 5400 },
      { name: "Desserts", value: 2100 },
    ],
    [],
  );

  const channels = useMemo(
    () => [
      { name: "Dine-in", value: 54 },
      { name: "Delivery", value: 28 },
      { name: "Takeaway", value: 18 },
    ],
    [],
  );

  const reservations = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        week: `W${i + 1}`,
        reservations: Math.round(40 + Math.sin(i) * 10 + Math.random() * 8),
      })),
    [],
  );

  const stockAlerts = [
    { item: "Limes", level: "Low", qty: 18 },
    { item: "Aged Tequila", level: "Critical", qty: 3 },
    { item: "Corn Flour", level: "Low", qty: 12 },
    { item: "Espresso Coffee", level: "Low", qty: 20 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Restaurant performance, today and this week.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today's Sales" value="$12,480" delta="+8.4% vs. yesterday" up icon={ShoppingCart} />
        <StatCard title="Customers" value="342" delta="+3.1% vs. last week" up icon={Users} />
        <StatCard title="Ongoing Orders" value="27" delta="-2 pending" up icon={Utensils} />
        <StatCard title="Stock Alerts" value="4" delta="2 critical" icon={AlertTriangle} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="col-span-2 rounded-xl border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Sales Trend (14 days)</h3>
            <span className="text-xs text-muted-foreground">Total $</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="orangeFill" x1="0" y1="0" x2="0" y2="100%">
                    <stop offset="5%" stopColor={orangePalette[0]} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={orangePalette[0]} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ReTooltip cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1 }} />
                <Area type="monotone" dataKey="sales" stroke={orangePalette[0]} fill="url(#orangeFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Sales by Category</h3>
            <span className="text-xs text-muted-foreground">$ last week</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ReTooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}> 
                  {categorySales.map((_, i) => (
                    <Cell key={`c-${i}`} fill={orangePalette[i % orangePalette.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Order Channels</h3>
            <span className="text-xs text-muted-foreground">% distribution</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ReTooltip />
                <Pie data={channels} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4}>
                  {channels.map((_, i) => (
                    <Cell key={i} fill={orangePalette[i % orangePalette.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-span-2 rounded-xl border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Weekly Reservations</h3>
            <span className="text-xs text-muted-foreground">number of reservations</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reservations}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ReTooltip />
                <Line type="monotone" dataKey="reservations" stroke={orangePalette[0]} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Stock Alerts</h3>
            <span className="text-xs text-muted-foreground">items to restock</span>
          </div>
          <ul className="divide-y">
            {stockAlerts.map((a, i) => (
              <li key={i} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">{a.item}</div>
                    <div className="text-xs text-muted-foreground">Level {a.level.toLowerCase()}</div>
                  </div>
                </div>
                <div className="text-sm">{a.qty} u.</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2 rounded-xl border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Recent Activity</h3>
            <span className="text-xs text-muted-foreground">last 24h</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border p-3">
              <div className="text-sm font-medium">Promotions Campaign</div>
              <div className="mt-2 h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{ n: "IG", v: 120 }, { n: "FB", v: 80 }, { n: "TT", v: 60 }]}> 
                    <XAxis dataKey="n" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Bar dataKey="v" radius={[6, 6, 0, 0]} fill={orangePalette[1]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-sm font-medium">Satisfaction (reviews)</div>
              <div className="mt-2 h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[{ n: "M", v: 4.2 }, { n: "T", v: 4.5 }, { n: "W", v: 4.6 }, { n: "Th", v: 4.4 }, { n: "F", v: 4.8 }, { n: "Sa", v: 4.7 }, { n: "Su", v: 4.6 }]}> 
                    <Area type="monotone" dataKey="v" stroke={orangePalette[0]} fill={orangePalette[3]} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
