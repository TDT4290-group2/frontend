/** biome-ignore-all lint/suspicious/noAlert: we allow alerts for testing */
import type { CalendarDay, Modifiers } from "react-day-picker";
import type { SensorDataResponseDto } from "../lib/dto";
import {
	cn,
	type DangerKeywords,
	mapSensorDataToMonthLists,
	type Sensor,
} from "../lib/utils";
import { Calendar } from "./ui/calendar";
import { Card } from "./ui/card";

type MonthlyProps = {
	selectedDay: Date;
	exposureType?: Sensor;
	data: Array<SensorDataResponseDto> | undefined;
};

export function MonthlyView({ selectedDay, exposureType, data }: MonthlyProps) {
	// UTILS

	const monthData = mapSensorDataToMonthLists(data ?? [], exposureType);

	function getDayType(day: Date): DangerKeywords | "none" {
		if (hasData(monthData.safe, day)) return "safe";
		if (hasData(monthData.warning, day)) return "warning";
		if (hasData(monthData.danger, day)) return "danger";
		return "none";
	}

	const alertLabels = {
		safe: "Safe day on",
		warning: "Warnings issued on",
		danger: "Danger: Exposure limits exceeded on",
	};

	const hasData = (dateList: Array<Date>, clickedDay: Date) =>
		dateList.some((day) => day.toDateString() === clickedDay.toDateString());

	// Click handler
	// Checks if the day clicked has data with temporary interaction with alert
	const handleDayClick = (clickedDay: Date) => {
		const clickedType = getDayType(clickedDay);
		if (clickedType === "none") return;
		alert(`${alertLabels[clickedType]} ${clickedDay.toLocaleDateString()}`);
	};

	// Custom component that renders within a day in the month grid to achieve better interaction
	function CustomDay(
		props: {
			day: CalendarDay;
			modifiers: Modifiers;
		} & React.ButtonHTMLAttributes<HTMLButtonElement>,
	) {
		const { day, className, ...buttonProps } = props;
		const dayDate = day.date;
		const type = getDayType(dayDate);

		let relevantClassname = "cursor-pointer hover:brightness-85";

		if (type === "safe") relevantClassname = `bg-safe ${relevantClassname}`;
		else if (type === "warning")
			relevantClassname = `bg-warning ${relevantClassname}`;
		else if (type === "danger")
			relevantClassname = `bg-danger ${relevantClassname}`;
		else relevantClassname = "noData";

		return (
			<button
				type="button"
				disabled={relevantClassname === "noData"}
				className={cn(
					"h-11/12 w-11/12 rounded-lg",
					relevantClassname,
					className,
				)}
				onClick={() => handleDayClick(dayDate)}
				{...buttonProps}
			/>
		);
	}

	return (
		<Card className="w-full">
			<Calendar
				month={selectedDay}
				hideNavigation
				showWeekNumber
				weekStartsOn={1}
				onDayClick={(day) => handleDayClick(day)}
				components={{
					DayButton: CustomDay,
				}}
				modifiers={{ ...monthData }}
				className="w-full bg-transparent font-bold text-foreground [--cell-size:--spacing(6)] sm:[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
				captionLayout="label"
				buttonVariant="default"
				mode="single"
			/>
		</Card>
	);
}
