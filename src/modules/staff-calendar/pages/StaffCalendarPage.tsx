import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { Users, Utensils, Truck, Calendar as CalendarIcon } from "lucide-react";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const months = [
  "January","February","March","April","May","June","July","August","September","October","November","December"
];

const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);

const mondayFirst = (d: number) => (d + 6) % 7; // Sun=0..Sat=6 -> Mon=0..Sun=6

function getMonthCells(month: number, year: number) {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const start = mondayFirst(first.getDay());
  const totalCells = Math.ceil((start + daysInMonth) / 7) * 7;
  return {
    cells: Array.from({ length: totalCells }, (_, idx) => {
      const day = idx - start + 1;
      return day >= 1 && day <= daysInMonth ? day : null;
    }),
  };
}

const seeded = (d: number, m: number, y: number, seed: number, min = 1, max = 10) => {
  const span = max - min + 1;
  const val = (d * (seed + 3) + m * 7 + y) % span;
  return min + (val < 0 ? val + span : val);
};

const StaffCalendarPage: React.FC = () => {
  const today = new Date();
  const [month, setMonth] = React.useState(today.getMonth());
  const [year, setYear] = React.useState(today.getFullYear());
  const [viewMode, setViewMode] = React.useState<"month" | "day">("month");
  const [selectedDate, setSelectedDate] = React.useState(today);
  const [showStaff, setShowStaff] = React.useState(false);

  const { cells } = getMonthCells(month, year);

  const staffMembers = [
    { id: 1, name: "Marco Rossi", role: "Kitchen", shift: "08:00-16:00" },
    { id: 2, name: "Sofia Chen", role: "Kitchen", shift: "16:00-00:00" },
    { id: 3, name: "Luis Rodriguez", role: "Floor", shift: "12:00-20:00" },
    { id: 4, name: "Emma Johnson", role: "Floor", shift: "18:00-02:00" },
    { id: 5, name: "Ahmed Hassan", role: "Delivery", shift: "17:00-01:00" },
    { id: 6, name: "Maria Santos", role: "Kitchen", shift: "10:00-18:00" },
    { id: 7, name: "Tom Wilson", role: "Floor", shift: "11:00-19:00" },
    { id: 8, name: "Anna Petrov", role: "Delivery", shift: "19:00-03:00" },
  ];

  const computeKPIs = () => {
    let totalK = 0,
      totalF = 0,
      totalD = 0,
      totalSales = 0;
    for (const c of cells) {
      if (!c) continue;
      const k = seeded(c, month, year, 1, 1, 9);
      const f = seeded(c, month, year, 2, 1, 9);
      const d = seeded(c, month, year, 3, 1, 9);
      const sales = seeded(c, month, year, 4, 100, 9999);
      totalK += k;
      totalF += f;
      totalD += d;
      totalSales += sales;
    }
    const staffUnits = totalK + totalF + totalD;
    const staffCost = staffUnits * 80;
    const staffPercent = totalSales ? Math.min(100, Math.round((staffCost / totalSales) * 100)) : 0;
    const accuracy = 80 + ((month + year) % 17);
    return { staffPercent, accuracy };
  };
  const { staffPercent, accuracy } = computeKPIs();

  const prevMonth = () => {
    const d = new Date(year, month - 1, 1);
    setMonth(d.getMonth());
    setYear(d.getFullYear());
  };
  const nextMonth = () => {
    const d = new Date(year, month + 1, 1);
    setMonth(d.getMonth());
    setYear(d.getFullYear());
  };

  const roleColors: Record<string, string> = {
    Kitchen: "bg-red-100 text-red-700",
    Floor: "bg-blue-100 text-blue-700",
    Delivery: "bg-green-100 text-green-700",
  };

  return (
    <section aria-label="Staff Calendar" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Staff Calendar
          </h2>
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "month" ? "default" : "ghost"}
              size="sm"
              className="rounded-md"
              onClick={() => setViewMode("month")}
            >
              Month
            </Button>
            <Button
              variant={viewMode === "day" ? "default" : "ghost"}
              size="sm"
              className="rounded-md"
              onClick={() => setViewMode("day")}
            >
              Day
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {viewMode === "day" && (
            <Button variant="outline" size="sm" onClick={() => setShowStaff(!showStaff)}>
              {showStaff ? "Hide Staff" : "Show Staff"}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setShowStaff(false)}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Month View */}
      {viewMode === "month" && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar */}
          <Card className="lg:col-span-2 rounded-2xl shadow-sm">
            <CardContent className="p-0">
              {/* Month navigation */}
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={prevMonth}>
                    &lt;
                  </Button>
                  <span className="font-semibold">
                    {months[month]} {year}
                  </span>
                  <Button variant="outline" size="sm" onClick={nextMonth}>
                    &gt;
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={`${month}`} onValueChange={(v) => setMonth(Number(v))}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((m, idx) => (
                        <SelectItem key={m} value={`${idx}`}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={`${year}`} onValueChange={(v) => setYear(Number(v))}>
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((y) => (
                        <SelectItem key={y} value={`${y}`}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Week header */}
              <div className="grid grid-cols-7 text-xs border-b bg-muted/40">
                {daysOfWeek.map((d) => (
                  <div key={d} className="px-3 py-2 font-medium text-muted-foreground text-center">
                    {d}
                  </div>
                ))}
              </div>
              {/* Days */}
              <div className="grid grid-cols-7 gap-px bg-border/40">
                {cells.map((day, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "min-h-24 bg-background p-2 flex flex-col gap-1 cursor-pointer hover:bg-muted/50 transition-colors",
                      day && "hover:shadow-sm"
                    )}
                    onClick={() => {
                      if (day) {
                        setSelectedDate(new Date(year, month, day));
                        setViewMode("day");
                      }
                    }}
                  >
                    <span className="text-xs font-medium text-muted-foreground">{day ?? ""}</span>
                    {day && (
                      <div className="text-xs space-y-1">
                        <p>Staff: {seeded(day, month, year, 1) + seeded(day, month, year, 2) + seeded(day, month, year, 3)}</p>
                        <p>Sales: €{seeded(day, month, year, 4, 100, 9999).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* KPIs */}
          <div className="space-y-4">
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Staff KPIs</h3>
                <div className="space-y-1 text-sm">
                  <p>Staff cost % of revenue: {staffPercent}%</p>
                  <p>Prediction accuracy: {accuracy}%</p>
                </div>
                <Button className="w-full mt-4">Create Schedule</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Day View */}
      {viewMode === "day" && (
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {selectedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </h3>
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Staff list */}
              <div className="lg:col-span-3 space-y-4">
                {showStaff ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {staffMembers.map((s) => (
                      <Card key={s.id} className="hover:shadow-md transition-shadow rounded-xl">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{s.name}</h4>
                              <p className="text-sm text-muted-foreground">{s.role}</p>
                              <p className="text-xs text-muted-foreground">{s.shift}</p>
                            </div>
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                roleColors[s.role] || "bg-gray-100 text-gray-700"
                              )}
                            >
                              {s.role.charAt(0)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-muted/20 rounded-xl border-2 border-dashed border-muted-foreground/25">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-2">No staff scheduled</p>
                      <Button onClick={() => setShowStaff(true)}>Show Staff Schedule</Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Day Summary</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Kitchen Staff:</span>
                        <span>{showStaff ? "3" : "0"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Floor Staff:</span>
                        <span>{showStaff ? "3" : "0"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Staff:</span>
                        <span>{showStaff ? "2" : "0"}</span>
                      </div>
                      <div className="border-t pt-2 font-semibold flex justify-between">
                        <span>Total:</span>
                        <span>{showStaff ? "8" : "0"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Shift Timeline</h4>
                    <div className="space-y-1 text-xs">
                      {showStaff ? (
                        <>
                          <div>08:00 - Marco (K)</div>
                          <div>10:00 - Maria (K)</div>
                          <div>11:00 - Tom (F)</div>
                          <div>12:00 - Luis (F)</div>
                          <div>16:00 - Sofia (K)</div>
                          <div>17:00 - Ahmed (D)</div>
                          <div>18:00 - Emma (F)</div>
                          <div>19:00 - Anna (D)</div>
                        </>
                      ) : (
                        <div className="text-muted-foreground">No schedule available</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default StaffCalendarPage;
