import React from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, AlertTriangle, TrendingUp, Timer } from "lucide-react";

const sparklineData = [
  { value: 850 }, { value: 920 }, { value: 1100 }, { value: 980 }, { value: 1200 }, { value: 1400 }, { value: 1300 }
];

const Overview: React.FC = () => {
  const currentTime = new Date();
  const satisfactionScore = 4.3;
  const avgPrepTime = 12;
  const scheduledStaff = 15;
  const currentStaff = 13;
  const pickupQueue = 7;
  const deliveryQueue = 12;
  const alertCount = 3;

  const kpiCards = [
    {
      title: "Customer Satisfaction",
      value: `⭐️ ${satisfactionScore}/5`,
      icon: Star,
      color: "text-accent",
    },
    {
      title: "Avg Order Prep Time",
      value: `${avgPrepTime} min`,
      icon: Timer,
      color: "text-secondary",
    },
    {
      title: "Staff Headcount",
      value: `${currentStaff}/${scheduledStaff}`,
      icon: Users,
      color: currentStaff < scheduledStaff ? "text-destructive" : "text-primary",
      subtitle: currentStaff < scheduledStaff ? "Understaffed" : "On target",
    },
    {
      title: "Live Queue Length",
      value: `${pickupQueue + deliveryQueue} orders`,
      icon: Clock,
      color: "text-muted-foreground",
      subtitle: `${pickupQueue} pickup • ${deliveryQueue} delivery`,
    },
  ];

  return (
    <section aria-label="Restaurant Overview Dashboard" className="space-y-6">
      {/* Alerts Banner */}
      <Card className="border-l-4 border-l-destructive">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span className="text-sm font-medium">Active Alerts</span>
              <Badge variant="destructive" className="rounded-full">
                {alertCount}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Low stock items, staffing gaps detected
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                  {kpi.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</p>
                  )}
                </div>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 7-Day Sales Trend */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            7-Day Sales Trend
          </CardTitle>
          <Badge variant="outline" className="bg-accent/10 text-accent-foreground">
            +12% vs last week
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="h-20 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1 text-xs text-muted-foreground">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="text-center">{day}</div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-lg font-bold text-primary">89%</p>
              <p className="text-xs text-muted-foreground">Table Occupancy</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-lg font-bold text-secondary">€2,340</p>
              <p className="text-xs text-muted-foreground">Today's Revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-lg font-bold text-accent">142</p>
              <p className="text-xs text-muted-foreground">Orders Today</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-lg font-bold text-muted-foreground">18 min</p>
              <p className="text-xs text-muted-foreground">Avg Wait Time</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Overview;