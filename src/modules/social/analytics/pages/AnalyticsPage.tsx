// pages/ReviewsPage.tsx - ACTUALIZADO

import {
  useGetEmployeeSummaryQuery,
  useGetItemSummaryQuery,
  useGetItemTrendOptionsQuery,
  useGetItemTrendDataQuery,
  useGetEmployeeTrendOptionsQuery,
  useGetEmployeeTrendDataQuery,
} from "../store/analyticsApi";
import { ChartView } from "@/shared/components/common/ChartView";
import { FilterableChartView } from "@/shared/components/common/FilterableChartView";

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground">Employee and item reviews summary.</p>
      </div>

      {/* Static Charts - Sin filtros */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartView
          queryHook={useGetEmployeeSummaryQuery}
          type="bar"
          title="Employee Summary"
          subtitle="performance reviews"
        />
        <ChartView
          queryHook={useGetItemSummaryQuery}
          type="bar"
          title="Item Summary"
          subtitle="product reviews"
        />
      </div>

      {/* Filterable Charts - Con selección de filtro */}
      <div className="grid gap-4 lg:grid-cols-2">
        <FilterableChartView
          useOptionsQuery={useGetItemTrendOptionsQuery}
          useDataQuery={(itemId) => {
            // Hook condicionalmente basado en si hay un ID seleccionado
            const skip = !itemId;
            return useGetItemTrendDataQuery(itemId || '', { skip });
          }}
          type="line"
          title="Item Trend"
          subtitle="over time"
        />
        
        <FilterableChartView
          useOptionsQuery={useGetEmployeeTrendOptionsQuery}
          useDataQuery={(employeeId) => {
            // Hook condicionalmente basado en si hay un ID seleccionado
            const skip = !employeeId;
            return useGetEmployeeTrendDataQuery(employeeId || '', { skip });
          }}
          type="line"
          title="Employee Trend"
          subtitle="performance over time"
        />
      </div>
    </div>
  );
}