import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { format, subDays } from "date-fns";
import { Calendar } from "lucide-react";

/* -------------------- Types -------------------- */
interface TimeSeries {
  period: string;
  sales: number;
  projection: number;
}

interface CategoryData {
  category: string;
  amount: number;
}

interface Item {
  name: string;
  units: number;
  revenue: number;
}

/* -------------------- Mock Data -------------------- */
const dailyData: TimeSeries[] = [
  { period: "Mon", sales: 900, projection: 950 },
  { period: "Tue", sales: 1100, projection: 1200 },
  { period: "Wed", sales: 1300, projection: 1280 },
  { period: "Thu", sales: 1000, projection: 1150 },
  { period: "Fri", sales: 1600, projection: 1700 },
  { period: "Sat", sales: 1900, projection: 2000 },
  { period: "Sun", sales: 1400, projection: 1500 },
];

const weeklyData: TimeSeries[] = [
  { period: "W1", sales: 8200, projection: 8500 },
  { period: "W2", sales: 9100, projection: 9300 },
  { period: "W3", sales: 8800, projection: 9000 },
  { period: "W4", sales: 9500, projection: 9800 },
];

const categoryData: CategoryData[] = [
  { category: "Food", amount: 4200 },
  { category: "Drinks", amount: 2800 },
  { category: "Delivery", amount: 2200 },
];

const topItems: Item[] = [
  { name: "Margherita Pizza", units: 45, revenue: 675 },
  { name: "Caesar Salad", units: 38, revenue: 456 },
  { name: "Pasta Carbonara", units: 32, revenue: 512 },
  { name: "House Wine", units: 28, revenue: 336 },
  { name: "Tiramisu", units: 25, revenue: 200 },
];

const bottomItems: Item[] = [
  { name: "Seafood Risotto", units: 3, revenue: 57 },
  { name: "Truffle Pasta", units: 4, revenue: 92 },
  { name: "Lamb Rack", units: 5, revenue: 145 },
  { name: "Oysters", units: 6, revenue: 84 },
  { name: "Caviar Special", units: 2, revenue: 120 },
];

/* -------------------- Component -------------------- */
const SalesForecast: React.FC = () => {
  const orangePalette = ["#ff7a00", "#ff9d3d", "#ffb26b", "#ffc69a", "#ffe0c7"];

  const [showProjection, setShowProjection] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<"daily" | "weekly">("daily");
  const [dateFrom, setDateFrom] = React.useState<Date>(subDays(new Date(), 7));
  const [dateTo, setDateTo] = React.useState<Date>(new Date());

  const currentData = viewMode === "daily" ? dailyData : weeklyData;

  return (
    <section className="p-6 space-y-6">
      <div className="bg-white rounded-2xl shadow-md">
        {/* Header Controls */}
        <div className="flex flex-row items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Sales Chart</h2>
          <div className="flex items-center gap-4">
            {/* Projection Toggle */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Projection</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showProjection}
                  onChange={(e) => setShowProjection(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Daily</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={viewMode === "weekly"}
                  onChange={(e) => setViewMode(e.target.checked ? "weekly" : "daily")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <label className="text-sm text-gray-600">Weekly</label>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Date Range Selector */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm text-gray-600">Date Range:</span>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <Calendar className="w-4 h-4" />
              {dateFrom ? format(dateFrom, "MMM dd") : "From"}
            </button>
            <span className="text-gray-600">to</span>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <Calendar className="w-4 h-4" />
              {dateTo ? format(dateTo, "MMM dd") : "To"}
            </button>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Sales Forecast Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ fill: "#2563eb", strokeWidth: 0, r: 6 }}
                  />
                  {showProjection && (
                    <Line
                      type="monotone"
                      dataKey="projection"
                      stroke="#94a3b8"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      dot={{ fill: "#94a3b8", strokeWidth: 0, r: 4 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Sales by Category - COMPLETELY FIXED */}
            <div className="bg-slate-50 rounded-2xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={categoryData} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="category" 
                      stroke="#64748b" 
                      fontSize={12}
                      tick={{ fill: '#64748b' }}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={12}
                      tick={{ fill: '#64748b' }}
                    />
                    {/* Using multiple Bar components instead of Cell for guaranteed color application */}
                    <Bar dataKey="amount" fill="ff7a00" radius={[6, 6, 0, 0]}>
                      <Cell fill="#ff7a00" /> {/* Food */}
                      <Cell fill="#ff9d3d" /> {/* Drinks */}
                      <Cell fill="#ffb26b" /> {/* Delivery */}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top & Bottom Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Items */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Top 5 Items</h3>
              <div className="space-y-2">
                {topItems.map((item, idx) => (
                  <ItemCard key={item.name} item={item} rank={idx + 1} />
                ))}
              </div>
            </div>

            {/* Bottom Items */}
            <div className="bg-slate-50 rounded-2xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Bottom 5 Items</h3>
              <div className="space-y-2">
                {bottomItems.map((item, idx) => (
                  <ItemCard key={item.name} item={item} rank={idx + 1} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* -------------------- Item Card Component -------------------- */
const ItemCard: React.FC<{ item: Item; rank: number }> = ({ item, rank }) => (
  <div className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
    <div>
      <div className="font-medium text-sm">
        {rank}. {item.name}
      </div>
      <div className="text-xs text-gray-500">{item.units} units</div>
    </div>
    <div className="text-sm font-medium">€{item.revenue}</div>
  </div>
);

export default SalesForecast;