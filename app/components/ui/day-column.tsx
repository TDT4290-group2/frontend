import React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";
import { timeSections } from "~/app/lib/utils";

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

const statusMessage: Record<SlotStatus, string> = {
    none: "No data recorded",
    green: "Under exposure limit",
    orange: "Close to exposure limit",
    red: "Exposure limit exceeded",
}



export const DayColumn: React.FC<DayProps> = ({selectedDay}) => {
    const columnLabel: string = new Date(selectedDay.date).toLocaleDateString("default", { weekday: 'short' })
    
    return (
        <div className="day-column flex flex-col border rounded overflow-auto min-w-2">
            <div className="text-center font-bold py-1">
                {columnLabel}
            </div>
            <div className="day-column-hours divide-black divide-y divide-dotted">
                {selectedDay.hours.map((hour, i) => (
                    <HoverCard>
                        <HoverCardTrigger 
                            className={`hour-slot flex box-border min-h-10 ${statusColors[hour.status]} ${hour.status === "none" ? ``: `hover:brightness-150 transition`}`}
                            key={i}
                        >
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                            <div className="flex justify-between gap-4">
                                <div className="space-y-1">
                                    <h2>{timeSections[hour.hourNo]} - {timeSections[hour.hourNo + 1]}</h2>
                                    <h4>{statusMessage[hour.status]}</h4>
                                </div>
                            </div>
                        </HoverCardContent>
                        
                    </HoverCard>
                ))}
            </div>
                
        </div>
    );
};
