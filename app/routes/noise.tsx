import { cn, parseAsView } from "@/lib/utils";
import { useQueryState } from "nuqs";
import { ChartLineDefault, ThresholdLine } from "../components/line-chart";
import { Calendar } from "../components/ui/calendar";
import { Card } from "../components/ui/card";
import { WeeklyOverview } from "../components/weekly";
import noiseChartData from "../dummy/noise_chart_data.json";

const data = noiseChartData;

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
export default function Noise() {
	const [view] = useQueryState("view", parseAsView.withDefault("day"));

	switch (view) {
		case "day":
			return (
				<ChartLineDefault
					chartData={data}
					chartTitle="Noise Exposure"
					unit="db (TWA)"
				>
					<ThresholdLine y={120} dangerLevel="DANGER" />
					<ThresholdLine y={80} dangerLevel="WARNING" />
				</ChartLineDefault>
			);
		case "week":
			return <WeeklyOverview />;
		case "month":
			return (
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
			);
		default: {
			const exhaustiveCheck: never = view;
			throw new Error(`Unhandled view type: ${exhaustiveCheck}`);
		}
	}
}
