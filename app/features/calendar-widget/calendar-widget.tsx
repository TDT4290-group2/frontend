/** biome-ignore-all lint/suspicious/noAlert: we allow alerts for testing */
/** biome-ignore-all lint/correctness/noNestedComponentDefinitions: CustomDay is intentionally defined inside MonthlyView for prop access. */

import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { languageToLocale } from "@/i18n/locale";
import type { DangerKey } from "@/lib/danger-levels";
import { cn } from "@/lib/utils";
import type { CalendarDay, Modifiers } from "react-day-picker";
import { useTranslation } from "react-i18next";

export type MonthData = Record<DangerKey, Partial<Record<Sensor, Array<Date>>>>;

type MonthlyProps = {
	selectedDay: Date;
	exposureType?: Sensor;
	data: MonthData;
};

import { type PopupData, PopupModal } from "@/components/view-popup";
import { useState } from "react";
import type { Sensor } from "../sensor-picker/sensors";

export function CalendarWidget({ selectedDay, data }: MonthlyProps) {
	const { i18n } = useTranslation();

	const [popupData, setPopupData] = useState<{
		day: Date | null;
		open: boolean;
		exposures: PopupData | null;
	}>({ day: null, open: false, exposures: null });

	const dayKey = (d: Date) => d.toDateString();

	const safeDaysSet = new Set(Object.values(data.safe).flat().map(dayKey));
	const warningDaysSet = new Set(
		Object.values(data.warning).flat().map(dayKey),
	);
	const dangerDaysSet = new Set(Object.values(data.danger).flat().map(dayKey));

	// Remove duplicates
	warningDaysSet.forEach((d) => {
		if (dangerDaysSet.has(d)) warningDaysSet.delete(d);
	});
	safeDaysSet.forEach((d) => {
		if (dangerDaysSet.has(d) || warningDaysSet.has(d)) safeDaysSet.delete(d);
	});

	const safeDays = Array.from(safeDaysSet).map((s) => new Date(s));
	const warningDays = Array.from(warningDaysSet).map((s) => new Date(s));
	const dangerDays = Array.from(dangerDaysSet).map((s) => new Date(s));

	const hasData = (list: Array<Date>, d: Date) =>
		list.some((day) => day.toDateString() === d.toDateString());

	function getDayType(day: Date): Lowercase<DangerKey> | "none" {
		if (hasData(safeDays, day)) return "safe";
		if (hasData(warningDays, day)) return "warning";
		if (hasData(dangerDays, day)) return "danger";
		return "none";
	}

	function handleDayClick(clickedDay: Date) {
		const type = getDayType(clickedDay);
		if (type === "none") return;
		const exposureData = getExposureData(clickedDay);
		setPopupData({ day: clickedDay, open: true, exposures: exposureData });
	}

	function togglePopup() {
		setPopupData((p) => ({ ...p, open: !p.open }));
	}

	function navToDay() {
		// biome-ignore lint/suspicious/noConsole: We are in development duh
		console.log("Navigating to day");
	}

	function getExposureData(clickedDay: Date) {
		const exposureData: PopupData = {} as PopupData;

		(Object.keys(data) as Array<DangerKey>).forEach((dangerKey) => {
			Object.entries(data[dangerKey]).forEach(([sensor, dates]) => {
				if (dates.some((d) => d.toDateString() === clickedDay.toDateString())) {
					//Override lower danger with the higher one
					const prev = exposureData[sensor as Sensor];
					if (
						!prev ||
						(prev === "safe" && dangerKey !== "safe") ||
						(prev === "warning" && dangerKey === "danger")
					) {
						exposureData[sensor as Sensor] = dangerKey;
					}
				}
			});
		});
		return exposureData;
	}

	return (
		<>
			<Card className="w-full">
				<Calendar
					locale={languageToLocale[i18n.language]}
					month={selectedDay}
					hideNavigation
					showWeekNumber
					weekStartsOn={1}
					onDayClick={handleDayClick}
					components={{
						DayButton: (props) => (
							<CustomDay
								{...props}
								getDayType={getDayType}
								handleDayClick={handleDayClick}
							/>
						),
					}}
					modifiers={{
						safe: safeDays,
						warning: warningDays,
						danger: dangerDays,
					}}
					className="w-full bg-transparent font-bold text-foreground [--cell-size:--spacing(6)] sm:[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
					captionLayout="label"
					buttonVariant="default"
					mode="single"
				/>
			</Card>

			{/* interaction popup window */}
			{popupData.open && popupData.day && (
				<PopupModal
					title={popupData.day.toLocaleDateString(i18n.language, {
						day: "numeric",
						month: "long",
						year: "numeric",
					})}
					selectedDate={popupData.day}
					togglePopup={togglePopup}
					handleDayNav={navToDay}
					exposureData={popupData.exposures}
				></PopupModal>
			)}
		</>
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
