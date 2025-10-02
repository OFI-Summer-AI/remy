// pages/POSDashboard.tsx - CORREGIDO

import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { KPIGridView } from "@/shared/components/common/KPIGridView";
import { ChartView } from "@/shared/components/common/ChartView";
import { ListView } from "@/shared/components/common/ListView";
import {
  useGetPOSKPIsQuery,
  useGetPaymentMethodsQuery,
  useGetSalesBreakdownQuery,
  useGetCashRegisterQuery,
  useGetTopSalesByTagQuery,
  useGetTopSalesByCategoryQuery,
  useGetProductTrendsQuery,
} from "../store/posApi";

export default function POSDashboard() {
  return (
    <div className="space-y-6 max-w-full">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">POS Dashboard</h1>
        <p className="text-muted-foreground">Sales data are calculated based on your working hours.</p>
        <p className="text-muted-foreground">
          Current period: <strong>03-03</strong>. 
          <span className="text-primary cursor-pointer"> Change period</span>
        </p>
      </div>

      {/* Top Stats Row - KPIs */}
      <KPIGridView queryHook={useGetPOSKPIsQuery} variant="full" />

      {/* Second Row - Sales Overview */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Sales Today Pie Chart */}
        <ChartView
          queryHook={useGetPaymentMethodsQuery}
          type="pie"
          title="Sales Today RON (03-03)"
        />

        {/* Sales Breakdown */}
        <ChartView
          queryHook={useGetSalesBreakdownQuery}
          type="bar"
          title="Sales, Discounts, Protocol, Cancellations"
        />

        {/* Cash Register */}
        <ChartView
          queryHook={useGetCashRegisterQuery}
          type="bar"
          title="Cash Register"
          subtitle="Total: 1,172,342.70 RON"
        />
      </div>

      {/* Third Row - Detailed Analytics */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Product Trends */}
        <ListView
          queryHook={useGetProductTrendsQuery}
          title="Product Trends"
          renderIcon={(item) => (
            <div className={cn("p-1 rounded", item.change > 0 ? "bg-green-100" : "bg-red-100")}>
              {item.change > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
            </div>
          )}
          renderValue={(item) => (
            <span className={cn("text-xs", item.change > 0 ? "text-green-600" : "text-red-600")}>
              {item.change > 0 ? '+' : ''}{item.change}%
            </span>
          )}
        />

        {/* Top 5 Sales by Tag */}
        <ChartView
          queryHook={useGetTopSalesByTagQuery}
          type="bar"
          title="Top 5 Sales by Tag"
        />

        {/* Top 5 Sales by Category */}
        <ChartView
          queryHook={useGetTopSalesByCategoryQuery}
          type="bar"
          title="Top 5 Sales by Category"
        />
      </div>
    </div>
  );
}