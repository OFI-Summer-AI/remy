// components/ListView.tsx

import { AlertTriangle } from "lucide-react";
import { useListView } from "@/shared/hooks/useView";
import { ListData, QueryHook } from "@/shared/types";

interface ListViewProps {
  queryHook: QueryHook<ListData>;
  title?: string;
  subtitle?: string;
  className?: string;
  renderIcon?: (item: any) => React.ReactNode;
}

export function ListView({ 
  queryHook, 
  title, 
  subtitle,
  className = "",
  renderIcon
}: ListViewProps) {
  // Generic hook - works with any query library
  const { data, isLoading, isError, error, hasNoData } = useListView(queryHook());

  // Loading state
  if (isLoading) {
    return (
      <div className={`rounded-xl border bg-card p-4 ${className}`}>
        {title && (
          <div className="mb-2 flex items-center justify-between">
            <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
            {subtitle && <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>}
          </div>
        )}
        <ul className="divide-y">
          {[1, 2, 3].map((i) => (
            <li key={i} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
                <div className="space-y-1">
                  <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                </div>
              </div>
              <div className="h-4 bg-muted rounded w-12 animate-pulse"></div>
            </li>
          ))}
        </ul>
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
        <p className="text-sm text-destructive py-4">Error loading data</p>
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
        <p className="text-sm text-muted-foreground py-4">No data available</p>
      </div>
    );
  }

  // Render list
  return (
    <div className={`rounded-xl border bg-card p-4 ${className}`}>
      {title && (
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
        </div>
      )}
      <ul className="divide-y">
        {data.map((item) => (
          <li key={item.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              {renderIcon ? (
                renderIcon(item)
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              )}
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-muted-foreground">{item.subtitle}</div>
              </div>
            </div>
            <div className="text-sm">
              {item.value} {item.unit}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}