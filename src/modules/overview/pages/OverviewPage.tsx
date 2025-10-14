// pages/OverviewPage.tsx - Using generic components

import { AlertTriangle } from "lucide-react";
import { KPIGridView } from "@/shared/components/common/KPIGridView";
import { ChartView } from "@/shared/components/common/ChartView";
import { ListView } from "@/shared/components/common/ListView";
import {
  useGetKPIsQuery,
  useGetSalesTrendQuery,
  useGetSalesCategoryQuery,
  useGetOrdersChannelsQuery,
  useGetWeeklyReservationsQuery,
  useGetPromotionsQuery,
  useGetSatisfactionQuery,
  useGetStockAlertsQuery,
} from "../store/overviewApi";

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Restaurant performance, today and this week.</p>
      </div>

      {/* KPIs - Pass the query hook, component handles the rest */}
      <KPIGridView queryHook={useGetKPIsQuery} variant="full" />

      {/* Main charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartView
          queryHook={useGetSalesTrendQuery}
          type="area"
          title="Sales Trend (14 days)"
          subtitle="Total $"
          className="col-span-2"
        />
        <ChartView
          queryHook={useGetSalesCategoryQuery}
          type="bar"
          title="Sales by Category"
          subtitle="$ last week"
        />
      </div>

      {/* Channels and Reservations */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartView
          queryHook={useGetOrdersChannelsQuery}
          type="pie"
          title="Order Channels"
          subtitle="% distribution"
        />
        <ChartView
          queryHook={useGetWeeklyReservationsQuery}
          type="line"
          title="Weekly Reservations"
          subtitle="number of reservations"
          className="col-span-2"
        />
      </div>

      {/* Stock Alerts and Recent Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Stock Alerts - Scrollable y sincronizado en altura */}
        <div className="flex h-[320px] flex-col rounded-xl border bg-card">
          <div className="shrink-0 border-b p-4">
            <h3 className="font-semibold">Stock Alerts</h3>
            <span className="text-xs text-muted-foreground">items to restock</span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <ListView
              queryHook={useGetStockAlertsQuery}
              renderIcon={(item) => (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              )}
              hideHeader={true}
            />
          </div>
        </div>
        
        {/* Recent Activity - Altura fija */}
        <div className="col-span-2 flex h-[320px] flex-col rounded-xl border bg-card p-4">
          <div className="mb-2 flex shrink-0 items-center justify-between">
            <h3 className="font-semibold">Recent Activity</h3>
            <span className="text-xs text-muted-foreground">last 24h</span>
          </div>
          <div className="grid min-h-0 flex-1 gap-3 md:grid-cols-2">
            <div className="flex flex-col rounded-lg border p-3">
              <div className="mb-2 shrink-0 text-sm font-medium">Promotions Campaign</div>
              <div className="min-h-0 flex-1">
                <ChartView
                  queryHook={useGetPromotionsQuery}
                  type="bar"
                  hideHeader={true}
                />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border p-3">
              <div className="mb-2 shrink-0 text-sm font-medium">Satisfaction (reviews)</div>
              <div className="min-h-0 flex-1">
                <ChartView
                  queryHook={useGetSatisfactionQuery}
                  type="area"
                  hideHeader={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}