import { cn, parseAsView, type View } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/ui/select";
import { useQueryState } from "nuqs";
import { ChartLineDefault, ThresholdLine } from "../components/line-chart";
import { Calendar } from "../components/ui/calendar";
import { Card } from "../components/ui/card";
import { Notifications } from "../components/ui/notifications";
import { WeeklyOverview } from "../components/weekly";
import vibrationChartData from "../dummy/vibration_chart_data.json";

const data = vibrationChartData;

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

// biome-ignore lint: page components can be default exports
export default function Vibration() {
	const [view, setView] = useQueryState("view", parseAsView.withDefault("day"));

	return (
		<section className="flex w-full flex-col">
			<div className="flex flex-row">
				<h1 className="p-2 text-3xl">{"Vibration exposure"}</h1>
				<div className="ml-auto">
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
				</div>
			</div>
			<main className="flex w-full flex-col-reverse gap-4 md:flex-row">
				<div className="flex h-64 flex-col gap-4 overflow-y-auto rounded-xl bg-[var(--card)] p-2">
					<Notifications />
				</div>
				<div className="flex flex-1 flex-col items-end gap-4">
					{view === "month" ? (
						<Card className="w-full">
							<Calendar
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
						<WeeklyOverview />
					) : (
						<ChartLineDefault
							chartData={data}
							chartTitle="Vibration Exposure"
							unit="SEP"
						>
							<ThresholdLine y={120} dangerLevel="DANGER" />
							<ThresholdLine y={80} dangerLevel="WARNING" />
						</ChartLineDefault>
					)}
				</div>
			</main>
		</section>
	);
}
