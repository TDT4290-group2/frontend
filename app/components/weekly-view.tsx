import {
	addDays,
	type Day,
	eachDayOfInterval,
	eachMinuteOfInterval,
	endOfDay,
	format,
	getDay,
	getHours,
	getMinutes,
	getUnixTime,
	isSameMonth,
	isSameWeek,
	isSameYear,
	isToday,
	type Locale,
	startOfDay,
	startOfWeek,
} from "date-fns";
import type { ReactNode } from "react";
import { useState } from "react";

export function DaysHeader({ days }: { days: Days }) {
	return (
		<div className="sticky top-0 z-30 flex-none bg-white shadow">
			<div className="grid grid-cols-7 text-slate-500 text-sm leading-6">
				{days.map((day, index) => (
					<div
						key={getUnixTime(day.date)}
						className={`flex h-14 items-center justify-center border-gray-100 border-l ${index === 0 && "border-l-0"}
            `}
					>
						<span className={day.isToday ? "flex items-center" : ""}>
							{day.shortName}{" "}
							<span
								className={`font-semibold text-slate-900 ${
									day.isToday &&
									"ml-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white"
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
	weekStartsOn,
	locale,
	minuteStep,
	rowHeight,
	onEventClick,
}: {
	days: Days;
	events?: Array<Event>;
	weekStartsOn: Day;
	locale?: Locale;
	minuteStep: number;
	rowHeight: number;
	onEventClick?: (event: Event) => void;
}) {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`,
				gridTemplateRows: `repeat(${days[0].cells.length}, minmax(${rowHeight}px, 1fr))`,
			}}
		>
			{(events || [])
				.filter((event) => isSameWeek(days[0].date, event.startDate))
				.map((event) => {
					const start =
						getHours(event.startDate) * 2 +
						1 +
						Math.floor(getMinutes(event.startDate) / minuteStep);
					const end =
						getHours(event.endDate) * 2 +
						1 +
						Math.ceil(getMinutes(event.endDate) / minuteStep);

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
							key={event.id}
							className="relative mt-[1px] flex transition-all"
							style={{
								gridRowStart: start,
								gridRowEnd: end,
								gridColumnStart: getDay(event.startDate) - weekStartsOn + 1,
								gridColumnEnd: "span 1",
							}}
						>
							<button
								type="button"
								className="absolute inset-1 flex cursor-pointer flex-col overflow-y-auto rounded-md border border-transparent border-dashed bg-blue-50 p-2 text-xs leading-5 transition hover:bg-blue-100"
								style={{
									top: paddingTop + 4,
									bottom: paddingBottom + 4,
								}}
								onClick={() => onEventClick?.(event)}
							>
								<p className="text-blue-500 leading-4">
									{format(new Date(event.startDate), "H:mm", {
										weekStartsOn,
										locale,
									})}
									{"-"}
									{format(new Date(event.endDate), "H:mm", {
										weekStartsOn,
										locale,
									})}
								</p>
								<p className="font-semibold text-blue-700">{event.title}</p>
							</button>
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
	onCellClick,
}: {
	days: Days;
	rowHeight: number;
	onCellClick?: (cell: Cell) => void;
	CellContent?: (cell: Cell) => ReactNode;
}) {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`,
				gridTemplateRows: `repeat(${days[0].cells.length}, minmax(${rowHeight}px, 1fr))`,
			}}
		>
			{days.map((day, dayIndex) =>
				day.cells.map((cell, cellIndex) => (
					<button
						type="button"
						key={getUnixTime(cell.date)}
						className="relative cursor-pointer border-gray-100 border-t border-l transition-colors hover:bg-slate-100 disabled:bg-slate-50"
						style={{
							gridRowStart: cellIndex + 1,
							gridRowEnd: cellIndex + 2,
							gridColumnStart: dayIndex + 1,
							gridColumnEnd: dayIndex + 2,
						}}
						disabled={cell.disabled}
						onClick={() => onCellClick?.(cell)}
					>
						{CellContent?.(cell)}
					</button>
				)),
			)}
			<div
				className="pointer-events-none sticky left-0 grid"
				style={{
					display: "grid",
					gridRowStart: 1,
					gridRowEnd: -1,
					gridColumnStart: 1,
					gridTemplateRows: `repeat(${days[0].cells.length}, minmax(${rowHeight}px, 1fr))`,
				}}
			>
				{days[0].cells.map(
					(cell, cellIndex) =>
						getMinutes(cell.date) === 0 && (
							<div
								key={getUnixTime(cell.date)}
								className="relative flex items-center justify-center border-gray-100 border-t"
								style={{
									gridRowStart: cellIndex + 1,
									gridRowEnd: cellIndex + 2,
								}}
							>
								<span className="absolute top-0 left-0 px-1 text-slate-400 text-xs">
									{cell.hourAndMinute}
								</span>
							</div>
						),
				)}
			</div>
		</div>
	);
}

export function Header({
	title,
	showTodayButton = true,
	todayButton,
	onToday,
	showPrevButton = true,
	prevButton,
	onPrev,
	showNextButton = true,
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
	return (
		<header className="flex h-16 items-center justify-between border-b bg-slate-50 px-6 py-4">
			<h1 className="flex items-center gap-3 font-semibold text-base text-slate-600">
				{title}
				{showTodayButton &&
					(todayButton ? (
						todayButton({ onToday })
					) : (
						<button
							type="button"
							className="inline-flex h-8 items-center justify-center rounded-md border border-slate-200 bg-white px-3 font-normal text-xs transition-colors hover:bg-slate-50"
							onClick={onToday}
						>
							{"Today"}
						</button>
					))}
			</h1>
			<div className="flex items-center space-x-5">
				<div className="flex space-x-1">
					{showPrevButton &&
						(prevButton ? (
							prevButton({ onPrev })
						) : (
							<button
								type="button"
								className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white font-normal text-xs transition-colors hover:bg-slate-50"
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
							</button>
						))}
					{showNextButton &&
						(nextButton ? (
							nextButton({ onNext })
						) : (
							<button
								type="button"
								className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white font-normal text-xs transition-colors hover:bg-slate-50"
								onClick={onNext}
							>
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
							</button>
						))}
				</div>
			</div>
		</header>
	);
}

export function useWeekView({
	initialDate,
	minuteStep = 30,
	weekStartsOn = 1,
	locale,
	disabledCell,
	disabledDay,
	disabledWeek,
}:
	| {
			initialDate?: Date;
			minuteStep?: number;
			weekStartsOn?: Day;
			locale?: Locale;
			disabledCell?: (date: Date) => boolean;
			disabledDay?: (date: Date) => boolean;
			disabledWeek?: (startDayOfWeek: Date) => boolean;
	  }
	| undefined = {}) {
	const [startOfTheWeek, setStartOfTheWeek] = useState(
		startOfWeek(startOfDay(initialDate || new Date()), { weekStartsOn }),
	);

	const nextWeek = () => {
		const _nextWeek = addDays(startOfTheWeek, 7);
		if (disabledWeek?.(_nextWeek)) return;
		setStartOfTheWeek(_nextWeek);
	};

	const previousWeek = () => {
		const _previousWeek = addDays(startOfTheWeek, -7);
		if (disabledWeek?.(_previousWeek)) return;
		setStartOfTheWeek(_previousWeek);
	};

	const goToToday = () => {
		setStartOfTheWeek(startOfWeek(startOfDay(new Date()), { weekStartsOn }));
	};

	const days = eachDayOfInterval({
		start: startOfTheWeek,
		end: addDays(startOfTheWeek, 6),
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
				start: startOfDay(day),
				end: endOfDay(day),
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
	};
}

export type Days = ReturnType<typeof useWeekView>["days"];
export type Cell = Days[number]["cells"][number];

export type Event = {
	id: string;
	title: string;
	startDate: Date;
	endDate: Date;
};

export function WeekView({
	initialDate,
	minuteStep = 30,
	weekStartsOn = 1,
	locale,
	rowHeight = 56,
	disabledCell,
	disabledDay,
	disabledWeek,
	events,
	onCellClick,
	onEventClick,
}: {
	initialDate?: Date;
	minuteStep?: number;
	weekStartsOn?: Day;
	locale?: Locale;
	rowHeight?: number;
	disabledCell?: (date: Date) => boolean;
	disabledDay?: (date: Date) => boolean;
	disabledWeek?: (startDayOfWeek: Date) => boolean;
	events?: Array<Event>;
	onCellClick?: (cell: Cell) => void;
	onEventClick?: (event: Event) => void;
}) {
	const { days, nextWeek, previousWeek, goToToday, viewTitle } = useWeekView({
		initialDate,
		minuteStep,
		weekStartsOn,
		locale,
		disabledCell,
		disabledDay,
		disabledWeek,
	});

	return (
		<div className="flex h-full flex-col overflow-hidden">
			<Header
				title={viewTitle}
				onNext={nextWeek}
				onPrev={previousWeek}
				onToday={goToToday}
				showTodayButton={!isSameWeek(days[0].date, new Date())}
			/>
			<div className="flex flex-1 select-none flex-col overflow-hidden">
				<div className="isolate flex flex-1 flex-col overflow-auto">
					<div className="flex min-w-[700px] flex-none flex-col">
						<DaysHeader days={days} />
						<div className="grid grid-cols-1 grid-rows-1">
							<div className="col-start-1 row-start-1">
								<Grid
									days={days}
									rowHeight={rowHeight}
									onCellClick={onCellClick}
								/>
							</div>
							<div className="col-start-1 row-start-1">
								<EventGrid
									days={days}
									events={events}
									weekStartsOn={weekStartsOn}
									locale={locale}
									minuteStep={minuteStep}
									rowHeight={rowHeight}
									onEventClick={onEventClick}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
