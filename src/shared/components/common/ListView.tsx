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
  hideHeader?: boolean;
}

export function ListView({ 
  queryHook, 
  title, 
  subtitle,
  className = "",
  renderIcon,
  hideHeader = false
}: ListViewProps) {
  // Generic hook - works with any query library
  const { data, isLoading, isError, error, hasNoData } = useListView(queryHook());

  // Loading state
  if (isLoading) {
    if (hideHeader) {
      return (
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
      );
    }

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
    if (hideHeader) {
      return <p className="text-sm text-destructive py-4">Error loading data</p>;
    }

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
    if (hideHeader) {
      return <p className="text-sm text-muted-foreground py-4">No data available</p>;
    }

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

  // Render list content
  const listContent = (
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
  );

  // Without header (for embedded use with external scroll)
  if (hideHeader) {
    return listContent;
  }

  // With header and container
  return (
    <div className={`rounded-xl border bg-card p-4 ${className}`}>
      {title && (
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
        </div>
      )}
      {listContent}
    </div>
  );
}