
import { Calendar } from "lucide-react";
import { format, addDays, startOfDay, isSameDay } from "date-fns";

interface DaySelectorProps {
  selectedDays: Date[]
  onDaysChange: (days: Date[]) => void
  onGenerate: () => void
  isLoading?: boolean
  daysAhead?: number // Cuántos días hacia adelante mostrar (default: 7)
}

export function DaySelector({ 
  selectedDays, 
  onDaysChange, 
  onGenerate, 
  isLoading,
  daysAhead = 7 
}: DaySelectorProps) {
  
  // Generar días desde hoy hasta daysAhead días
  const generateDays = () => {
    const days = [];
    const today = startOfDay(new Date());
    
    for (let i = 0; i < daysAhead; i++) {
      days.push(addDays(today, i));
    }
    
    return days;
  };

  const availableDays = generateDays();

  const toggleDay = (date: Date) => {
    const isSelected = selectedDays.some(selectedDate => 
      isSameDay(selectedDate, date)
    );
    
    if (isSelected) {
      onDaysChange(selectedDays.filter(selectedDate => 
        !isSameDay(selectedDate, date)
      ));
    } else {
      onDaysChange([...selectedDays, date]);
    }
  };

  const selectAll = () => {
    onDaysChange([...availableDays]);
  };

  const clearAll = () => {
    onDaysChange([]);
  };

  const isDaySelected = (date: Date) => {
    return selectedDays.some(selectedDate => 
      isSameDay(selectedDate, date)
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-bold">Select Days for Prediction</h2>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={selectAll} 
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md border border-gray-300 transition-colors"
          >
            Select All
          </button>
          <button 
            onClick={clearAll} 
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md border border-gray-300 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Days Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {availableDays.map((date, index) => {
            const isSelected = isDaySelected(date);
            const isToday = isSameDay(date, new Date());
            
            return (
              <button
                key={date.toISOString()}
                onClick={() => toggleDay(date)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-center relative ${
                  isSelected
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-gray-300 hover:border-orange-300 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {isToday && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></span>
                )}
                <div className="font-medium text-sm">
                  {format(date, "EEE")}
                </div>
                <div className="text-lg font-bold mt-1">
                  {format(date, "dd")}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {format(date, "MMM")}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            {selectedDays.length === 0
              ? "No days selected"
              : `${selectedDays.length} day${selectedDays.length === 1 ? "" : "s"} selected`}
          </div>
          <button
            onClick={onGenerate}
            disabled={selectedDays.length === 0 || isLoading}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              selectedDays.length === 0 || isLoading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600 shadow-sm hover:shadow-md"
            }`}
          >
            {isLoading ? "Generating..." : "Generate Prediction"}
          </button>
        </div>

        {/* Selected Days Preview */}
        {selectedDays.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Selected Days:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedDays
                .sort((a, b) => a.getTime() - b.getTime())
                .map((date, index) => (
                  <span
                    key={date.toISOString()}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                  >
                    {format(date, "EEE, MMM dd")}
                    <button
                      onClick={() => toggleDay(date)}
                      className="ml-1 hover:bg-orange-200 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}