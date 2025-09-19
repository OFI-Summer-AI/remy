
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Slider } from "@/shared/components/ui/slider";
import { useToast } from "@/shared/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { GripVertical, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

// ---------------- Data ----------------
const tables = Array.from({ length: 30 }, (_, i) => {
  const id = i + 1;
  const shape = id % 3 === 0 ? ("rect" as const) : ("circle" as const);
  const seats = shape === "rect" ? (id % 4 === 0 ? 6 : 4) : id % 5 === 0 ? 2 : 4;
  return { id, shape, seats };
});

const reservations = [
  { id: "r1", name: "Smith", size: 2, time: "19:00" },
  { id: "r2", name: "Lee", size: 4, time: "19:30" },
  { id: "r3", name: "Garcia", size: 3, time: "20:00" },
  { id: "r4", name: "Johnson", size: 6, time: "18:30" },
  { id: "r5", name: "Brown", size: 2, time: "20:30" },
  { id: "r6", name: "Davis", size: 4, time: "21:00" },
  { id: "r7", name: "Wilson", size: 3, time: "18:00" },
  { id: "r8", name: "Moore", size: 5, time: "19:15" },
  { id: "r9", name: "Taylor", size: 2, time: "20:45" },
  { id: "r10", name: "Anderson", size: 8, time: "19:45" },
];

const isReserved = (id: number, date: Date) =>
  (id * (date.getDate() + 3) + date.getMonth() + date.getFullYear()) % 7 === 0;

// ---------------- Reservation Card ----------------
const ReservationCard: React.FC<{
  r: (typeof reservations)[number];
  isAssigned: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}> = ({ r, isAssigned, onDragStart, onDragEnd }) => (
  <motion.div
    layout
    draggable={!isAssigned}
    onDragStart={(e) => {
      if (!isAssigned) {
        e.dataTransfer.setData("text/plain", r.id);
        onDragStart(r.id);
      }
    }}
    onDragEnd={onDragEnd}
    whileHover={{ scale: isAssigned ? 1 : 1.02 }}
    whileTap={{ scale: isAssigned ? 1 : 0.97 }}
    aria-label={`Reservation ${r.name} party of ${r.size} at ${r.time}`}
    className={`flex items-center gap-2 rounded-md border border-border px-2 py-2 text-sm transition-all shadow-sm
      ${
        isAssigned
          ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
          : "bg-sky-400 text-white cursor-grab active:cursor-grabbing hover:bg-sky-500"
      }`}
  >
    {!isAssigned && <GripVertical className="h-4 w-4 opacity-80" />}
    <div>
      <div className="font-medium">{r.name}</div>
      <div className="text-xs opacity-80">
        {r.size} guests • {r.time}
      </div>
      {isAssigned && (
        <div className="text-xs text-green-600 mt-1">✓ Assigned</div>
      )}
    </div>
  </motion.div>
);

