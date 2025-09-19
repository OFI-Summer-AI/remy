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
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Receipt, 
  DollarSign, 
  CreditCard, 
  Banknote,
  ShoppingCart,
  Tag,
  Package,
  TrendingUp,
  TrendingDown
} from "lucide-react";

const orangePalette = ["#ff7a00", "#ff9d3d", "#ffb26b", "#ffc69a", "#ffe0c7"];

function StatCard({ 
  title, 
  value, 
  delta, 
  up, 
  icon: Icon 
}: { 
  title: string; 
  value: string; 
  delta: string; 
  up?: boolean;
  icon: any;
}) {
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

export default function POSDashboard() {
  const paymentMethods = useMemo(() => [
    { name: "Cash", value: 65 },
    { name: "Credit Card", value: 35 }
  ], []);

  const salesBreakdown = useMemo(() => [
    { category: "Sales", value: 3800 },
    { category: "Discounts", value: 120 },
    { category: "Protocol", value: 180 },
    { category: "Cancellations", value: 45 }
  ], []);

  const cashRegisterData = useMemo(() => [
    { type: "Cash", value: 2100 },
    { type: "Inbound", value: 150 },
    { type: "Outbound", value: 80 },
    { type: "Cancel Receipt", value: 25 }
  ], []);

  const topSalesByTag = useMemo(() => [
    { tag: "Hot", ron: 4000, units: 320 },
    { tag: "Cold", ron: 2800, units: 180 },
    { tag: "Food", ron: 1900, units: 95 },
    { tag: "Snacks", ron: 1200, units: 78 },
    { tag: "Desserts", ron: 800, units: 45 }
  ], []);

  const topSalesByCategory = useMemo(() => [
    { category: "Coffee", ron: 2200, units: 156 },
    { category: "Tea", ron: 1800, units: 134 },
    { category: "Pastries", ron: 1200, units: 89 },
    { category: "Sandwiches", ron: 900, units: 67 },
    { category: "Smoothies", ron: 600, units: 34 }
  ], []);

  const productTrends = useMemo(() => [
    { name: "Extra Syrup", change: 12 },
    { name: "Double Shot", change: 8 },
    { name: "Oat Milk", change: -5 },
    { name: "Decaf Coffee", change: 15 },
    { name: "Sugar Free", change: -3 }
  ], []);

  return (
    <div className="space-y-6 max-w-full">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">POS Dashboard</h1>
        <p className="text-muted-foreground">Sales data are calculated based on your working hours.</p>
        <p className="text-muted-foreground">Current period: <strong>03-03</strong>. <span className="text-primary cursor-pointer">Change period</span></p>
      </div>

      {/* Top Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Sales Yesterday RON" value="6,265.99" delta="59% until 16:45" up icon={DollarSign} />
        <StatCard title="Sales Last Monday RON" value="6,940.98" delta="53% until 16:45" up icon={TrendingUp} />
        <StatCard title="Receipts Today" value="130" delta="81%" up icon={Receipt} />
        <StatCard title="Average Receipt Value" value="28.40 RON" delta="73%" up icon={ShoppingCart} />
      </div>

      {/* Second Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Sales Today Pie Chart */}
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Sales Today RON (03-03)</h3>
          </div>
          <div className="flex items-center justify-center text-3xl font-bold text-orange-500 mb-4">
            3,692.49
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ReTooltip />
                <Pie 
                  data={paymentMethods} 
                  dataKey="value" 
                  nameKey="name" 
                  innerRadius={50} 
                  outerRadius={75}
                  paddingAngle={4}
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#8b5cf6" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-green-500"></div>
              <span>Cash</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-purple-500"></div>
              <span>Credit Card</span>
            </div>
          </div>
        </div>

        {/* Sales Breakdown */}
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Sales, Discounts, Protocol, Cancellations</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesBreakdown} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ReTooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {salesBreakdown.map((_, i) => (
                    <Cell key={`c-${i}`} fill={orangePalette[i % orangePalette.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cash Register */}
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Cash Register</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Total: 1,172,342.70 RON</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashRegisterData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="type" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ReTooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={orangePalette[1]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Product Trends */}
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Product Trends</h3>
          </div>
          <div className="space-y-2">
            {productTrends.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <div className={cn("p-1 rounded", item.change > 0 ? "bg-green-100" : "bg-red-100")}>
                    {item.change > 0 ? (
                      <TrendingUp className={cn("h-3 w-3", "text-green-600")} />
                    ) : (
                      <TrendingDown className={cn("h-3 w-3", "text-red-600")} />
                    )}
                  </div>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <span className={cn("text-xs", item.change > 0 ? "text-green-600" : "text-red-600")}>
                  {item.change > 0 ? '+' : ''}{item.change}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 Sales by Tag */}
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Top 5 Sales by Tag</h3>
          </div>
          <div className="flex items-center gap-4 mb-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
              <span>RON</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-green-500"></div>
              <span>Units</span>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSalesByTag} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="tag" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ReTooltip />
                <Bar dataKey="ron" fill="#3b82f6" />
                <Bar dataKey="units" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Sales by Category */}
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Top 5 Sales by Category</h3>
          </div>
          <div className="flex items-center gap-4 mb-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
              <span>RON</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-green-500"></div>
              <span>Units</span>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSalesByCategory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ReTooltip />
                <Bar dataKey="ron" fill="#3b82f6" />
                <Bar dataKey="units" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}