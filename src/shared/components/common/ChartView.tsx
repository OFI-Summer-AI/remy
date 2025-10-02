// components/ChartView.tsx

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useChartView } from "@/shared/hooks/useView";
import { ChartData, QueryHook } from "../../../shared/types";

interface ChartViewProps {
  queryHook: QueryHook<ChartData>;
  type: "line" | "bar" | "area" | "pie";
  title?: string;
  subtitle?: string;
  className?: string;
}

const orangePalette = ["#ff7a00", "#ff9d3d", "#ffb26b", "#ffc69a", "#ffe0c7"];

export function ChartView({ 
  queryHook, 
  type, 
  title, 
  subtitle,
  className = "" 
}: ChartViewProps) {
  // Generic hook - works with any query library
  const { data, isLoading, isError, error, hasNoData } = useChartView(queryHook());

  // Loading state
  if (isLoading) {
    return (
      <div className={`rounded-xl border bg-card p-4 ${className}`}>
        {title && (
          <div className="mb-2 flex items-center justify-between">
            <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
            {subtitle && <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>}
          </div>
        )}
        <div className="h-64 bg-muted/20 rounded animate-pulse"></div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className={`rounded-xl border bg-card p-4 ${className}`}>
        {title && (
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">{title}</h3>
            {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
          </div>
        )}
        <div className="h-64 flex items-center justify-center">
          <p className="text-sm text-destructive">Error loading chart</p>
        </div>
      </div>
    );
  }

  // No data state
  if (hasNoData || !data) {
    return (
      <div className={`rounded-xl border bg-card p-4 ${className}`}>
        {title && (
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">{title}</h3>
            {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
          </div>
        )}
        <div className="h-64 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No data available</p>
        </div>
      </div>
    );
  }

  // Transform data for recharts
  const chartData = data.labels.map((label, index) => {
    const point: any = { name: label };
    data.datasets.forEach((dataset) => {
      point[dataset.label] = dataset.data[index];
    });
    return point;
  });

  // Render chart based on type
  return (
    <div className={`rounded-xl border bg-card p-4 ${className}`}>
      {title && (
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
        </div>
      )}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {type === "line" && (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip />
              {data.datasets.map((dataset, i) => (
                <Line
                  key={i}
                  type="monotone"
                  dataKey={dataset.label}
                  stroke={orangePalette[i % orangePalette.length]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          )}

          {type === "bar" && (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip />
              {data.datasets.map((dataset, i) => (
                <Bar
                  key={i}
                  dataKey={dataset.label}
                  fill={orangePalette[i % orangePalette.length]}
                  radius={[6, 6, 0, 0]}
                />
              ))}
            </BarChart>
          )}

          {type === "area" && (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="orangeFill" x1="0" y1="0" x2="0" y2="100%">
                  <stop offset="5%" stopColor={orangePalette[0]} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={orangePalette[0]} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip />
              {data.datasets.map((dataset, i) => (
                <Area
                  key={i}
                  type="monotone"
                  dataKey={dataset.label}
                  stroke={orangePalette[i % orangePalette.length]}
                  fill="url(#orangeFill)"
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          )}

          {type === "pie" && (
            <PieChart>
              <Tooltip />
              <Pie
                data={chartData}
                dataKey={data.datasets[0]?.label || "value"}
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={orangePalette[i % orangePalette.length]} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}