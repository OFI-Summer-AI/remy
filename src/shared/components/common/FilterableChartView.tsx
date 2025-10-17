// components/FilterableChartView.tsx

import { useState } from "react";
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
import { useFilterableChartView } from "@/shared/hooks/useFilterableChartView";
import { FilterOptionsData, ChartData } from "../../../shared/types";

interface FilterableChartViewProps {
  // Query hooks para opciones y datos
  useOptionsQuery: () => {
    data: FilterOptionsData | undefined;
    isLoading: boolean;
    isError: boolean;
    error: any;
  };
  useDataQuery: (id: string | null) => {
    data: ChartData | undefined;
    isLoading: boolean;
    isError: boolean;
    error: any;
  };
  type: "line" | "bar" | "area" | "pie";
  title?: string;
  subtitle?: string;
  className?: string;
}

export function FilterableChartView({
  useOptionsQuery,
  useDataQuery,
  type,
  title,
  subtitle,
  className = "",
}: FilterableChartViewProps) {
  // State local para selectedFilterId
  const [selectedFilterId, setSelectedFilterId] = useState<string | null>(null);
  
  const optionsQuery = useOptionsQuery();
  const dataQuery = useDataQuery(selectedFilterId);
  
  const {
    data,
    isLoading,
    isError,
    error,
    hasNoData,
    filterOptions,
    isInitialState,
  } = useFilterableChartView({
    optionsQuery,
    dataQuery,
    selectedFilterId,
  });

  // 🎨 Chart colors from CSS variables
  const chartColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--chart-6)",
    "var(--chart-7)",
    "var(--chart-8)",
    "var(--chart-9)",
    "var(--chart-10)",
  ];

  // Helper to get computed color value
  const getColor = (cssVar: string) => {
    if (typeof window !== "undefined") {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(cssVar.replace("var(", "").replace(")", ""))
        .trim();
    }
    return cssVar;
  };

  // 🌀 Loading state
  if (isLoading) {
    return (
      <div
        className={`rounded-xl border p-4 ${className}`}
        style={{
          backgroundColor: "var(--surface-container-low)",
          borderColor: "var(--outline-variant)",
        }}
      >
        {title && (
          <div className="mb-2 flex items-center justify-between">
            <div
              className="h-5 rounded w-32 animate-pulse"
              style={{ backgroundColor: "var(--surface-container-high)" }}
            ></div>
            {subtitle && (
              <div
                className="h-3 rounded w-20 animate-pulse"
                style={{ backgroundColor: "var(--surface-container-high)" }}
              ></div>
            )}
          </div>
        )}
        <div
          className="h-64 rounded animate-pulse"
          style={{ backgroundColor: "var(--surface-container)" }}
        ></div>
      </div>
    );
  }

  // ❌ Error state
  if (isError) {
    return (
      <div
        className={`rounded-xl border p-4 ${className}`}
        style={{
          backgroundColor: "var(--surface-container-low)",
          borderColor: "var(--outline-variant)",
        }}
      >
        {title && (
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold" style={{ color: "var(--on-surface)" }}>
              {title}
            </h3>
            {subtitle && (
              <span className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
                {subtitle}
              </span>
            )}
          </div>
        )}
        <div className="h-64 flex items-center justify-center">
          <div className="space-y-2 text-center">
            <p className="text-sm font-medium" style={{ color: "var(--on-surface-variant)" }}>
              Error Loading Chart
            </p>
            <p className="text-xs" style={{ color: "var(--error)" }}>
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 🔍 Initial state - Show filter selection
  if (isInitialState) {
    return (
      <div
        className={`rounded-xl border p-4 ${className}`}
        style={{
          backgroundColor: "var(--surface-container-low)",
          borderColor: "var(--outline-variant)",
        }}
      >
        {title && (
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold" style={{ color: "var(--on-surface)" }}>
              {title}
            </h3>
            {subtitle && (
              <span className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
                {subtitle}
              </span>
            )}
          </div>
        )}
        <div className="h-64 flex items-center justify-center">
          {hasNoData ? (
            <p className="text-sm" style={{ color: "var(--on-surface-variant)" }}>
              No filter options available
            </p>
          ) : (
            <div className="space-y-4 w-full max-w-sm">
              <div className="text-center space-y-2">
                <p className="text-sm font-medium" style={{ color: "var(--on-surface)" }}>
                  Select a filter to view chart
                </p>
                <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
                  Choose from the available options below
                </p>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {filterOptions?.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedFilterId(option.id)}
                    className="w-full px-4 py-2 text-sm text-left rounded-lg transition-colors"
                    style={{
                      backgroundColor: "var(--surface-container)",
                      color: "var(--on-surface)",
                      border: "1px solid var(--outline-variant)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--surface-container-high)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--surface-container)";
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 🚫 No data state (after filter selected)
  if (hasNoData || !data) {
    return (
      <div
        className={`rounded-xl border p-4 ${className}`}
        style={{
          backgroundColor: "var(--surface-container-low)",
          borderColor: "var(--outline-variant)",
        }}
      >
        {title && (
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold" style={{ color: "var(--on-surface)" }}>
              {title}
            </h3>
            {subtitle && (
              <span className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
                {subtitle}
              </span>
            )}
          </div>
        )}
        <div className="h-64 flex flex-col items-center justify-center space-y-3">
          <p className="text-sm" style={{ color: "var(--on-surface-variant)" }}>
            No data available for selected filter
          </p>
          <button
            onClick={() => setSelectedFilterId(null)}
            className="px-4 py-2 text-sm rounded-lg transition-colors"
            style={{
              backgroundColor: "var(--surface-container)",
              color: "var(--primary)",
              border: "1px solid var(--outline-variant)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--surface-container-high)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--surface-container)";
            }}
          >
            Change filter
          </button>
        </div>
      </div>
    );
  }

  // ✅ Prepare chart data for Recharts
  const chartData = data.labels.map((label, index) => {
    const point: Record<string, any> = { name: label };
    data.datasets.forEach((dataset) => {
      point[dataset.label] = dataset.data[index];
    });
    return point;
  });

  // Get selected filter label
  const selectedFilterLabel = filterOptions?.find(opt => opt.id === selectedFilterId)?.label;

  // ✅ Render chart by type
  const renderChart = () => {
    const axisColor = getColor("var(--on-surface-variant)");
    const gridColor = getColor("var(--outline-variant)");

    switch (type) {
      case "line":
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={axisColor} fontSize={12} />
            <YAxis stroke={axisColor} fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: getColor("var(--surface-container)"),
                borderColor: getColor("var(--outline-variant)"),
                color: getColor("var(--on-surface)"),
                borderRadius: "0.5rem",
              }}
            />
            {data.datasets.map((dataset, i) => (
              <Line
                key={i}
                type="monotone"
                dataKey={dataset.label}
                stroke={getColor(chartColors[i % chartColors.length])}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        );

      case "bar":
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={axisColor} fontSize={12} />
            <YAxis stroke={axisColor} fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: getColor("var(--surface-container)"),
                borderColor: getColor("var(--outline-variant)"),
                color: getColor("var(--on-surface)"),
                borderRadius: "0.5rem",
              }}
            />
            {data.datasets.map((dataset, i) => (
              <Bar
                key={i}
                dataKey={dataset.label}
                fill={getColor(chartColors[i % chartColors.length])}
                radius={[6, 6, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case "area":
        return (
          <AreaChart data={chartData}>
            <defs>
              {data.datasets.map((_, i) => (
                <linearGradient key={i} id={`chartFill${i}`} x1="0" y1="0" x2="0" y2="100%">
                  <stop
                    offset="5%"
                    stopColor={getColor(chartColors[i % chartColors.length])}
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor={getColor(chartColors[i % chartColors.length])}
                    stopOpacity={0.02}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={axisColor} fontSize={12} />
            <YAxis stroke={axisColor} fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: getColor("var(--surface-container)"),
                borderColor: getColor("var(--outline-variant)"),
                color: getColor("var(--on-surface)"),
                borderRadius: "0.5rem",
              }}
            />
            {data.datasets.map((dataset, i) => (
              <Area
                key={i}
                type="monotone"
                dataKey={dataset.label}
                stroke={getColor(chartColors[i % chartColors.length])}
                fill={`url(#chartFill${i})`}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        );

      case "pie":
        return (
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: getColor("var(--surface-container)"),
                borderColor: getColor("var(--outline-variant)"),
                color: getColor("var(--on-surface)"),
                borderRadius: "0.5rem",
              }}
            />
            <Pie
              data={chartData}
              dataKey={data.datasets[0]?.label || "value"}
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={getColor(chartColors[i % chartColors.length])} />
              ))}
            </Pie>
          </PieChart>
        );

      default:
        return null;
    }
  };

  // 🎯 Final Render - Chart with data
  return (
    <div
      className={`rounded-xl border p-4 ${className}`}
      style={{
        backgroundColor: "var(--surface-container-low)",
        borderColor: "var(--outline-variant)",
      }}
    >
      {title && (
        <div className="mb-2 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold" style={{ color: "var(--on-surface)" }}>
              {title}
            </h3>
            {selectedFilterLabel && (
              <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
                Filter: {selectedFilterLabel}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {subtitle && (
              <span className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
                {subtitle}
              </span>
            )}
            <button
              onClick={() => setSelectedFilterId(null)}
              className="px-3 py-1 text-xs rounded transition-colors"
              style={{
                backgroundColor: "var(--surface-container)",
                color: "var(--primary)",
                border: "1px solid var(--outline-variant)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--surface-container-high)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--surface-container)";
              }}
            >
              Change
            </button>
          </div>
        </div>
      )}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}