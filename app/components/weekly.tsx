import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/ui/card";
import { type Day, DayColumn } from "@/ui/day-column";
import dummyWeekData from "../dummy/weekly.json";
import { timeSections } from "../lib/utils";

export const WeeklyOverview = () => {
	// Temp assignment of dummydata
	const weekData = dummyWeekData;

	const getDateRange = () => {
		const firstDate = new Date(weekData[0].date);
		const lastDate = new Date(weekData[weekData.length - 1].date);
		const firstDay = firstDate.getDate();
		const lastDay = lastDate.getDate();
		const firstMonth = firstDate.toLocaleString("default", {
			month: "long",
		});
		const lastMonth = lastDate.toLocaleString("default", {
			month: "long",
		});
		if (firstMonth !== lastMonth) {
			return `${firstDay}. ${firstMonth} - ${lastDay}. ${lastMonth}`;
		}
		return `${firstDay}. - ${lastDay}. ${firstMonth}`;
	};

	return (
		<Card className="sm: w-full sm:p-2 md:w-4/5 lg:w-3/4">
			<CardHeader className="weekly-labels p-3 pl-6">
				<CardTitle className="text-2xl">{"Your weekly exposure"}</CardTitle>
				<CardDescription>{getDateRange()}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-7 md:grid-cols-[auto_repeat(7,minmax(0,1fr))] w-full">
					{/* HOUR LABELS */}
					<div className="hidden md:flex flex-col dark:text-gray-400 text-gray-700 text-sm pr-1.5 pt-13">
						
						{timeSections.map((hour) => (
							<div key={hour} className="min-h-10 flex items-start justify-end">
								<span>{hour}</span>
							</div>
						))}
					</div>
				
					{weekData.map((day) => (
						<div key={day.date} className="flex flex-col">
							<h2 className="mb-2 text-center font-semibold dark:text-gray-400 text-gray-700 sm:text-xsm">
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
			</CardContent>
		</Card>
	);
};
