import { useKPIsView } from "../../../shared/hooks/useView";
import { KPIData, QueryHook } from "../../../shared/types";
import { KPICard } from "./KPICard";

interface KPIGridViewProps {
  queryHook: QueryHook<KPIData[]>;
  variant?: "full" | "compact";
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

const getGridClasses = (columns?: KPIGridViewProps["columns"]) => {
  const sm = columns?.sm || 2;
  const md = columns?.md || 2;
  const lg = columns?.lg || 4;
  const xl = columns?.xl || 4;

  return `grid gap-4 sm:grid-cols-${sm} md:grid-cols-${md} lg:grid-cols-${lg} xl:grid-cols-${xl}`;
};

export function KPIGridView({
  queryHook,
  variant = "full",
  columns,
}: KPIGridViewProps) {
  const { data, isLoading, isError, error, hasNoData } = useKPIsView(queryHook());

  // 🔹 Loading state
  if (isLoading) {
    return (
      <div className={getGridClasses(columns)}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border p-4"
            style={{
              backgroundColor: "var(--color-surface-container-low)",
              borderColor: "var(--color-outline-variant)",
            }}
          >
            <div className="animate-pulse space-y-2">
              <div
                className="h-4 rounded w-24"
                style={{ backgroundColor: "var(--color-surface-container-high)" }}
              ></div>
              <div
                className="h-8 rounded w-32"
                style={{ backgroundColor: "var(--color-surface-container-high)" }}
              ></div>
              {variant === "full" && (
                <div
                  className="h-3 rounded w-20"
                  style={{ backgroundColor: "var(--color-surface-container-high)" }}
                ></div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 🔹 Error state
  if (isError) {
    return (
      <div
        className="rounded-xl border p-6"
        style={{
          backgroundColor: "var(--color-surface-container-low)",
          borderColor: "var(--color-outline-variant)",
        }}
      >
        <div className="space-y-2">
          <div
            className="text-sm font-medium"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Error Loading KPIs
          </div>
          <div
            className="text-xs"
            style={{ color: "var(--color-error)" }}
          >
            {String(error)}
          </div>
        </div>
      </div>
    );
  }

  // 🔹 No data state
  if (hasNoData || !data) {
    return (
      <div
        className="rounded-xl border p-6"
        style={{
          backgroundColor: "var(--color-surface-container-low)",
          borderColor: "var(--color-outline-variant)",
          color: "var(--color-on-surface-variant)",
        }}
      >
        <div className="text-sm">No KPI data available</div>
      </div>
    );
  }

  // 🔹 Success state (loaded data)
  return (
    <div className={getGridClasses(columns)}>
      {data.map((kpi) => (
        <KPICard key={kpi.id} kpi={kpi} variant={variant} />
      ))}
    </div>
  );
}
