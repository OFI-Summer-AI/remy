// components/KPIGridView.tsx

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
  const { data, isLoading, isError, error, hasNoData } = useKPIsView(
    queryHook()
  );

  if (isLoading) {
    return (
      <div className={getGridClasses(columns)}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border bg-card p-4">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-8 bg-muted rounded w-32"></div>
              {variant === "full" && (
                <div className="h-3 bg-muted rounded w-20"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Error Loading KPIs
          </div>
          <div className="text-xs text-destructive">{error}</div>
        </div>
      </div>
    );
  }

  if (hasNoData || !data) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <div className="text-sm text-muted-foreground">No KPI data available</div>
      </div>
    );
  }

  return (
    <div className={getGridClasses(columns)}>
      {data.map((kpi) => (
        <KPICard key={kpi.id} kpi={kpi} variant={variant} />
      ))}
    </div>
  );
}
