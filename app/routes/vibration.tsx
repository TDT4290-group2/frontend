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
		<main className="flex w-full flex-col place-items-center gap-4">
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
			{view === "month" ? (
				<Card className="sm: w-full md:w-4/5 lg:w-3/4">
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
					<ThresholdLine y={100} dangerLevel="DANGER" />
					<ThresholdLine y={80} dangerLevel="WARNING" />
				</ChartLineDefault>
			)}
		</main>
	);
}
