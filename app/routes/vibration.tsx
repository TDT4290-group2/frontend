/** biome-ignore-all lint/suspicious/noAlert: we allow alerts for testing */
import type { View } from "@/features/views/utils";
import { parseAsView } from "@/features/views/utils";
import { getNextDay, getPrevDay, makeCumulative } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/ui/select";
import { useQuery } from "@tanstack/react-query";
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import { useQueryState } from "nuqs";
import { useTranslation } from "react-i18next";
import { ChartLineDefault, ThresholdLine } from "../components/line-chart";
import { MonthlyView } from "../components/monthly-view";
import { Summary } from "../components/summary";
import { Button } from "../components/ui/button";
import { Card, CardTitle } from "../components/ui/card";
import { Notifications } from "../components/ui/notifications";
import { WeekView } from "../components/weekly-view";
import { ViewContext } from "../features/views/use-view";
import { languageToLocale } from "../i18n/locale";
import { sensorQueryOptions } from "../lib/api";
import { useDayContext } from "../lib/day-context";
import type { SensorDataRequestDto } from "../lib/dto";
import { mapSensorDataToMonthLists, mapWeekDataToEvents } from "../lib/events";
import { thresholds } from "../lib/thresholds";

// biome-ignore lint: page components can be default exports
export default function Vibration() {
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
		function: "sum",
	};

	const query =
		view === "day" ? dayQuery : view === "week" ? weekQuery : monthQuery;

	const { data, isLoading, isError } = useQuery(
		sensorQueryOptions({
			sensor: "vibration",
			query,
		}),
	);

	return (
		<ViewContext value={{ view, setView }}>
			<section className="flex w-full flex-col">
				<div className="flex flex-row">
					<h1 className="p-2 text-3xl">{t("vibrationExposure.title")}</h1>
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
						<Summary exposureType={"vibration"} data={makeCumulative(data)} />
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
								data={mapSensorDataToMonthLists(data ?? [], "vibration")}
							/>
						) : view === "week" ? (
							<WeekView
								locale={languageToLocale[i18n.language]}
								dayStartHour={8}
								dayEndHour={16}
								weekStartsOn={1}
								minuteStep={60}
								events={mapWeekDataToEvents(makeCumulative(data), "vibration")}
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
								chartData={makeCumulative(data)}
								chartTitle={selectedDay.toLocaleDateString(i18n.language, {
									day: "numeric",
									month: "long",
									year: "numeric",
								})}
								unit={t("points")}
								startHour={8}
								endHour={16}
								maxY={450}
								lineType="monotone"
							>
								<ThresholdLine
									y={thresholds.vibration.danger}
									dangerLevel="danger"
								/>
								<ThresholdLine
									y={thresholds.vibration.warning}
									dangerLevel="warning"
								/>
							</ChartLineDefault>
						)}
					</div>
				</div>
			</section>
		</ViewContext>
	);
}
