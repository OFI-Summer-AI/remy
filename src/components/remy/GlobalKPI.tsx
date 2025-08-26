import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Moon, Sun, RefreshCw, TrendingUp, Percent, Trash2, Repeat, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
const kpis = [{
  key: "labour",
  label: "Labour Cost %",
  value: "21.4%",
  Icon: Percent
}, {
  key: "turnover",
  label: "Table Turnover",
  value: "3.1x",
  Icon: Repeat
}, {
  key: "waste",
  label: "Waste %",
  value: "2.8%",
  Icon: Trash2
}, {
  key: "sales",
  label: "Sales Trend",
  value: "+8.2% WoW",
  Icon: TrendingUp
}];
const GlobalKPI: React.FC = () => {
  const navigate = useNavigate();
  const [dark, setDark] = React.useState<boolean>(typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : false);
  const toggleDark = () => {
    const root = document.documentElement;
    root.classList.toggle("dark");
    setDark(root.classList.contains("dark"));
  };
  const onRefresh = () => {
    // Static UI: just a no-op visual feedback
  };
  return <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex flex-col gap-4 py-4 bg-sky-400">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            Remy Restaurant Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onRefresh} aria-label="Refresh dashboard">
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
            <Button variant="outline" onClick={() => navigate('/login')} aria-label="Go to profile">
              <User className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={toggleDark} aria-label="Toggle dark mode">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {kpis.map(({
          key,
          label,
          value,
          Icon
        }) => <Card key={key} className="shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-semibold mt-1">{value}</p>
                </div>
                <div className="rounded-md p-2 bg-primary/10 text-primary">
                  <Icon aria-hidden className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </header>;
};
export default GlobalKPI;