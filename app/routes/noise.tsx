/** biome-ignore-all lint/suspicious/noAlert: we allow alerts for testing */
import {
	getNextDay,
	getPrevDay,
	languageToLocale,
	mapSensorDataToMonthLists,
	mapWeekDataToEvents,
	parseAsView,
	thresholds,
	type View,
} from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/ui/select";
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import { useQueryState } from "nuqs";
import { useTranslation } from "react-i18next";
import { ChartLineDefault, ThresholdLine } from "../components/line-chart";
import { MonthlyView } from "../components/monthly-view";
import { Button } from "../components/ui/button";
import { Card, CardTitle } from "../components/ui/card";
import { Notifications } from "../components/ui/notifications";
import Summary from "../components/ui/summary";
import { WeekView } from "../components/weekly-view";
import { useSensorData } from "../lib/api";
import { useDayContext } from "../lib/day-context";
import type { SensorDataRequestDto } from "../lib/dto";

// biome-ignore lint: page components can be default exports
export default function Noise() {
	const [view, setView] = useQueryState("view", parseAsView.withDefault("day"));
	const { t, i18n } = useTranslation();

	const { selectedDay, setSelectedDay } = useDayContext();

	const dayQuery: SensorDataRequestDto = {
		startTime: new Date(selectedDay.setUTCHours(8)),
		endTime: new Date(selectedDay.setUTCHours(16)),
		granularity: "minute",
		function: "avg",
	};

	const weekQuery: SensorDataRequestDto = {
		startTime: startOfWeek(selectedDay, { weekStartsOn: 1 }),
		endTime: endOfWeek(selectedDay, { weekStartsOn: 1 }),
		granularity: "hour",
		function: "max",
	};

	const monthQuery: SensorDataRequestDto = {
		startTime: startOfMonth(selectedDay),
		endTime: endOfMonth(selectedDay),
		granularity: "day",
		function: "max",
	};

	const query =
		view === "day" ? dayQuery : view === "week" ? weekQuery : monthQuery;
	const { data, isLoading, isError } = useSensorData("noise", query);

	return (
		<section className="flex w-full flex-col">
			<div className="flex flex-row">
				<h1 className="p-2 text-3xl">{t("noiseExposure.title")}</h1>
				<div className="ml-auto flex flex-row gap-4">
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
								{t("day")}
							</SelectItem>
							<SelectItem key={"week"} value={"week"}>
								{t("week")}
							</SelectItem>
							<SelectItem key={"month"} value={"month"}>
								{t("month")}
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
			<div className="flex w-full flex-col-reverse gap-4 md:flex-row">
				<div className="flex flex-col gap-4">
					<Summary exposureType={"noise"} view={view} data={data} />
					<Notifications />
				</div>
				<div className="flex flex-1 flex-col items-end gap-4">
					{isLoading ? (
						<Card className="flex h-24 w-full items-center">
							<p>{t("loadingData")}</p>
						</Card>
					) : isError ? (
						<Card className="flex h-24 w-full items-center">
							<p>{t("errorLoadingData")}</p>
						</Card>
					) : view === "month" ? (
						<MonthlyView
							selectedDay={selectedDay}
							data={mapSensorDataToMonthLists(data ?? [], "noise") ?? []}
						/>
					) : view === "week" ? (
						<WeekView
							locale={languageToLocale[i18n.language]}
							dayStartHour={8}
							dayEndHour={16}
							weekStartsOn={1}
							minuteStep={60}
							events={mapWeekDataToEvents(data ?? [], "noise")}
							onEventClick={(event) => alert(event.dangerLevel)}
						/>
					) : !data || data.length === 0 ? (
						<Card className="flex h-24 w-full items-center">
							<CardTitle>
								{selectedDay.toLocaleDateString(i18n.language, {
									day: "numeric",
									month: "long",
									year: "numeric",
								})}
							</CardTitle>
							<p>{t("noData")}</p>
						</Card>
					) : (
						<ChartLineDefault
							chartData={data ?? []}
							chartTitle={selectedDay.toLocaleDateString(i18n.language, {
								day: "numeric",
								month: "long",
								year: "numeric",
							})}
							unit="db (TWA)"
							startHour={8}
							endHour={16}
							maxY={130}
						>
							<ThresholdLine y={thresholds.noise.danger} dangerLevel="DANGER" />
							<ThresholdLine
								y={thresholds.noise.warning}
								dangerLevel="WARNING"
							/>
						</ChartLineDefault>
					)}
				</div>
			</div>
		</section>
	);
}
