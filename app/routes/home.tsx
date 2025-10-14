import { cn, dustThresholds, getNextDay, getPrevDay, mapMonthDataToDangerLists, mapWeekDataToEvents, noiseThresholds, parseAsView, type View } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/ui/select";
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import { useQueryState } from "nuqs";
import { DailyNotes } from "../components/daily-notes";
import { ChartLineDefault, ThresholdLine } from "../components/line-chart";
import { Button } from "../components/ui/button";
import { Card, CardTitle } from "../components/ui/card";
import { Notifications } from "../components/ui/notifications";
import Summary from "../components/ui/summary";
import { WeekView } from "../components/weekly-view";
import { useDayContext } from "../lib/day-context";
import { MonthlyView } from "../components/monthly-view";

import { useSensorData } from "../lib/api";
import { AggregationFunction, TimeGranularity, type SensorDataRequestDto } from "../lib/dto";

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

	// TEMP queries - need to be adjusted so data for all sensors are fetched
	const dayQuery: SensorDataRequestDto = {
		startTime: new Date(selectedDay.setHours(8)),
		endTime: new Date(selectedDay.setHours(16)),
		granularity: TimeGranularity.Minute,
		function: AggregationFunction.Avg,
		fields: ["pm1_stel"],
	};

	const weekQuery: SensorDataRequestDto = {
		startTime: startOfWeek(selectedDay),
		endTime: endOfWeek(selectedDay),
		granularity: TimeGranularity.Hour,
		function: AggregationFunction.Avg,
		fields: ["pm1_stel"],
	};

	const monthQuery: SensorDataRequestDto = {
		startTime: startOfMonth(selectedDay),
		endTime: endOfMonth(selectedDay),
		granularity: TimeGranularity.Day,
		function: AggregationFunction.Avg,
		fields: ["pm1_stel"],
	};

	const query =
			view === "day" ? dayQuery : view === "week" ? weekQuery : monthQuery;

	const { data, isLoading, isError } = useSensorData("dust", query);
	const { safe, warning, danger } = mapMonthDataToDangerLists(data ?? []);

	return (
		<div className="flex w-full flex-col items-center md:items-start">
			<div className="mb-4 flex w-full flex-col items-center gap-2 md:mb-0 md:flex-row md:justify-between">
				<h1 className="p-2 text-3xl">{`Overview of the ${view}`}</h1>
				<div className="flex flex-row gap-4">
					<Button
						onClick={() => setSelectedDay(getPrevDay(selectedDay, view))}
						size={"icon"}
					>
						{"<"}
					</Button>
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
					<Button
						onClick={() => setSelectedDay(getNextDay(selectedDay, view))}
						size={"icon"}
					>
						{">"}
					</Button>
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
							{isLoading ? (
								<Card className="flex h-24 w-full items-center">
									<p>{"Loading data..."}</p>
								</Card>
							) : isError ? (
								<Card className="flex h-24 w-full items-center">
									<p>{"Something went wrong while fetching sensor data."}</p>
								</Card>
							) : view === "month" ? (
								<Card className="w-full">
									<MonthlyView selectedDay={selectedDay} safeDates={safe} warningDates={warning} dangerDates={danger} />
								</Card>
							) : view === "week" ? (
								<>
									<WeekView 
										dayStartHour={8}
										dayEndHour={16}
										weekStartsOn={1}
										minuteStep={60}
										events={mapWeekDataToEvents(data ?? [])}
										onEventClick={(event) => alert(event.dangerLevel)}
									/>
								</>
							) : !data || data.length === 0 ? (
								<Card className="flex h-24 w-full items-center">
									<CardTitle>
										{selectedDay.toLocaleDateString("en-GB", {
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</CardTitle>
									<p>{"No exposure data found for this day"}</p>
								</Card>
							) : (
								<ChartLineDefault
									chartData={data ?? []}
									chartTitle={selectedDay.toLocaleDateString("en-GB", {
										day: "numeric",
										month: "long",
										year: "numeric",
									})}
									unit="points"
									startHour={8}
									endHour={16}
									maxY={110}
								>
									<ThresholdLine y={dustThresholds.danger} label="Dust" dangerLevel="DANGER" />
									<ThresholdLine y={noiseThresholds.danger} label="Noise" dangerLevel="DANGER" />
									<ThresholdLine y={noiseThresholds.danger} label="Vibration" dangerLevel="DANGER" />
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
