// pages/PredictionPage.tsx - Usando componentes genéricos

import React from "react";
import { format, subDays } from "date-fns";
import { Calendar } from "lucide-react";
import { DaySelector } from "../components/DaySelector";
import { ChartView } from "@/shared/components/common/ChartView";
import { ListView } from "@/shared/components/common/ListView";
import {
  useGetSalesForecastQuery,
  useGetSalesCategoryQuery,
  useGetTopItemsQuery,
  useGetBottomItemsQuery,
} from "../store/predictionApi";

const PredictionPage: React.FC = () => {
  const [showProjection, setShowProjection] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<"daily" | "weekly">("daily");
  const [dateFrom, setDateFrom] = React.useState<Date>(subDays(new Date(), 7));
  const [dateTo, setDateTo] = React.useState<Date>(new Date());

  return (
    <section className="p-6 space-y-6">
      <DaySelector 
        onDaysChange={() => {}}
        onGenerate={() => {}}
        selectedDays={[]}
      />
      
      <div className="bg-white rounded-2xl shadow-md">
        {/* Header Controls */}
        <div className="flex flex-row items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Sales Chart</h2>
          <div className="flex items-center gap-4">
            {/* Projection Toggle */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Projection</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showProjection}
                  onChange={(e) => setShowProjection(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Daily</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={viewMode === "weekly"}
                  onChange={(e) => setViewMode(e.target.checked ? "weekly" : "daily")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
              <label className="text-sm text-gray-600">Weekly</label>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Date Range Selector */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm text-gray-600">Date Range:</span>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <Calendar className="w-4 h-4" />
              {dateFrom ? format(dateFrom, "MMM dd") : "From"}
            </button>
            <span className="text-gray-600">to</span>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <Calendar className="w-4 h-4" />
              {dateTo ? format(dateTo, "MMM dd") : "To"}
            </button>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Sales Forecast Chart */}
            <div className="h-80">
              <ChartView
                queryHook={useGetSalesForecastQuery}
                type="line"
              />
            </div>

            {/* Sales by Category */}
            <div className="bg-slate-50 rounded-2xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
              <div className="h-64">
                <ChartView
                  queryHook={useGetSalesCategoryQuery}
                  type="bar"
                />
              </div>
            </div>
          </div>

          {/* Top & Bottom Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Items */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Top 5 Items</h3>
              <ListView
                queryHook={useGetTopItemsQuery}
                renderIcon={(item, index) => (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {index + 1}
                  </div>
                )}
                renderValue={(item) => (
                  <div className="text-sm font-medium">€{item.revenue}</div>
                )}
                renderSubtitle={(item) => (
                  <div className="text-xs text-gray-500">{item.units} units</div>
                )}
              />
            </div>

            {/* Bottom Items */}
            <div className="bg-slate-50 rounded-2xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Bottom 5 Items</h3>
              <ListView
                queryHook={useGetBottomItemsQuery}
                renderIcon={(item, index) => (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs font-bold">
                    {index + 1}
                  </div>
                )}
                renderValue={(item) => (
                  <div className="text-sm font-medium">€{item.revenue}</div>
                )}
                renderSubtitle={(item) => (
                  <div className="text-xs text-gray-500">{item.units} units</div>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PredictionPage;