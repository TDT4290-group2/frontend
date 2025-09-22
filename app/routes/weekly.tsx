import React from "react";
import { DayColumn, type Day } from "../components/ui/day-column";
import dummyWeekData from '../dummy/weekly.json';

const WeeklyOverview: React.FC = () => {

    // Temp assignment of dummydata
    const weekData = dummyWeekData;
    const timeSections: string[] = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

    const getDateRange = (): string => {
        const firstDate: Date = new Date(weekData[0].date);
        const lastDate: Date = new Date(weekData[weekData.length - 1].date);
        const firstDay: number = firstDate.getDate();
        const lastDay: number = lastDate.getDate();
        const firstMonth: string = firstDate.toLocaleString('default', { month: 'long' });
        const lastMonth: string = lastDate.toLocaleString('default', { month: 'long' });
        if (firstMonth !== lastMonth) {
            return `${firstDay}. ${firstMonth} - ${lastDay}. ${lastMonth}`;
        } else {
            return `${firstDay}. - ${lastDay}. ${firstMonth}`;
        }
    }

    return (
        <div className="weekly-container p-2">
            <div className="weekly-labels p-3 pl-6">
                <h1 className="text-3xl">Your weekly exposure</h1>
                <h2 className="pb-4">{getDateRange()}</h2>
            </div>
            <div className="p-4 gap-2 rounded-lg border border-gray-800 inline-flex w-auto">
                <div className="hour-column" >
                    <div className="flex flex-col overflow-auto min-w-14 pl-4 pt-13 text-right text-gray-400 items-end">
                        {/* TEMPORARY MAPPING OF HOURS - Should be more dynamic */}
                        {timeSections.map((hour, i) => (
                            <div
                                key={i}
                                className="flex min-h-10"
                            >
                                {hour}
                            </div>
                        ))}
                    </div>
                </div>
                {weekData.map((day) => (
                    <div key={day.date} >
                        <h2 className="font-semibold mb-2 text-center text-gray-400">{new Date(day.date).getDate()}. {new Date(day.date).toLocaleString('default', { month: 'short' })}</h2>
                        <div>
                            {day.hours.length > 0 ? (
                                <DayColumn selectedDay={day as Day} />
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