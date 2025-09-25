import { cn, parseAsView } from "@/lib/utils";
import { useQueryState } from "nuqs";
import { Calendar } from "../components/ui/calendar";
import { Card } from "../components/ui/card";
import { ChartLine } from "lucide-react";
import { WeeklyOverview } from "../components/weekly";
import { ChartLineDefault, ThresholdLine } from "../components/line-chart";
// import noiseChartData from "../dummy/noise_chart_data.json";
// import vibrationChartData from "../dummy/vibration_chart_data.json";
// import dustChartData from "../dummy/dust_chart_data.json";

// const noiseData = noiseChartData;
// const vibrationData = vibrationChartData;
// const dustData = dustChartData;

const noiseChartData = [
	{ x: "08:00", y: 75 },
	{ x: "10:00", y: 88 },
	{ x: "12:00", y: 92 },
	{ x: "14:00", y: 85 }
];
const vibrationChartData = [
	{ x: "08:00", y: 75 },
	{ x: "10:00", y: 88 },
	{ x: "12:00", y: 92 },
	{ x: "14:00", y: 85 }
];
const dustChartData = [
	{ x: "08:00", y: 75 },
	{ x: "10:00", y: 88 },
	{ x: "12:00", y: 92 },
	{ x: "14:00", y: 85 }
];

export function meta() {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

// biome-ignore lint: page components can be default exports
export default function Home() {
	const [view] = useQueryState("view", parseAsView.withDefault("day"));

	const greenNoiseDays = [new Date(2025, 8, 1), new Date(2025, 8, 5)];
	const yellowNoiseDays = [new Date(2025, 8, 2), new Date(2025, 8, 6)];
	const redNoiseDays = [
		new Date(2025, 8, 3),
		new Date(2025, 8, 7),
		new Date(2025, 8, 8),
	];

	switch (view) {
		case "day":
			return (
				<div>
					<div className="p-2">
						<ChartLineDefault
							chartData={noiseChartData}
							chartTitle="Noise Exposure"
							unit="db (TWA)"
							>
							<ThresholdLine y={120} dangerLevel="DANGER" />
						</ChartLineDefault>
					</div>
					<div className="p-2">
						<ChartLineDefault
							chartData={vibrationChartData}
							chartTitle="Vibration Exposure"
							unit="db (TWA)"
						>
							<ThresholdLine y={120} dangerLevel="DANGER" />
						</ChartLineDefault>
					</div>
					<div className="p-2">
						<ChartLineDefault
							chartData={dustChartData}
							chartTitle="Dust Exposure"
							unit="db (TWA)"
						>
							<ThresholdLine y={120} dangerLevel="DANGER" />
						</ChartLineDefault>
					</div>
				</div>
			);
		case "week":
			return (
				<div>
					<WeeklyOverview />;
					<WeeklyOverview />;
					<WeeklyOverview />;
				</div>
			);
		case "month":
			return (
				<div>
					<div className="p-2">
					<Card className="sm: w-full md:w-4/5 lg:w-3/4">
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
					</div>
					<div className="p-2">
					<Card className="sm: w-full md:w-4/5 lg:w-3/4">
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
					</div>
					<div className="p-2">
					<Card className="sm: w-full md:w-4/5 lg:w-3/4">
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
					</div>
				</div>
			);
		default: {
			const exhaustiveCheck: never = view;
			throw new Error(`Unhandled view type: ${exhaustiveCheck}`);
		}
	}
}
