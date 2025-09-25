import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/ui/card";
import { type Day, DayColumn } from "@/ui/day-column";
import dummyWeekData from "../dummy/weekly.json";

export const WeeklyOverview = () => {
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
				<CardDescription className="pb-4">{getDateRange()}</CardDescription>
			</CardHeader>
			<CardContent className="flex">
				<div className="flex flex-col place-items-end gap-4 pt-18 pr-1 text-gray-400 text-sm">
					{/* TEMPORARY MAPPING OF HOURS - Should be more dynamic */}
					{timeSections.map((hour) => (
						<span key={hour}>{hour}</span>
					))}
				</div>
				<div className="grid w-full grid-cols-7">
					{weekData.map((day) => (
						<div key={day.date} className="col-span-1">
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
			</CardContent>
		</Card>
	);
};
