/** biome-ignore-all lint/suspicious/noAlert: we allow alerts for testing */
import {
	getNextDay,
	getPrevDay,
	mapWeekDataToEvents,
	parseAsView,
	type Sensor,
	type View,
} from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/ui/select";
import { useQueryState } from "nuqs";
import { DailyBarChart } from "../components/daily-bar-chart";
import { DailyNotes } from "../components/daily-notes";
import { MonthlyView } from "../components/monthly-view";
import { Button } from "../components/ui/button";
import { Card, CardTitle } from "../components/ui/card";
import { Notifications } from "../components/ui/notifications";
import Summary from "../components/ui/summary";
import { WeekView } from "../components/weekly-view";
import { useSensorData } from "../lib/api";
import { useDayContext } from "../lib/day-context";
import type { SensorDataResponseDto } from "../lib/dto";
import { buildSensorQuery } from "../lib/queries";

export function meta() {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

// biome-ignore lint: page components can be default exports
export default function Home() {
	//! Currently set up for dust - but need to implement all types.
	const [view, setView] = useQueryState("view", parseAsView.withDefault("day"));
	const { selectedDay, setSelectedDay } = useDayContext();

	const {
		data: dustData,
		isLoading: dustLoading,
		isError: dustError,
	} = useSensorData("dust", buildSensorQuery("dust", view, selectedDay));
	const {
		data: noiseData,
		isLoading: noiseLoading,
		isError: noiseError,
	} = useSensorData("noise", buildSensorQuery("noise", view, selectedDay));
	const {
		data: vibrationData,
		isLoading: vibLoading,
		isError: vibError,
	} = useSensorData(
		"vibration",
		buildSensorQuery("vibration", view, selectedDay),
	);

	const isLoading = dustLoading || vibLoading || noiseLoading;
	const isError = dustError || vibError || noiseError;
	const noData =
		(!dustData || dustData.length === 0) &&
		(!noiseData || noiseData.length === 0) &&
		(!vibrationData || vibrationData.length === 0);

	const allSensorData = {
		dust: dustData ?? [],
		noise: noiseData ?? [],
		vibration: vibrationData ?? [],
	} as Record<Sensor, Array<SensorDataResponseDto>>;

	return (
		<div className="flex w-full flex-col items-center md:items-start">
			<div className="mb-4 flex w-full flex-col items-start gap-2 md:mb-0 md:flex-row md:justify-between">
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
					<Summary view={view} exposureType="dust" data={dustData} />
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
								<MonthlyView selectedDay={selectedDay} data={dustData ?? []} />
							) : view === "week" ? (
								<WeekView
									dayStartHour={8}
									dayEndHour={16}
									weekStartsOn={1}
									minuteStep={60}
									events={mapWeekDataToEvents(dustData ?? [], "dust")}
									onEventClick={(event) => alert(event.dangerLevel)}
								/>
							) : noData ? (
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
								<DailyBarChart
									data={allSensorData}
									chartTitle={selectedDay.toLocaleDateString("en-GB", {
										day: "numeric",
										month: "long",
										year: "numeric",
									})}
									startHour={8}
									endHour={16}
								></DailyBarChart>
							)}
							<DailyNotes />
						</section>
					</div>
				</div>
			</div>
		</div>
	);
}
