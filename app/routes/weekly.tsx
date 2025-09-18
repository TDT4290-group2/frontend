import React from "react";
import { DayColumn, type Day } from "../components/ui/day-column";

const weeklyData: Day[] = [
    { date: "2025-09-08", hours: [
        { hourNo: 1, status: "green" }, { hourNo: 2, status: "green" }, { hourNo: 3, status: "green" }, { hourNo: 4, status: "green" },
        { hourNo: 5, status: "green" }, { hourNo: 6, status: "orange" }, { hourNo: 7, status: "red" }, { hourNo: 8, status: "red" }
    ] },
    { date: "2025-09-09", hours: [
        { hourNo: 1, status: "green" }, { hourNo: 2, status: "green" }, { hourNo: 3, status: "green" }, { hourNo: 4, status: "orange" },
        { hourNo: 5, status: "orange" }, { hourNo: 6, status: "orange" }, { hourNo: 7, status: "orange" }, { hourNo: 8, status: "red" }
    ] },
    { date: "2025-09-10", hours: [
        { hourNo: 1, status: "green" }, { hourNo: 2, status: "green" }, { hourNo: 3, status: "green" }, { hourNo: 4, status: "green" },
        { hourNo: 5, status: "green" }, { hourNo: 6, status: "green" }, { hourNo: 7, status: "green" }, { hourNo: 8, status: "green" }
    ] },
    { date: "2025-09-11", hours: [
        { hourNo: 1, status: "green" }, { hourNo: 2, status: "green" }, { hourNo: 3, status: "orange" }, { hourNo: 4, status: "red" },
        { hourNo: 5, status: "red" }, { hourNo: 6, status: "red" }, { hourNo: 7, status: "red" }, { hourNo: 8, status: "red" }
    ] },
    { date: "2025-09-12", hours: [
        { hourNo: 1, status: "green" }, { hourNo: 2, status: "green" }, { hourNo: 3, status: "green" }, { hourNo: 4, status: "green" },
        { hourNo: 5, status: "green" }, { hourNo: 6, status: "green" }, { hourNo: 7, status: "green" }, { hourNo: 8, status: "green" }
    ] },
    { date: "2025-09-13", hours: [
        { hourNo: 1, status: "none" }, { hourNo: 2, status: "none" }, { hourNo: 3, status: "none" }, { hourNo: 4, status: "none" },
        { hourNo: 5, status: "none" }, { hourNo: 6, status: "none" }, { hourNo: 7, status: "none" }, { hourNo: 8, status: "none" }
    ] },
    { date: "2025-09-14", hours: [
        { hourNo: 1, status: "none" }, { hourNo: 2, status: "none" }, { hourNo: 3, status: "none" }, { hourNo: 4, status: "none" },
        { hourNo: 5, status: "none" }, { hourNo: 6, status: "none" }, { hourNo: 7, status: "none" }, { hourNo: 8, status: "none" }
    ] },
];

const WeeklyOverview: React.FC = () => {
    return (
        <div style={{ padding: "2rem" }}>
            <h1>Weekly Overview</h1>
            <h2 className="pb-4">{new Date(weeklyData[0].date).getDate()}th - {new Date(weeklyData[weeklyData.length - 1].date).getDate()}th {new Date(weeklyData[0].date).toLocaleString('default', { month: 'long' })}</h2>
            <div className="p-4 flex gap-2 rounded-lg border border-gray-200">
                <div className="hour-column" >
                    <div className="flex flex-col overflow-auto min-w-25 pt-14 text-right text-white items-end">
                        {/* TEMPORARY MAPPING OF HOURS - Should be more dynamic */}
                        {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"].map((hour, i) => (
                            <div
                                key={i}
                                className="flex min-h-10"
                            >
                                {hour}
                            </div>
                        ))}
                    </div>
                </div>
                {weeklyData.map((day) => (
                    <div key={day.date} >
                        <h2 className="font-semibold mb-2 text-center">{new Date(day.date).getDate()}. {new Date(day.date).toLocaleString('default', { month: 'short' })}</h2>
                        <div >
                            {day.hours.length > 0 ? (
                                <DayColumn selectedDay={day} />
                            ) : (
                                <p>Data missing</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeeklyOverview;