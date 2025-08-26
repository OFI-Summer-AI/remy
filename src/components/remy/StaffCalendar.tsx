import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const months = [
  "January","February","March","April","May","June","July","August","September","October","November","December"
];

const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);

const mondayFirst = (d: number) => (d + 6) % 7; // JS: Sun=0..Sat=6 -> Mon=0..Sun=6

function getMonthCells(month: number, year: number) {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const start = mondayFirst(first.getDay());
  const totalCells = Math.ceil((start + daysInMonth) / 7) * 7;
  const cells = Array.from({ length: totalCells }, (_, idx) => {
    const day = idx - start + 1;
    return day >= 1 && day <= daysInMonth ? day : null;
  });
  return { cells };
}

const seeded = (d: number, m: number, y: number, seed: number, min = 1, max = 10) => {
  const span = max - min + 1;
  const val = (d * (seed + 3) + m * 7 + y) % span;
  return min + (val < 0 ? val + span : val);
};

const StaffCalendar: React.FC = () => {
  const today = new Date();
  const [month, setMonth] = React.useState(today.getMonth());
  const [year, setYear] = React.useState(today.getFullYear());
  const [viewMode, setViewMode] = React.useState<'month' | 'day'>('month');
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
    { id: 8, name: "Anna Petrov", role: "Delivery", shift: "19:00-03:00" }
  ];

  const computeKPIs = () => {
    let totalK = 0, totalF = 0, totalD = 0, totalSales = 0;
    for (const c of cells) {
      if (!c) continue;
      const k = seeded(c, month, year, 1, 1, 9);
      const f = seeded(c, month, year, 2, 1, 9);
      const d = seeded(c, month, year, 3, 1, 9);
      const sales = seeded(c, month, year, 4, 100, 9999);
      totalK += k; totalF += f; totalD += d; totalSales += sales;
    }
    const staffUnits = totalK + totalF + totalD;
    const assumedCostPerUnit = 80;
    const staffCost = staffUnits * assumedCostPerUnit;
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

  return (
    <section aria-label="Staff Calendar" className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Staff Calendar</h2>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'month' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('month')}
            >
              Month
            </Button>
            <Button 
              variant={viewMode === 'day' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('day')}
            >
              Day
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {viewMode === 'day' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowStaff(!showStaff)}
            >
              {showStaff ? 'Hide Staff' : 'Show Staff'}
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowStaff(false)}
          >
            Refresh
          </Button>
        </div>
      </div>

      {viewMode === 'month' ? (
        <>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-md font-medium flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous month"
                onClick={prevMonth}
                className="px-2 py-1 rounded-md border border-border hover:bg-muted"
              >
                &lt;
              </button>
              <span>{months[month]} {year}</span>
              <button
                type="button"
                aria-label="Next month"
                onClick={nextMonth}
                className="px-2 py-1 rounded-md border border-border hover:bg-muted"
              >
                &gt;
              </button>
              <div className="flex items-center gap-2 ml-4">
                <Select value={`${month}`} onValueChange={(v) => setMonth(Number(v))}>
                  <SelectTrigger className="w-36" aria-label="Select month">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover">
                    {months.map((m, idx) => (
                      <SelectItem key={m} value={`${idx}`}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={`${year}`} onValueChange={(v) => setYear(Number(v))}>
                  <SelectTrigger className="w-28" aria-label="Select year">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover">
                    {years.map((y) => (
                      <SelectItem key={y} value={`${y}`}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </h3>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Previous day"
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 1))}
            className="px-2 py-1 rounded-md border border-border hover:bg-muted"
          >
            &lt;
          </button>
          <span className="text-md font-medium">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <button
            type="button"
            aria-label="Next day"
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1))}
            className="px-2 py-1 rounded-md border border-border hover:bg-muted"
          >
            &gt;
          </button>
        </div>
      )}

      {viewMode === 'month' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="md:col-span-2">
            <CardContent className="p-0">
              <div className="grid grid-cols-7 text-xs border-b border-border/60">
                {daysOfWeek.map((d) => (
                  <div key={d} className="px-3 py-2 text-muted-foreground font-medium">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-px bg-border/60">
                {cells.map((day, idx) => (
                  <div
                    key={idx}
                    className="min-h-20 bg-background p-3 flex flex-col gap-1 cursor-pointer hover:bg-muted/50"
                    aria-label={day ? `Day ${day}` : "Empty cell"}
                    onClick={() => {
                      if (day) {
                        setSelectedDate(new Date(year, month, day));
                        setViewMode('day');
                      }
                    }}
                  >
                    <span className="text-xs font-medium text-muted-foreground">{day ?? ""}</span>
                    {day && (
                      <div className="mt-1 space-y-1 text-sm">
                        {(() => {
                          const k = seeded(day, month, year, 1, 1, 9);
                          const f = seeded(day, month, year, 2, 1, 9);
                          const d = seeded(day, month, year, 3, 1, 9);
                          const total = k + f + d;
                          const sales = seeded(day, month, year, 4, 100, 9999);
                          const clients = seeded(day, month, year, 5, 20, 300);
                          return (
                            <>
                              <p>Staff: {total} (K {k}, F {f}, D {d})</p>
                              <p>Sales: €{sales.toLocaleString()}</p>
                              <p>Clients: {clients}</p>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <aside>
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-semibold">Staff KPIs</h3>
                <div className="text-sm">Staff cost % of revenue: {staffPercent}%</div>
                <div className="text-sm">Prediction accuracy: {accuracy}%</div>
                <Button className="w-full mt-4">Create Schedule</Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <h3 className="text-lg font-semibold mb-4">Daily Staff Schedule</h3>
                {!showStaff ? (
                  <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/25">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-2">No staff scheduled</p>
                      <Button onClick={() => setShowStaff(true)}>Show Staff Schedule</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {staffMembers.map((staff) => (
                        <Card key={staff.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{staff.name}</h4>
                                <p className="text-sm text-muted-foreground">{staff.role}</p>
                                <p className="text-xs text-muted-foreground mt-1">{staff.shift}</p>
                              </div>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                staff.role === 'Kitchen' ? 'bg-red-100 text-red-700' :
                                staff.role === 'Floor' ? 'bg-blue-100 text-blue-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {staff.role.charAt(0)}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Day Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Kitchen Staff:</span>
                        <span>{showStaff ? '3' : '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Floor Staff:</span>
                        <span>{showStaff ? '3' : '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Staff:</span>
                        <span>{showStaff ? '2' : '0'}</span>
                      </div>
                      <div className="border-t pt-2 font-medium flex justify-between">
                        <span>Total Staff:</span>
                        <span>{showStaff ? '8' : '0'}</span>
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
                          <div>08:00 - Marco (K) starts</div>
                          <div>10:00 - Maria (K) starts</div>
                          <div>11:00 - Tom (F) starts</div>
                          <div>12:00 - Luis (F) starts</div>
                          <div>16:00 - Sofia (K) starts</div>
                          <div>17:00 - Ahmed (D) starts</div>
                          <div>18:00 - Emma (F) starts</div>
                          <div>19:00 - Anna (D) starts</div>
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


export default StaffCalendar;
