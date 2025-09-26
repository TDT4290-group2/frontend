import { cn, parseAsSensor, type Sensor } from "@/lib/utils";
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

// import noiseChartData from "../dummy/noise_chart_data.json";
// import vibrationChartData from "../dummy/vibration_chart_data.json";
// import dustChartData from "../dummy/dust_chart_data.json";

// const noiseData = noiseChartData;
// const vibrationData = vibrationChartData;
// const dustData = dustChartData;

// Dummy data for line charts
const noiseChartData = [
	{ x: "08:00", y: 75 },
	{ x: "10:00", y: 88 },
	{ x: "12:00", y: 92 },
	{ x: "14:00", y: 85 },
];
const vibrationChartData = [
	{ x: "08:00", y: 75 },
	{ x: "10:00", y: 88 },
	{ x: "12:00", y: 92 },
	{ x: "14:00", y: 85 },
];
const dustChartData = [
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
	const [sensor, setSensor] = useQueryState(
		"sensor",
		parseAsSensor.withDefault("dust"),
	);

	const greenNoiseDays = [new Date(2025, 8, 1), new Date(2025, 8, 5)];
	const yellowNoiseDays = [new Date(2025, 8, 2), new Date(2025, 8, 6)];
	const redNoiseDays = [
		new Date(2025, 8, 3),
		new Date(2025, 8, 7),
		new Date(2025, 8, 8),
	];

	return (
		<main className="flex w-full flex-col place-items-center gap-4">
			<Select
				value={sensor}
				onValueChange={(value) => setSensor(value as Sensor | null)}
			>
				<SelectTrigger className="w-32">
					<SelectValue placeholder="View" />
				</SelectTrigger>
				<SelectContent className="w-32">
					<SelectItem key={"dust"} value={"dust"}>
						{"Dust"}
					</SelectItem>
					<SelectItem key={"noise"} value={"noise"}>
						{"Noise"}
					</SelectItem>
					<SelectItem key={"vibration"} value={"vibration"}>
						{"Vibration"}
					</SelectItem>
				</SelectContent>
			</Select>
			{sensor === "dust" ? (
				<>
					<h1 className="text-3xl">{"Your dust overview"}</h1>
					<section className="flex w-full flex-col place-items-center p-2">
						<h2 className="text-2xl">{"Daily dust exposure"}</h2>
						<ChartLineDefault
							chartData={dustChartData}
							chartTitle="Dust Exposure"
							unit="db (TWA)"
						>
							<ThresholdLine y={120} dangerLevel="DANGER" />
							{/* <ThresholdLine y={85} dangerLevel="WARNING" /> */}
						</ChartLineDefault>
					</section>
					<section className="flex w-full flex-col place-items-center p-2">
						<h2 className="text-2xl">{"Weekly dust exposure"}</h2>
						<WeeklyOverview />
					</section>
					<section className="flex w-full flex-col place-items-center p-2">
						<h2 className="text-2xl">{"Monthly dust exposure"}</h2>
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
					</section>
				</>
			) : sensor === "noise" ? (
				<>
					<h1 className="text-3xl">{"Your noise overview"}</h1>
					<section className="flex w-full flex-col place-items-center p-2">
						<h2 className="text-2xl">{"Daily noise exposure"}</h2>
						<ChartLineDefault
							chartData={noiseChartData}
							chartTitle="Noise Exposure"
							unit="db (TWA)"
						>
							<ThresholdLine y={120} dangerLevel="DANGER" />
							{/* <ThresholdLine y={85} dangerLevel="WARNING" /> */}
						</ChartLineDefault>
					</section>
					<section className="flex w-full flex-col place-items-center p-2">
						<h2 className="text-2xl">{"Weekly noise exposure"}</h2>
						<WeeklyOverview />
					</section>
					<section className="flex w-full flex-col place-items-center p-2">
						<h2 className="text-2xl">{"Monthly noise exposure"}</h2>
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
					</section>
				</>
			) : (
				<>
					<h1 className="text-3xl">{"Your vibration overview"}</h1>
					<section className="flex w-full flex-col place-items-center p-2">
						<h2 className="text-2xl">{"Daily vibration exposure"}</h2>
						<ChartLineDefault
							chartData={vibrationChartData}
							chartTitle="Vibration Exposure"
							unit="db (TWA)"
						>
							<ThresholdLine y={120} dangerLevel="DANGER" />
							{/* <ThresholdLine y={85} dangerLevel="WARNING" /> */}
						</ChartLineDefault>
					</section>
					<section className="flex w-full flex-col place-items-center p-2">
						<h2 className="text-2xl">{"Weekly vibration exposure"}</h2>
						<WeeklyOverview />
					</section>
					<section className="flex w-full flex-col place-items-center p-2">
						<h2 className="text-2xl">{"Monthly vibration exposure"}</h2>
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
					</section>
				</>
			)}
		</main>
	);
}
