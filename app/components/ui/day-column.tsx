import React from "react";

type SlotStatus = "none" | "green" | "orange" | "red";

interface HourSlot {
    hourNo: number;
    status: SlotStatus;
}

export interface Day {
    date: string;
    hours: HourSlot[];
}

interface DayProps {
    selectedDay: Day;
}

const statusColors: Record<SlotStatus, string> = {
    // Temp colors 
    none: "bg-gray-500",
    green: "bg-[var(--safe)]",
    orange: "bg-[var(--warning)]",
    red: "bg-[var(--destructive)]",
};



export const DayColumn: React.FC<DayProps> = ({selectedDay}) => {
    const columnLabel: string = new Date(selectedDay.date).toLocaleDateString("default", { weekday: 'short' })
    
    return (
        <div className="day-column flex flex-col border rounded overflow-auto min-w-2">
            <div className="text-center font-bold py-1">
                {columnLabel}
            </div>
            <div className="day-column-hours">
                {selectedDay.hours.map((hour, i) => (
                    <div
                        key={i}
                        className={`hour-slot flex min-h-10 border-black border-t border-dotted ${statusColors[hour.status]}`}
                    />
                ))}
            </div>
        </div>
    );
};
