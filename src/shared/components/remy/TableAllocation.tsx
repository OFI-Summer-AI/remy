import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const tables = Array.from({
  length: 30
}, (_, i) => {
  const id = i + 1;
  const shape = id % 3 === 0 ? "rect" as const : "circle" as const;
  const seats = shape === "rect" ? id % 4 === 0 ? 6 : 4 : id % 5 === 0 ? 2 : 4;
  return {
    id,
    shape,
    seats
  };
});
const reservations = [{
  id: "r1",
  name: "Smith",
  size: 2,
  time: "19:00"
}, {
  id: "r2",
  name: "Lee",
  size: 4,
  time: "19:30"
}, {
  id: "r3",
  name: "Garcia",
  size: 3,
  time: "20:00"
}, {
  id: "r4",
  name: "Johnson",
  size: 6,
  time: "18:30"
}, {
  id: "r5",
  name: "Brown",
  size: 2,
  time: "20:30"
}, {
  id: "r6",
  name: "Davis",
  size: 4,
  time: "21:00"
}, {
  id: "r7",
  name: "Wilson",
  size: 3,
  time: "18:00"
}, {
  id: "r8",
  name: "Moore",
  size: 5,
  time: "19:15"
}, {
  id: "r9",
  name: "Taylor",
  size: 2,
  time: "20:45"
}, {
  id: "r10",
  name: "Anderson",
  size: 8,
  time: "19:45"
}];
const isReserved = (id: number, date: Date) => (id * (date.getDate() + 3) + date.getMonth() + date.getFullYear()) % 7 === 0;
const ReservationCard: React.FC<{
  r: (typeof reservations)[number];
  isAssigned: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}> = ({ r, isAssigned, onDragStart, onDragEnd }) => (
  <div 
    draggable={!isAssigned}
    onDragStart={e => {
      if (!isAssigned) {
        e.dataTransfer.setData("text/plain", r.id);
        onDragStart(r.id);
      }
    }}
    onDragEnd={onDragEnd}
    aria-label={`Reservation ${r.name} party of ${r.size} at ${r.time}`} 
    className={`rounded-md border border-border p-2 text-card-foreground text-sm transition-all ${
      isAssigned 
        ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-60" 
        : "cursor-grab active:cursor-grabbing bg-sky-400 hover:bg-sky-500"
    }`}
  >
    <div className="font-medium">{r.name}</div>
    <div className="text-muted-foreground text-xs">{r.size} guests • {r.time}</div>
    {isAssigned && <div className="text-xs text-green-600 mt-1">✓ Assigned</div>}
  </div>
);
const TableAllocation: React.FC = () => {
  const [zoom, setZoom] = React.useState<number[]>([100]);
  const [draggedReservation, setDraggedReservation] = React.useState<string | null>(null);
  const [tableAssignments, setTableAssignments] = React.useState<Record<number, {name: string, time: string}>>({});
  const [hoveredTable, setHoveredTable] = React.useState<number | null>(null);
  const {
    toast
  } = useToast();
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const getTimeInMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const isTableAvailable = (tableId: number, newTime: string) => {
    const assignment = tableAssignments[tableId];
    if (!assignment) return true;
    
    const existingTimeMinutes = getTimeInMinutes(assignment.time);
    const newTimeMinutes = getTimeInMinutes(newTime);
    const timeDifference = Math.abs(existingTimeMinutes - newTimeMinutes);
    
    // 1h 45min = 105 minutes
    return timeDifference >= 105;
  };
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from({
    length: 11
  }, (_, i) => new Date().getFullYear() - 5 + i);
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const days = Array.from({
    length: daysInMonth
  }, (_, i) => i + 1);
  const goPrevDay = () => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 1));
  const goNextDay = () => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1));
  const updateDay = (day: number) => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day));
  const updateMonth = (m: number) => {
    const y = selectedDate.getFullYear();
    const d = Math.min(selectedDate.getDate(), new Date(y, m + 1, 0).getDate());
    setSelectedDate(new Date(y, m, d));
  };
  const updateYear = (y: number) => {
    const m = selectedDate.getMonth();
    const d = Math.min(selectedDate.getDate(), new Date(y, m + 1, 0).getDate());
    setSelectedDate(new Date(y, m, d));
  };
  const predictedWalkIns = 5 + (selectedDate.getDate() * 3 + selectedDate.getMonth() + selectedDate.getFullYear()) % 20;
  return <section aria-label="Table Allocation View" className="space-y-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Table Allocation</CardTitle>
          <div className="flex items-center gap-3">
            <label htmlFor="zoom" className="text-sm text-muted-foreground">Zoom</label>
            <div className="w-40">
              <Slider id="zoom" value={zoom} onValueChange={setZoom} min={50} max={150} step={10} aria-label="Zoom floor map" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative border border-border rounded-lg bg-muted/20" style={{
              height: 360
            }}>
                <div className="absolute inset-3 grid grid-cols-5 grid-rows-6 gap-3 place-items-center">
                  {tables.map(t => {
                    const assignment = tableAssignments[t.id];
                    const isDragTarget = draggedReservation !== null;
                    const draggedRes = reservations.find(r => r.id === draggedReservation);
                    const wouldBeAvailable = draggedRes ? isTableAvailable(t.id, draggedRes.time) : true;
                    
                    return (
                      <div 
                        key={t.id} 
                        onDragOver={e => e.preventDefault()} 
                        onDrop={e => {
                          e.preventDefault();
                          const rid = e.dataTransfer.getData("text/plain");
                          const reservation = reservations.find(r => r.id === rid);
                          if (reservation && isTableAvailable(t.id, reservation.time)) {
                            setTableAssignments(prev => ({
                              ...prev,
                              [t.id]: { name: reservation.name, time: reservation.time }
                            }));
                            toast({
                              title: `Assigned ${reservation.name} to Table ${t.id}`,
                              description: `Party of ${reservation.size} at ${reservation.time}`
                            });
                          } else if (reservation) {
                            toast({
                              title: "Table not available",
                              description: "Table is occupied during this time slot",
                              variant: "destructive"
                            });
                          }
                          setDraggedReservation(null);
                        }}
                        onMouseEnter={() => setHoveredTable(t.id)}
                        onMouseLeave={() => setHoveredTable(null)}
                        aria-label={`Table ${t.id} with ${t.seats} seats`} 
                        className={`${t.shape === "circle" ? "rounded-full" : "rounded-xl"} h-full w-full flex items-center justify-center border shadow-sm transition-all relative ${
                          isDragTarget && !wouldBeAvailable ? "bg-red-200 border-red-400" :
                          isDragTarget ? "bg-red-100 border-red-300" :
                          assignment ? "bg-orange-100 border-orange-300 text-orange-700" :
                          isReserved(t.id, selectedDate) ? "bg-secondary/20 border-secondary text-secondary-foreground" : 
                          "bg-accent/15 border-accent text-accent-foreground"
                        }`}
                      >
                        <div className="text-[10px] md:text-xs font-medium text-center">
                          <div>T{t.id} • {t.seats}</div>
                          {assignment && (
                            <div className="text-[8px] md:text-[10px] mt-1">
                              {assignment.name}
                            </div>
                          )}
                        </div>
                        {hoveredTable === t.id && assignment && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                            {assignment.name} - {assignment.time}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Reservations</h3>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" aria-label="Previous day" onClick={goPrevDay} className="px-2 py-1 rounded-md border border-border hover:bg-muted">&lt;</button>
                <div className="flex items-center gap-2">
                  <Select value={`${selectedDate.getDate()}`} onValueChange={v => updateDay(Number(v))}>
                    <SelectTrigger className="w-20" aria-label="Select day">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-popover">
                      {days.map(d => <SelectItem key={d} value={`${d}`}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={`${selectedDate.getMonth()}`} onValueChange={v => updateMonth(Number(v))}>
                    <SelectTrigger className="w-36" aria-label="Select month">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-popover">
                      {months.map((m, idx) => <SelectItem key={m} value={`${idx}`}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={`${selectedDate.getFullYear()}`} onValueChange={v => updateYear(Number(v))}>
                    <SelectTrigger className="w-28" aria-label="Select year">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-popover">
                      {years.map(y => <SelectItem key={y} value={`${y}`}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <button type="button" aria-label="Next day" onClick={goNextDay} className="px-2 py-1 rounded-md border border-border hover:bg-muted">&gt;</button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {reservations.map(r => {
                  const isAssigned = Object.values(tableAssignments).some(assignment => assignment.name === r.name);
                  return (
                    <ReservationCard 
                      key={r.id} 
                      r={r} 
                      isAssigned={isAssigned}
                      onDragStart={setDraggedReservation}
                      onDragEnd={() => setDraggedReservation(null)}
                    />
                  );
                })}
              </div>

              <div className="pt-2 text-sm">Predicted walk-ins: {predictedWalkIns}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>;
};
export default TableAllocation;