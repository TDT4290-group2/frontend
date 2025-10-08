/** biome-ignore-all lint/suspicious/noAlert: We use alert for testing, but will be changed later */
import { cn, type DangerLevel, parseAsView, type View } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/ui/select";
import { addDays, subDays } from "date-fns";
import { useQueryState } from "nuqs";
import { ChartLineDefault, ThresholdLine } from "../components/line-chart";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { Card } from "../components/ui/card";
import { type Event as _Event, WeekView } from "../components/weekly-view";
import dustChartData from "../dummy/dust_chart_data.json";
import eventsData from "../dummy/weekly-events.json";
import { useDayContext } from "../lib/day-context";

const data = dustChartData;

const greenDays = [
	new Date(2025, 8, 1),
	new Date(2025, 8, 5),
	new Date(2025, 8, 4),
	new Date(2025, 8, 9),
	new Date(2025, 8, 10),
	new Date(2025, 8, 12),
	new Date(2025, 8, 15),
	new Date(2025, 8, 16),
	new Date(2025, 8, 18),
	new Date(2025, 8, 19),
];
const yellowDays = [new Date(2025, 8, 2), new Date(2025, 8, 11)];
const redDays = [
	new Date(2025, 8, 3),
	new Date(2025, 8, 17),
	new Date(2025, 8, 8),
];

const raw = eventsData;

const events: Array<_Event> = raw.map((e) => ({
	startDate: new Date(e.startDate),
	endDate: new Date(e.endDate),
	dangerLevel: e.dangerLevel as DangerLevel,
}));

// biome-ignore lint: page components can be default exports
export default function Dust() {
	const [view, setView] = useQueryState("view", parseAsView.withDefault("day"));
	const { selectedDay, setSelectedDay } = useDayContext();

	return (
		<main className="flex w-full flex-col place-items-center gap-4">
			<div className="flex gap-4">
				{view === "day" && (
					<Button
						onClick={() => setSelectedDay(subDays(selectedDay, 1))}
						size={"icon"}
					>
						{"<"}
					</Button>
				)}
				<Select
					value={view}
					onValueChange={(value) => setView(value as View | null)}
				>
					<SelectTrigger className="w-32">
						<SelectValue placeholder="View" />
					</SelectTrigger>
					<SelectContent className="w-32">
						<SelectItem key={"day"} value={"day"}>
							{"Day"}
						</SelectItem>
						<SelectItem key={"week"} value={"week"}>
							{"Week"}
						</SelectItem>
						<SelectItem key={"month"} value={"month"}>
							{"Month"}
						</SelectItem>
					</SelectContent>
				</Select>
				{view === "day" && (
					<Button
						onClick={() => setSelectedDay(addDays(selectedDay, 1))}
						size={"icon"}
					>
						{">"}
					</Button>
				)}
			</div>
			{view === "month" ? (
				<Card className="w-full md:w-4/5 lg:w-3/4">
					<Calendar
						defaultMonth={selectedDay}
						fixedWeeks
						showWeekNumber
						disabled
						mode="single"
						weekStartsOn={1}
						modifiers={{
							safe: greenDays,
							warning: yellowDays,
							danger: redDays,
						}}
						modifiersClassNames={{
							safe: cn("bg-green-500 dark:bg-green-700"),
							warning: cn("bg-orange-500 dark:bg-orange-700"),
							danger: cn("bg-red-500 dark:bg-red-700"),
							disabled: cn("m-2 rounded-2xl text-black dark:text-white"),
						}}
						className="w-full bg-transparent font-bold text-foreground [--cell-size:--spacing(6)] sm:[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
						captionLayout="dropdown"
						buttonVariant="ghost"
					/>
				</Card>
			) : view === "week" ? (
				<Card className="w-full md:w-4/5 lg:w-3/4">
					<WeekView
						initialDate={selectedDay}
						dayStartHour={8}
						dayEndHour={16}
						weekStartsOn={1}
						minuteStep={60}
						events={events}
						onEventClick={(event) => alert(event.dangerLevel)}
					/>
				</Card>
			) : (
				<ChartLineDefault
					chartData={data}
					chartTitle={selectedDay.toLocaleDateString("en-GB", {
						day: "numeric",
						month: "long",
					})}
					unit="TWA"
				>
					<ThresholdLine y={120} dangerLevel="DANGER" />
					<ThresholdLine y={80} dangerLevel="WARNING" />
				</ChartLineDefault>
			)}
		</main>
	);
}
