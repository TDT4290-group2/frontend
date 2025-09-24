import type React from "react";
import { Card } from "../components/ui/card";
import { type Day, DayColumn } from "../components/ui/day-column";
import dummyWeekData from "../dummy/weekly.json";

export const WeeklyOverview: React.FC = () => {
	// Temp assignment of dummydata
	const weekData = dummyWeekData;
	const timeSections: Array<string> = [
		"08:00",
		"09:00",
		"10:00",
		"11:00",
		"12:00",
		"13:00",
		"14:00",
		"15:00",
		"16:00",
	];

	const getDateRange = (): string => {
		const firstDate: Date = new Date(weekData[0].date);
		const lastDate: Date = new Date(weekData[weekData.length - 1].date);
		const firstDay: number = firstDate.getDate();
		const lastDay: number = lastDate.getDate();
		const firstMonth: string = firstDate.toLocaleString("default", {
			month: "long",
		});
		const lastMonth: string = lastDate.toLocaleString("default", {
			month: "long",
		});
		if (firstMonth !== lastMonth) {
			return `${firstDay}. ${firstMonth} - ${lastDay}. ${lastMonth}`;
		}
		return `${firstDay}. - ${lastDay}. ${firstMonth}`;
	};

	return (
		<Card className="weekly-container p-2">
			<div className="weekly-labels p-3 pl-6">
				<h1 className="text-3xl">{"Your weekly exposure"}</h1>
				<h2 className="pb-4">{getDateRange()}</h2>
			</div>
			<div className="inline-flex gap-1">
				<div className="hour-column">
					<div className="flex flex-col items-end overflow-auto pt-13 text-right text-gray-400">
						{/* TEMPORARY MAPPING OF HOURS - Should be more dynamic */}
						{timeSections.map((hour) => (
							<div key={hour} className="flex min-h-10">
								{hour}
							</div>
						))}
					</div>
				</div>
				{weekData.map((day) => (
					<div key={day.date} className="flex-1">
						<h2 className="mb-2 text-center font-semibold text-gray-400 sm:text-xsm">
							{`${new Date(day.date).getDate()}. `}
						</h2>
						<div className="min-w-2">
							{day.hours.length > 0 ? (
								<DayColumn selectedDay={day as Day} />
							) : (
								<p>{">Data missing"}</p>
							)}
						</div>
					</div>
				))}
			</div>
		</Card>
	);
};
