/** biome-ignore-all lint/suspicious/noAlert: we allow alerts for testing */
/** biome-ignore-all lint/correctness/noNestedComponentDefinitions: CustomDay is intentionally defined inside MonthlyView for prop access. */

import type { Sensor } from "@/features/sensor-picker/sensors";
import { languageToLocale } from "@/i18n/locale";
import type { DangerKey } from "@/lib/danger-levels";
import { cn } from "@/lib/utils";
import type { CalendarDay, Modifiers } from "react-day-picker";
import { useTranslation } from "react-i18next";
import { Calendar } from "./ui/calendar";
import { Card } from "./ui/card";

type MonthlyProps = {
	selectedDay: Date;
	exposureType?: Sensor;
	data: Record<DangerKey, Array<Date>>;
};

import { useState } from "react";
import { PopupModal } from "./view-popup";

export function MonthlyView({ selectedDay, data }: MonthlyProps) {
	const { t, i18n } = useTranslation();

	const [popupData, setPopupData] = useState<{
		day: Date | null;
		type: Lowercase<DangerKey> | "none";
		open: boolean;
	}>({ day: null, type: "none", open: false });

	const hasData = (list: Array<Date>, d: Date) =>
		list.some((day) => day.toDateString() === d.toDateString());

	function getDayType(day: Date): Lowercase<DangerKey> | "none" {
		if (hasData(data.safe, day)) return "safe";
		if (hasData(data.warning, day)) return "warning";
		if (hasData(data.danger, day)) return "danger";
		return "none";
	}

	function handleDayClick(clickedDay: Date) {
		const type = getDayType(clickedDay);
		if (type === "none") return;
		setPopupData({ day: clickedDay, type, open: true });
	}

	function closePopup() {
		setPopupData((p) => ({ ...p, open: false }));
	}

	function navToDay() {
		// biome-ignore lint/suspicious/noConsole: We are in development duh
		console.log("Navigating to day");
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
					modifiers={{ ...data }}
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
						month: "short",
						year: "numeric",
					})}
					selectedDate={popupData.day}
					handleClose={closePopup}
					handleDayNav={navToDay}
				>
					{/* 					
					<div className="flex flex-col gap-2">
						<p>
							{t("details.forDay")}{" "}
							<strong>{popupData.day.toLocaleDateString(i18n.language)}</strong>
						</p>
						<p>{t(`details.${popupData.type}-description`)}</p>
					</div>
					<div className="flex justify-end pt-4">
						<button
							type="button"
							onClick={closePopup}
							className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
						>
							{t("close")}
						</button>
					</div> 
					*/}
				</PopupModal>
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

export function CustomDay({
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
