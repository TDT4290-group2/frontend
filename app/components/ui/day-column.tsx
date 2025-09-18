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
    none: "bg-gray-600",
    green: "bg-green-400",
    orange: "bg-orange-400",
    red: "bg-red-500",
};

const hourNoToHourMapping = (hourNo: number) => {
    return hourNo + 7;
}

export const DayColumn: React.FC<DayProps> = ({selectedDay}) => {
    return (
        <div className="flex flex-col border rounded overflow-auto min-w-25">
            <div className="text-center font-bold py-1">
                {new Date(selectedDay.date).toLocaleDateString("default", { weekday: 'short' })}
            </div>
            <div className="hours">
                {selectedDay.hours.map((hour, i) => (
                    <div
                        key={i}
                        className={`flex min-h-10 border-black border-t border-dotted ${statusColors[hour.status]}`}
                        title={`${hourNoToHourMapping(hour.hourNo)}:00`}
                    />
                ))}
            </div>
        </div>
    );
};
