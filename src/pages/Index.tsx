import React from "react";
import GlobalKPI from "@/components/remy/GlobalKPI";
import StaffCalendar from "@/components/remy/StaffCalendar";
import SalesForecast from "@/components/remy/SalesForecast";
import StockAlerts from "@/components/remy/StockAlerts";
import TableAllocation from "@/components/remy/TableAllocation";
import PromotionsPanel from "@/components/remy/PromotionsPanel";
import Overview from "@/components/remy/Overview";
import ReviewsAndSocial from "@/components/remy/ReviewsAndSocial";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
const Index = () => {
  React.useEffect(() => {
    document.title = "Remy Dashboard – Restaurant Ops"; // SEO title under 60 chars
    const desc = "Remy dashboard with KPIs, calendar, sales forecast, stock alerts and more.";
    const meta = document.querySelector('meta[name="description"]') || document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute("content", desc);
    document.head.appendChild(meta);
    const link = document.querySelector('link[rel="canonical"]') || document.createElement("link");
    link.setAttribute("rel", "canonical");
    link.setAttribute("href", window.location.href);
    document.head.appendChild(link);
  }, []);
  return <div className="min-h-screen text-foreground bg-slate-50">
      <GlobalKPI />
      <main className="container mx-auto py-6 space-y-6">
        <h1 className="sr-only">Remy Dashboard – Restaurant Operations</h1>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 bg-sky-400">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="staff">Staff Calendar</TabsTrigger>
            <TabsTrigger value="sales">Sales Chart</TabsTrigger>
            <TabsTrigger value="stock">Stock Alerts</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
            <TabsTrigger value="reviews">Reviews & Social</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Overview />
          </TabsContent>

          <TabsContent value="staff">
            <StaffCalendar />
          </TabsContent>

          <TabsContent value="sales">
            <SalesForecast />
          </TabsContent>

          <TabsContent value="stock">
            <StockAlerts />
          </TabsContent>

          <TabsContent value="table">
            <TableAllocation />
          </TabsContent>

          <TabsContent value="promotions">
            <PromotionsPanel />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsAndSocial />
          </TabsContent>
        </Tabs>
      </main>
    </div>;
};
export default Index;