// ---------------- Main Component ----------------
const TableAllocationPage: React.FC = () => {
  const [zoom, setZoom] = React.useState<number[]>([100]);
  const [draggedReservation, setDraggedReservation] = React.useState<string | null>(null);
  const [tableAssignments, setTableAssignments] = React.useState<
    Record<number, { name: string; time: string }>
  >({});
  const [hoveredTable, setHoveredTable] = React.useState<number | null>(null);
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  // ---------------- Helpers ----------------
  const getTimeInMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const isTableAvailable = (tableId: number, newTime: string) => {
    const assignment = tableAssignments[tableId];
    if (!assignment) return true;

    const existingTimeMinutes = getTimeInMinutes(assignment.time);
    const newTimeMinutes = getTimeInMinutes(newTime);
    const timeDifference = Math.abs(existingTimeMinutes - newTimeMinutes);

    return timeDifference >= 105; // 1h45m rule
  };

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);
  const daysInMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  ).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const goPrevDay = () =>
    setSelectedDate(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate() - 1
      )
    );
  const goNextDay = () =>
    setSelectedDate(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate() + 1
      )
    );
  const updateDay = (day: number) =>
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day)
    );
  const updateMonth = (m: number) => {
    const y = selectedDate.getFullYear();
    const d = Math.min(
      selectedDate.getDate(),
      new Date(y, m + 1, 0).getDate()
    );
    setSelectedDate(new Date(y, m, d));
  };
  const updateYear = (y: number) => {
    const m = selectedDate.getMonth();
    const d = Math.min(
      selectedDate.getDate(),
      new Date(y, m + 1, 0).getDate()
    );
    setSelectedDate(new Date(y, m, d));
  };

  const predictedWalkIns =
    5 +
    ((selectedDate.getDate() * 3 +
      selectedDate.getMonth() +
      selectedDate.getFullYear()) %
      20);

  // ---------------- JSX ----------------
  return (
    <section aria-label="Table Allocation View" className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Table Allocation
          </CardTitle>
          <div className="flex items-center gap-3">
            <label htmlFor="zoom" className="text-sm text-muted-foreground">
              Zoom
            </label>
            <div className="w-40">
              <Slider
                id="zoom"
                value={zoom}
                onValueChange={setZoom}
                min={50}
                max={150}
                step={10}
                aria-label="Zoom floor map"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Floor Map */}
            <motion.div
              className="md:col-span-2 relative border border-border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner flex items-center justify-center overflow-hidden"
              style={{ height: 380 }}
            >
              <motion.div
                style={{ scale: zoom[0] / 100 }}
                className="absolute inset-3 grid grid-cols-5 grid-rows-6 gap-4 place-items-center"
              >
                {tables.map((t) => {
                  const assignment = tableAssignments[t.id];
                  const isDragTarget = draggedReservation !== null;
                  const draggedRes = reservations.find(
                    (r) => r.id === draggedReservation
                  );
                  const wouldBeAvailable = draggedRes
                    ? isTableAvailable(t.id, draggedRes.time)
                    : true;

                  return (
                    <motion.div
                      key={t.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const rid = e.dataTransfer.getData("text/plain");
                        const reservation = reservations.find((r) => r.id === rid);

                        if (reservation && isTableAvailable(t.id, reservation.time)) {
                          setTableAssignments((prev) => ({
                            ...prev,
                            [t.id]: {
                              name: reservation.name,
                              time: reservation.time,
                            },
                          }));
                          toast({
                            title: `Assigned ${reservation.name} to Table ${t.id}`,
                            description: `Party of ${reservation.size} at ${reservation.time}`,
                          });
                        } else if (reservation) {
                          toast({
                            title: "Table not available",
                            description: "Table is occupied during this time slot",
                            variant: "destructive",
                          });
                        }
                        setDraggedReservation(null);
                      }}
                      onMouseEnter={() => setHoveredTable(t.id)}
                      onMouseLeave={() => setHoveredTable(null)}
                      aria-label={`Table ${t.id} with ${t.seats} seats`}
                      className={`relative flex items-center justify-center w-full h-full text-center text-xs font-medium border shadow-md transition-all
                        ${t.shape === "circle" ? "rounded-full" : "rounded-xl"}
                        ${
                          isDragTarget && !wouldBeAvailable
                            ? "bg-red-100 border-red-400 text-red-700"
                            : isDragTarget
                            ? "bg-amber-100 border-amber-400 text-amber-700"
                            : assignment
                            ? "bg-emerald-100 border-emerald-400 text-emerald-700"
                            : isReserved(t.id, selectedDate)
                            ? "bg-blue-100 border-blue-300 text-blue-700"
                            : "bg-gray-50 border-gray-300 text-gray-700"
                        }`}
                    >
                      <div>
                        <div>T{t.id} • {t.seats}</div>
                        {assignment && (
                          <div className="mt-1 text-[10px]">{assignment.name}</div>
                        )}
                      </div>

                      <AnimatePresence>
                        {hoveredTable === t.id && assignment && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow whitespace-nowrap"
                          >
                            {assignment.name} — {assignment.time}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Reservations Panel */}
            <div className="space-y-4">
              {/* Date Controls */}
              <div className="flex items-center justify-between">
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Previous day"
                  onClick={goPrevDay}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2">
                  <Select
                    value={`${selectedDate.getDate()}`}
                    onValueChange={(v) => updateDay(Number(v))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((d) => (
                        <SelectItem key={d} value={`${d}`}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={`${selectedDate.getMonth()}`}
                    onValueChange={(v) => updateMonth(Number(v))}
                  >
                    <SelectTrigger className="w-36">
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

                  <Select
                    value={`${selectedDate.getFullYear()}`}
                    onValueChange={(v) => updateYear(Number(v))}
                  >
                    <SelectTrigger className="w-28">
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

                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Next day"
                  onClick={goNextDay}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Reservations List */}
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {reservations.map((r) => {
                  const isAssigned = Object.values(tableAssignments).some(
                    (assignment) => assignment.name === r.name
                  );
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

              <div className="pt-2 text-sm text-muted-foreground">
                Predicted walk-ins:{" "}
                <span className="font-semibold text-emerald-600">
                  {predictedWalkIns}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default TableAllocationPage;
