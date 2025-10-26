import { Card } from "@/components/ui/card";
import { type Day, isSameWeek, type Locale } from "date-fns";
import { WeekDaysHeader } from "./components/week-days-header";
import { WeekEventGrid } from "./components/week-event-grid";
import { WeekGrid } from "./components/week-grid";
import { WeekHeader } from "./components/week-header";
import type { Cell, WeekEvent } from "./types";
import { useWeekView } from "./use-week-view";

export function WeekWidget({
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
	onEventClick,
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
	events?: Array<WeekEvent>;
	onCellClick?: (cell: Cell) => void;
	onEventClick?: (event: WeekEvent) => void;
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

	return (
		<Card className="w-full">
			<div className="flex flex-col overflow-hidden px-1">
				<WeekHeader
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
							<WeekDaysHeader days={days} />
							<div className="grid grid-cols-1 grid-rows-1">
								<div className="col-start-1 row-start-1">
									<WeekGrid days={days} rowHeight={rowHeight} />
								</div>
								<div className="col-start-1 row-start-1">
									<WeekEventGrid
										days={days}
										events={events}
										weekStartsOn={weekStartsOn}
										minuteStep={minuteStep}
										rowHeight={rowHeight}
										onEventClick={onEventClick}
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
