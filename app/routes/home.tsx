import { cn, parseAsView, type View } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/ui/select";
import { addDays, subDays } from "date-fns";
import { useQueryState } from "nuqs";
import { DailyNotes } from "../components/daily-notes";
import { ChartLineDefault, ThresholdLine } from "../components/line-chart";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { Card } from "../components/ui/card";
import Summary from "../components/ui/summary";
import { WeekView } from "../components/weekly-view";
import { useDayContext } from "../lib/day-context";
import { Notifications } from "../components/ui/notifications";

const tempDailyChartData = [
	{ x: "08:00", y: 75 },
	{ x: "10:00", y: 88 },
	{ x: "12:00", y: 92 },
	{ x: "14:00", y: 85 },
];

export function meta() {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

// biome-ignore lint: page components can be default exports
export default function Home() {
	const [view, setView] = useQueryState("view", parseAsView.withDefault("day"));
	const { selectedDay, setSelectedDay } = useDayContext();
	const greenNoiseDays = [new Date(2025, 8, 1), new Date(2025, 8, 5)];
	const yellowNoiseDays = [new Date(2025, 8, 2), new Date(2025, 8, 6)];
	const redNoiseDays = [
		new Date(2025, 8, 3),
		new Date(2025, 8, 7),
		new Date(2025, 8, 8),
	];

	return (
		<div className="flex w-full flex-col items-center md:items-start">
			<div className="flex flex-col items-center gap-2 mb-4 w-full md:flex-row md:justify-between md:mb-0">
				<h1 className="p-2 text-3xl">{`Overview of the ${view}`}</h1>
				<div className="flex flex-row gap-4">
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
			</div>
			<div className="flex w-full flex-col gap-4 md:flex-row">
				<div className="flex flex-col gap-4">
					<Summary />
					<Notifications />
				</div>
				<div className="flex flex-1 flex-col gap-1">
					
					<div className="view-wrapper w-full">
						<section className="flex w-full flex-col place-items-center gap-4 pb-5">
							{view === "month" ? (
								<Card className="w-full">
									<Calendar
										fixedWeeks
										showWeekNumber
										disabled
										mode="single"
										weekStartsOn={1}
										modifiers={{
											safe: greenNoiseDays,
											warning: yellowNoiseDays,
											danger: redNoiseDays,
										}}
										modifiersClassNames={{
											safe: cn("bg-[var(--safe)]"),
											warning: cn("bg-[var(--warning)]"),
											danger: cn("bg-[var(--danger)]"),
											disabled: cn("m-2 rounded-2xl text-black dark:text-white"),
										}}
										className="w-full bg-transparent font-bold text-foreground [--cell-size:--spacing(6)] sm:[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
										captionLayout="dropdown"
										buttonVariant="ghost"
									/>
								</Card>
							) : view === "week" ? (
								<>
									{/* NOTE: Should use props, if none are provided then some default values are used. Like here */}
									<WeekView />
								</>
							) : (
								<ChartLineDefault
									chartData={tempDailyChartData}
									chartTitle="Vibration Exposure"
									unit="db (TWA)"
								>
									<ThresholdLine y={120} dangerLevel="DANGER" />
									{/* <ThresholdLine y={85} dangerLevel="WARNING" /> */}
								</ChartLineDefault>
							)}
							<DailyNotes />
						</section>
					</div>
				</div>
			</div>
		</div>
	);
}
