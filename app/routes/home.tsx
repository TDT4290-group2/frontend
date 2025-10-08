import { cn, parseAsView, type View } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/ui/select";
import { useQueryState } from "nuqs";
import { DailyNotes } from "../components/daily-notes";
import { ChartLineDefault, ThresholdLine } from "../components/line-chart";
import { Calendar } from "../components/ui/calendar";
import { Card } from "../components/ui/card";
import { WeekView } from "../components/weekly-view";
import Summary from "../components/ui/summary";

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

	const greenNoiseDays = [new Date(2025, 8, 1), new Date(2025, 8, 5)];
	const yellowNoiseDays = [new Date(2025, 8, 2), new Date(2025, 8, 6)];
	const redNoiseDays = [
		new Date(2025, 8, 3),
		new Date(2025, 8, 7),
		new Date(2025, 8, 8),
	];

	return (
		<main className="flex flex-col md:flex-row w-full gap-4 md:items-start items-center">
			<div className="flex flex-col flex-wrap w-fit md:flex-1 pl-2">
				<Summary />
			</div>
			<div className="flex flex-col w-11/12 md:flex-2 ">
				<div className="select-wrapper flex self-center justify-center text-center">
				<Select
					value={view}
					onValueChange={(value) => setView(value as View | null)}
				>
					<SelectTrigger className="w-32 bg-background">
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
				</div>
				<div className="view-wrapper w-full">
					<h1 className="text-3xl pl-4">Overview of the {view}</h1>
					{view === "month" ? (
						<>
							<section className="flex w-full flex-col place-items-center p-2">
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
							</section>
						</>
					) : view === "week" ? (
						<>
							<section className="flex w-full flex-col place-items-center p-2">
								{/* NOTE: Should use props, if none are provided then some default values are used. Like here */}
								<WeekView />
							</section>
						</>
					) : (
						<>
							<section className="flex w-full flex-col place-items-center p-2">
								
								<ChartLineDefault
									chartData={tempDailyChartData}
									chartTitle="Vibration Exposure"
									unit="db (TWA)"
								>
									<ThresholdLine y={120} dangerLevel="DANGER" />
									{/* <ThresholdLine y={85} dangerLevel="WARNING" /> */}
								</ChartLineDefault>
							</section>
						</>
					)}
				</div>
				
			</div>
		</main>
	);
}
