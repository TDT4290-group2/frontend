import { useDate } from "@/features/date-picker/use-date";
import type { DangerKey } from "@/lib/danger-levels";
import { cn } from "@/lib/utils";
import {
	addDays,
	type Day,
	eachDayOfInterval,
	eachMinuteOfInterval,
	format,
	getDay,
	getMinutes,
	getUnixTime,
	isSameMonth,
	isSameWeek,
	isSameYear,
	isToday,
	type Locale,
	set,
	startOfDay,
	startOfWeek,
} from "date-fns";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { PopupModal, WeeklyPopup, type PopupData } from "./view-popup";

export function DaysHeader({ days }: { days: Days }) {
	return (
		<div className="sticky top-0 z-30 flex-none">
			<div className="grid grid-cols-8 text-sm leading-6">
				<div />
				{days.map((day, i) => (
					<div
						key={getUnixTime(day.date)}
						className={cn(
							`flex h-14 items-center justify-center border-card border-r border-b-2 border-l`,
							i === 0 ? "border-l-2" : "",
							i === days.length - 1 ? "border-r-2" : "",
						)}
					>
						<span
							className={
								day.isToday
									? "flex items-center font-semibold"
									: "text-muted-foreground"
							}
						>
							{day.shortName}{" "}
							<span
								className={`font-semibold ${
									day.isToday &&
									"ml-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-foreground font-bold text-secondary"
								}
                `}
							>
								{day.dayOfMonthWithZero}
							</span>
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

export function EventGrid({
		days,
		events,
		handleEventClick,
		weekStartsOn,
		minuteStep,
		rowHeight,
		dayStartHour,
		dayEndHour,
	}: {
		days: Days;
		events?: Array<Event>;
		handleEventClick: (event: Event) => void;
		weekStartsOn: Day;
		minuteStep: number;
		rowHeight: number;
		dayStartHour: number;
		dayEndHour: number;
	}) {
		return (
			<div
				style={{
					display: "grid",
					gridTemplateColumns: `repeat(${days.length + 1}, minmax(0, 1fr))`,
					gridTemplateRows: `repeat(${days[0].cells.length}, minmax(${rowHeight}px, 1fr))`,
				}}
			>
				{(events || [])
					.filter(
						(event) =>
							isSameWeek(days[0].date, event.startDate) &&
							event.endDate.getUTCHours() <= dayEndHour &&
							event.startDate.getUTCHours() >= dayStartHour,
					)
					.map((event) => {
						const start = event.startDate.getUTCHours() - dayStartHour + 1;
						const end = event.endDate.getUTCHours() - dayStartHour + 1;
						const paddingTop =
							((getMinutes(event.startDate) % minuteStep) / minuteStep) *
							rowHeight;

						const paddingBottom =
							(rowHeight -
								((getMinutes(event.endDate) % minuteStep) / minuteStep) *
									rowHeight) %
							rowHeight;

						return (
							<div
								key={event.startDate.toISOString()}
								className="relative flex transition-all"
								style={{
									gridRowStart: start,
									gridRowEnd: end,
									gridColumnStart: getDay(event.startDate) - weekStartsOn + 2,
									gridColumnEnd: "span 1",
								}}
							>
								<button
									type="button"
									className={cn(
										"absolute inset-1 flex cursor-pointer flex-col overflow-y-auto rounded-md text-xs leading-5 transition",
										`bg-${event.dangerLevel}`,
										"border-t-2 border-t-muted-foreground border-dotted",
										`${event.startDate.getUTCHours() === dayStartHour && "border-t-0"} `,
										"hover:brightness-85",
									)}
									onClick={() => handleEventClick(event)}
									style={{
										top: paddingTop,
										bottom: paddingBottom,
									}}
								/>
							</div>
						);
					})}
			</div>
		);
	}

export function Grid({
	days,
	rowHeight,
	CellContent,
}: {
	days: Days;
	rowHeight: number;
	CellContent?: (cell: Cell) => ReactNode;
}) {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: `repeat(${days.length + 1}, minmax(0, 1fr))`,
				gridTemplateRows: `repeat(${days[0].cells.length}, minmax(${rowHeight}px, 1fr))`,
			}}
		>
			{days.map((day, dayIndex) =>
				day.cells.map((cell, cellIndex) => (
					<div
						key={getUnixTime(cell.date)}
						className={cn(
							"relative border-card border-r border-l transition-colors",
							dayIndex === 0 ? "border-l-2" : "",
							dayIndex === days.length - 1 ? "border-r-2" : "",
							"bg-card-highlight",
							"border-t-2 border-t-card",
						)}
						style={{
							gridRowStart: cellIndex + 1,
							gridRowEnd: cellIndex + 2,
							gridColumnStart: dayIndex + 2,
							gridColumnEnd: dayIndex + 3,
						}}
					>
						{CellContent?.(cell)}
					</div>
				)),
			)}

			{days[0].cells.map(
				(cell, cellIndex) =>
					getMinutes(cell.date) === 0 && (
						<div
							key={getUnixTime(cell.date)}
							className="flex items-start justify-end pr-2 text-muted-foreground"
							style={{
								gridRowStart: cellIndex + 1,
								gridRowEnd: cellIndex + 2,
								gridColumnStart: 1,
								gridColumnEnd: 2,
							}}
						>
							<span className="text-md">{cell.hourAndMinute}</span>
						</div>
					),
			)}
		</div>
	);
}

export function Header({
	title,
	showTodayButton = true,
	todayButton,
	onToday,
	showPrevButton = false,
	prevButton,
	onPrev,
	showNextButton = false,
	nextButton,
	onNext,
}: {
	title: ReactNode;
	showTodayButton?: boolean;
	todayButton?: ({ onToday }: { onToday?: () => void }) => ReactNode;
	onToday?: () => void;
	showPrevButton?: boolean;
	prevButton?: ({ onPrev }: { onPrev?: () => void }) => ReactNode;
	onPrev?: () => void;
	showNextButton?: boolean;
	nextButton?: ({ onNext }: { onNext?: () => void }) => ReactNode;
	onNext?: () => void;
}) {
	const { t } = useTranslation();

	return (
		<div className="flex h-16 items-center justify-between border-card-highlight border-b-2 px-6 py-4">
			<h1 className="flex items-center gap-3 font-semibold text-base text-foreground">
				{title}
				{showTodayButton &&
					(todayButton ? (
						todayButton({ onToday })
					) : (
						<Button variant={"default"} onClick={onToday}>
							{t("today")}
						</Button>
					))}
			</h1>
			<div className="flex items-center space-x-5">
				<div className="flex space-x-1">
					{showPrevButton &&
						(prevButton ? (
							prevButton({ onPrev })
						) : (
							<Button
								size={"icon"}
								variant={"default"}
								type="button"
								onClick={onPrev}
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 15 15"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<title>{"Previous button"}</title>
									<path
										d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
										fill="currentColor"
										fillRule="evenodd"
										clipRule="evenodd"
									></path>
								</svg>
							</Button>
						))}
					{showNextButton &&
						(nextButton ? (
							nextButton({ onNext })
						) : (
							<Button size={"icon"} variant={"default"} onClick={onNext}>
								<svg
									width="16"
									height="16"
									viewBox="0 0 15 15"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<title>{"Next button"}</title>
									<path
										d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
										fill="currentColor"
										fillRule="evenodd"
										clipRule="evenodd"
									></path>
								</svg>
							</Button>
						))}
				</div>
			</div>
		</div>
	);
}

export function useWeekView({
	minuteStep = 30,
	weekStartsOn = 1,
	dayStartHour,
	dayEndHour,
	locale,
	disabledCell,
	disabledDay,
	disabledWeek,
}:
	| {
			minuteStep?: number;
			dayStartHour?: number;
			dayEndHour?: number;
			weekStartsOn?: Day;
			locale?: Locale;
			disabledCell?: (date: Date) => boolean;
			disabledDay?: (date: Date) => boolean;
			disabledWeek?: (startDayOfWeek: Date) => boolean;
	  }
	| undefined = {}) {
	const { date: selectedDay, setDate: setSelectedDay } = useDate();

	const nextWeek = () => {
		const _nextWeek = addDays(selectedDay, 7);
		if (disabledWeek?.(_nextWeek)) return;
		setSelectedDay(_nextWeek);
	};

	const previousWeek = () => {
		const _previousWeek = addDays(selectedDay, -7);
		if (disabledWeek?.(_previousWeek)) return;
		setSelectedDay(_previousWeek);
	};

	const goToToday = () => {
		setSelectedDay(startOfWeek(startOfDay(new Date()), { weekStartsOn }));
	};

	const days = eachDayOfInterval({
		start: startOfWeek(selectedDay, { weekStartsOn: 1 }),
		end: addDays(startOfWeek(selectedDay, { weekStartsOn: 1 }), 6),
	}).map((day) => ({
		date: day,
		isToday: isToday(day),
		name: format(day, "EEEE", { locale }),
		shortName: format(day, "EEE", { locale }),
		dayOfMonth: format(day, "d", { locale }),
		dayOfMonthWithZero: format(day, "dd", { locale }),
		dayOfMonthWithSuffix: format(day, "do", { locale }),
		disabled: disabledDay ? disabledDay(day) : false,
		cells: eachMinuteOfInterval(
			{
				start: set(day, {
					hours: dayStartHour,
					minutes: 0,
					seconds: 0,
					milliseconds: 0,
				}),
				end: set(day, {
					hours: dayEndHour,
					minutes: 0,
					seconds: 0,
					milliseconds: 0,
				}),
			},
			{
				step: minuteStep,
			},
		).map((hour) => ({
			date: hour,
			hour: format(hour, "HH", { locale }),
			minute: format(hour, "mm", { locale }),
			hourAndMinute: format(hour, "HH:mm", { locale }),
			disabled: disabledCell ? disabledCell(hour) : false,
		})),
	}));

	const isAllSameYear = isSameYear(days[0].date, days[days.length - 1].date);
	const isAllSameMonth = isSameMonth(days[0].date, days[days.length - 1].date);

	let viewTitle = "";
	if (isAllSameMonth) viewTitle = format(days[0].date, "MMMM yyyy", { locale });
	else if (isAllSameYear)
		viewTitle = `${format(days[0].date, "MMM", { locale })} - ${format(
			days[days.length - 1].date,
			"MMM",
			{ locale },
		)} ${format(days[0].date, "yyyy", { locale })}`;
	else
		viewTitle = `${format(days[0].date, "MMM yyyy", { locale })} - ${format(
			days[days.length - 1].date,
			"MMM yyyy",
			{ locale },
		)}`;

	const weekNumber = format(days[0].date, "w", { locale });

	return {
		nextWeek,
		previousWeek,
		goToToday,
		days,
		weekNumber,
		viewTitle,
		dayStartHour,
		dayEndHour,
	};
}

export type Days = ReturnType<typeof useWeekView>["days"];
export type Cell = Days[number]["cells"][number];

export type Event = {
	startDate: Date;
	endDate: Date;
	dangerLevel: DangerKey;
};

export function WeekView({
	minuteStep = 30,
	weekStartsOn = 1,
	dayStartHour = 8,
	dayEndHour = 16,
	locale,
	rowHeight = 56,
	disabledCell,
	disabledDay,
	disabledWeek,
	events,
}: {
	minuteStep?: number;
	weekStartsOn?: Day;
	dayStartHour?: number;
	dayEndHour?: number;
	locale?: Locale;
	rowHeight?: number;
	disabledCell?: (date: Date) => boolean;
	disabledDay?: (date: Date) => boolean;
	disabledWeek?: (startDayOfWeek: Date) => boolean;
	events?: Array<Event>;
	onCellClick?: (cell: Cell) => void;
}) {
	const { days, nextWeek, previousWeek, goToToday, viewTitle } = useWeekView({
		minuteStep,
		weekStartsOn,
		dayStartHour,
		dayEndHour,
		locale,
		disabledCell,
		disabledDay,
		disabledWeek,
	});

	const { i18n } = useTranslation();
	const [popupData, setPopupData] = useState<{
		event: Event | null;
		open: boolean;
		exposures: PopupData | null;
	}>({ event: null, open: false, exposures: null });
	
	function togglePopup() {
		setPopupData((p) => ({ ...p, open: !p.open }));
	}

	function navToDay() {
		// biome-ignore lint/suspicious/noConsole: We are in development duh
		console.log("Navigating to day");
	}

	function handleEventClick(event: Event): void {
		const exposureData = { dust: "safe", noise: "safe", vibration: "safe"} as PopupData;
		setPopupData({ event: event, open: true, exposures: exposureData });
	}

	const eventTitle = (event: Event) => {
		const actualDay = event.startDate.toLocaleDateString(i18n.language);
		const timeConfig: Intl.DateTimeFormatOptions = {
			hour: "2-digit",
			minute: "2-digit",
		};
		const start = event.startDate.toLocaleTimeString(i18n.language, timeConfig);
		const end = event.endDate.toLocaleTimeString(i18n.language, timeConfig);
		return `${actualDay}, from ${start} to ${end}`;
	}

	return (
		<Card className="w-full">
			{/* interaction popup window */}
			{popupData.open && popupData.event && (
				<WeeklyPopup
					title={eventTitle(popupData.event)}
					event={popupData.event}
					togglePopup={togglePopup}
					handleDayNav={navToDay}
					highestExposure={popupData.event.dangerLevel}
				></WeeklyPopup>
			)}
			<div className="flex flex-col overflow-hidden px-1">
				<Header
					title={viewTitle}
					onNext={nextWeek}
					onPrev={previousWeek}
					onToday={goToToday}
					showTodayButton={
						!isSameWeek(days[0].date, new Date(), {
							weekStartsOn: weekStartsOn,
						})
					}
				/>
				<div className="flex flex-1 select-none flex-col overflow-hidden">
					<div className="isolate flex flex-1 flex-col overflow-auto">
						<div className="flex min-w-[500px] flex-none flex-col">
							<DaysHeader days={days} />
							<div className="grid grid-cols-1 grid-rows-1">
								<div className="col-start-1 row-start-1">
									<Grid days={days} rowHeight={rowHeight} />
								</div>
								<div className="col-start-1 row-start-1">
									<EventGrid
										days={days}
										events={events}
										handleEventClick={handleEventClick}
										weekStartsOn={weekStartsOn}
										minuteStep={minuteStep}
										rowHeight={rowHeight}
										dayStartHour={dayStartHour}
										dayEndHour={dayEndHour}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}
