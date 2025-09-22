import React from "react";
import { DayColumn, type Day } from "../components/ui/day-column";
import dummyWeekData from '../dummy/weekly.json';

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