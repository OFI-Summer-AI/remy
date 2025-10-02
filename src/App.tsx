import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndexTest from "./modules/overview/pages/OverviewPage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import SidebarLayout from "@/shared/components/common/SidebarLayout.";
import StaffCalendarPage from "./modules/staff-calendar/pages/StaffCalendarPage";
import PredictionPage from "@/modules/sales-overview/pages/PredictionPage";
import StockAlertsPage from "./modules/stock-alerts/pages/StockAlertsPage";
import TableAllocationPage from "./modules/table-allocation/pages/TableAllocationPage";
import PromotionsPage from "./modules/promotions/pages/PromotionsPage";
import SocialPage from "./modules/social/pages/SocialPage";
import POSDashboard from "./modules/summary/pages/SummaryPage";
import { Provider } from "react-redux";
import { store } from "./shared/store/store";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<SidebarLayout />}>
            <Route path="/" element={<IndexTest />} />
            <Route path="/overview" element={<IndexTest />} />
            <Route path="/calendar" element={<StaffCalendarPage />} />
            <Route path="/prediction" element={<PredictionPage />} />
            <Route path="/stock" element={<StockAlertsPage />} />
            <Route path="/tables" element={<TableAllocationPage />} />
            <Route path="/promotions" element={<PromotionsPage />} />
            <Route path="/social" element={<SocialPage />} />
            <Route path="/summary" element={<POSDashboard />} />

            <Route path="/login" element={<Login />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </Provider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
