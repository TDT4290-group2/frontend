/** biome-ignore-all lint/suspicious/noAlert: we allow alerts for testing */
/** biome-ignore-all lint/correctness/noNestedComponentDefinitions: CustomDay is intentionally defined inside MonthlyView for prop access. */

import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { languageToLocale } from "@/i18n/locale";
import type { DangerKey } from "@/lib/danger-levels";
import { cn } from "@/lib/utils";
import type { CalendarDay, Modifiers } from "react-day-picker";
import { useTranslation } from "react-i18next";

export function CalendarWidget({
	selectedDay,
	data,
}: {
	selectedDay: Date;
	data: Record<DangerKey, Array<Date>>;
}) {
	// UTILS

	const { t, i18n } = useTranslation();

	function getDayType(day: Date): Lowercase<DangerKey> | "none" {
		if (hasData(data.safe, day)) return "safe";
		if (hasData(data.warning, day)) return "warning";
		if (hasData(data.danger, day)) return "danger";
		return "none";
	}

	const alertLabels = {
		safe: t("monthly-view.safe"),
		warning: t("monthly-view.warning"),
		danger: t("monthly-view.danger"),
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

	return (
		<Card className="w-full">
			<Calendar
				locale={languageToLocale[i18n.language]}
				month={selectedDay}
				hideNavigation
				showWeekNumber
				weekStartsOn={1}
				onDayClick={(day) => handleDayClick(day)}
				components={{
					DayButton: (props) => (
						<CustomDay
							{...props}
							getDayType={getDayType}
							handleDayClick={handleDayClick}
						/>
					),
				}}
				modifiers={{ ...data }}
				className="w-full bg-transparent font-bold text-foreground [--cell-size:--spacing(6)] sm:[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
				captionLayout="label"
				buttonVariant="default"
				mode="single"
			/>
		</Card>
	);
}

type CustomDayProps = {
	day: CalendarDay;
	modifiers: Modifiers;
	className?: string;
	getDayType: (day: Date) => Lowercase<DangerKey> | "none";
	handleDayClick: (day: Date) => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function CustomDay({
	day,
	className,
	getDayType,
	handleDayClick,
	...buttonProps
}: CustomDayProps) {
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
			className={cn("h-11/12 w-11/12 rounded-lg", relevantClassname, className)}
			{...buttonProps}
		/>
	);
}
