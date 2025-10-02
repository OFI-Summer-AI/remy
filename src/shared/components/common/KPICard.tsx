// components/KPICard.tsx

import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { IconType, KPIData } from "../../../shared/types";
import { iconMap } from "./IconMap"; // lo separamos para reusar

interface KPICardProps {
  kpi: KPIData;
  variant?: "full" | "compact";
}

export function KPICard({ kpi, variant = "full" }: KPICardProps) {
  const Icon = iconMap[kpi.icon] || AlertTriangle;
  const TrendIcon = kpi.up ? TrendingUp : TrendingDown;

  if (variant === "compact") {
    return (
      <div
        key={kpi.id}
        className="rounded-xl border bg-card p-3 hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground truncate mb-1">
              {kpi.title}
            </div>
            <div className="text-xl font-bold tracking-tight truncate">
              {kpi.value}
            </div>
          </div>
          <div className="flex-shrink-0">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        {kpi.delta && (
          <div
            className={`flex items-center gap-1 mt-1 text-xs ${
              kpi.up
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            <TrendIcon className="h-3 w-3" />
            <span className="truncate">{kpi.delta}</span>
          </div>
        )}
      </div>
    );
  }

  // Full variant
  return (
    <div
      key={kpi.id}
      className="rounded-xl border bg-card p-6 hover:bg-accent/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="text-sm text-muted-foreground mb-1">{kpi.title}</div>
          <div className="text-2xl font-bold tracking-tight mb-2">
            {kpi.value}
          </div>
          {kpi.delta && (
            <div
              className={`flex items-center gap-1.5 text-sm ${
                kpi.up
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              <TrendIcon className="h-4 w-4" />
              <span>{kpi.delta}</span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
