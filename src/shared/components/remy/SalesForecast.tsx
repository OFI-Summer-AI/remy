import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { format, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/components/ui/chart";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";
const dailyData = [{
  period: "Mon",
  sales: 900,
  projection: 950
}, {
  period: "Tue",
  sales: 1100,
  projection: 1200
}, {
  period: "Wed",
  sales: 1300,
  projection: 1280
}, {
  period: "Thu",
  sales: 1000,
  projection: 1150
}, {
  period: "Fri",
  sales: 1600,
  projection: 1700
}, {
  period: "Sat",
  sales: 1900,
  projection: 2000
}, {
  period: "Sun",
  sales: 1400,
  projection: 1500
}];
const weeklyData = [{
  period: "W1",
  sales: 8200,
  projection: 8500
}, {
  period: "W2",
  sales: 9100,
  projection: 9300
}, {
  period: "W3",
  sales: 8800,
  projection: 9000
}, {
  period: "W4",
  sales: 9500,
  projection: 9800
}];
const categoryData = [{
  category: "Food",
  amount: 4200
}, {
  category: "Drinks",
  amount: 2800
}, {
  category: "Delivery",
  amount: 2200
}];
const topItems = [{
  name: "Margherita Pizza",
  units: 45,
  revenue: 675
}, {
  name: "Caesar Salad",
  units: 38,
  revenue: 456
}, {
  name: "Pasta Carbonara",
  units: 32,
  revenue: 512
}, {
  name: "House Wine",
  units: 28,
  revenue: 336
}, {
  name: "Tiramisu",
  units: 25,
  revenue: 200
}];
const bottomItems = [{
  name: "Seafood Risotto",
  units: 3,
  revenue: 57
}, {
  name: "Truffle Pasta",
  units: 4,
  revenue: 92
}, {
  name: "Lamb Rack",
  units: 5,
  revenue: 145
}, {
  name: "Oysters",
  units: 6,
  revenue: 84
}, {
  name: "Caviar Special",
  units: 2,
  revenue: 120
}];
const SalesForecast: React.FC = () => {
  const [showProjection, setShowProjection] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<"daily" | "weekly">("daily");
  const [dateFrom, setDateFrom] = React.useState<Date>(subDays(new Date(), 7));
  const [dateTo, setDateTo] = React.useState<Date>(new Date());
  const currentData = viewMode === "daily" ? dailyData : weeklyData;
  return <section aria-label="Sales Forecast Chart">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Sales Chart</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="toggle-proj" className="text-sm text-muted-foreground">
                Projection
              </Label>
              <Switch id="toggle-proj" checked={showProjection} onCheckedChange={setShowProjection} />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">View</Label>
              <Switch checked={viewMode === "weekly"} onCheckedChange={checked => setViewMode(checked ? "weekly" : "daily")} />
              <Label className="text-sm text-muted-foreground">Weekly</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Date Range:</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-auto justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "MMM dd") : "From"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50 bg-popover" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
              <span className="text-muted-foreground">to</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-auto justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "MMM dd") : "To"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50 bg-popover" align="start">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div>
              <ChartContainer config={{
              sales: {
                label: "Sales",
                color: "hsl(var(--primary))"
              },
              projection: {
                label: "Projection",
                color: "hsl(var(--accent))"
              }
            }} className="h-64 md:h-72">
                <ResponsiveContainer>
                  <LineChart data={currentData} margin={{
                  left: 8,
                  right: 8,
                  top: 8,
                  bottom: 8
                }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="sales" stroke="var(--color-sales)" strokeWidth={2} dot={false} />
                    {showProjection && <Line type="monotone" dataKey="projection" stroke="var(--color-projection)" strokeDasharray="5 5" strokeWidth={2} dot={false} />}
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="bg-slate-50">
              <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
              <ChartContainer config={{
              amount: {
                label: "Revenue",
                color: "hsl(var(--secondary))"
              }
            }} className="h-64 md:h-72">
                <ResponsiveContainer>
                  <BarChart data={categoryData} margin={{
                  left: 8,
                  right: 8,
                  top: 8,
                  bottom: 8
                }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="amount" fill="var(--color-amount)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Top 5 Items</h3>
              <div className="space-y-2">
                {topItems.map((item, idx) => <div key={item.name} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                    <div>
                      <div className="font-medium text-sm">{idx + 1}. {item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.units} units</div>
                    </div>
                    <div className="text-sm font-medium">€{item.revenue}</div>
                  </div>)}
              </div>
            </div>

            <div className="bg-slate-50">
              <h3 className="text-lg font-semibold mb-3">Bottom 5 Items</h3>
              <div className="space-y-2">
                {bottomItems.map((item, idx) => <div key={item.name} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                    <div>
                      <div className="font-medium text-sm">{idx + 1}. {item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.units} units</div>
                    </div>
                    <div className="text-sm font-medium">€{item.revenue}</div>
                  </div>)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>;
};
export default SalesForecast;