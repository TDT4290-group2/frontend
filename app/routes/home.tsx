/** biome-ignore-all lint/suspicious/noAlert: we allow alerts for testing */

import {
	mapAllSensorDataToMonthLists,
	mapAllWeekDataToEvents,
} from "@/lib/events";
import { getNextDay, getPrevDay } from "@/lib/utils";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DailyBarChart } from "../components/daily-bar-chart";
import { DailyNotes } from "../components/daily-notes";
import { MonthlyView } from "../components/monthly-view";
import { Summary } from "../components/summary";
import { Button } from "../components/ui/button";
import { Card, CardTitle } from "../components/ui/card";
import { Notifications } from "../components/ui/notifications";
import { WeekView } from "../components/weekly-view";
import { useView } from "../features/views/use-view";
import { ViewSelect } from "../features/views/view-select";
import { languageToLocale } from "../i18n/locale";
import { sensorQueryOptions } from "../lib/api";
import { useDayContext } from "../lib/day-context";
import type { AllSensors } from "../lib/dto";
import { buildSensorQuery } from "../lib/queries";
import { sensors } from "../lib/sensors";

export function meta() {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

// biome-ignore lint: page components can be default exports
export default function Home() {
	const { t, i18n } = useTranslation();

	const { view } = useView();
	const translatedView = t(`overview.${view}`);
	const { selectedDay, setSelectedDay } = useDayContext();

	const sensorQueries = useMemo(
		() =>
			sensors.map((sensor) => ({
				sensor,
				query: buildSensorQuery(sensor, view, selectedDay),
			})),
		[view, selectedDay],
	);

	const results = useQueries({
		queries: sensorQueries.map(({ sensor, query }) =>
			sensorQueryOptions({ sensor, query }),
		),
	});

	const everySensorData: AllSensors = Object.fromEntries(
		sensors.map((sensor, index) => [
			sensor,
			{
				data: results[index].data,
				isLoading: results[index].isLoading,
				isError: results[index].isError,
			},
		]),
	) as AllSensors;

	const isLoadingAny = Object.values(everySensorData).some(
		(res) => res.isLoading,
	);
	const isErrorAny = Object.values(everySensorData).some((res) => res.isError);

	return (
		<div className="flex w-full flex-col items-center md:items-start">
			<div className="mb-4 flex w-full flex-col items-start gap-2 md:mb-0 md:flex-row md:justify-between">
				<h1 className="p-2 text-3xl">
					{t("overview.title", { view: translatedView })}
				</h1>
				<div className="flex flex-row gap-4">
					<Button
						onClick={() => setSelectedDay(getPrevDay(selectedDay, view))}
						size={"icon"}
					>
						{"<"}
					</Button>
					<ViewSelect />
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
					<Summary exposureType="all" data={everySensorData ?? []} />
					<Notifications />
				</div>
				<div className="flex flex-1 flex-col gap-1">
					<div className="view-wrapper w-full">
						<section className="flex w-full flex-col place-items-center gap-4 pb-5">
							{isLoadingAny ? (
								<Card className="flex h-24 w-full items-center">
									<p>{t("loadingData")}</p>
								</Card>
							) : isErrorAny ? (
								<Card className="flex h-24 w-full items-center">
									<p>{t("errorLoadingData")}</p>
								</Card>
							) : view === "month" ? (
								<MonthlyView
									selectedDay={selectedDay}
									data={mapAllSensorDataToMonthLists(everySensorData ?? [])}
								/>
							) : view === "week" ? (
								<WeekView
									locale={languageToLocale[i18n.language]}
									dayStartHour={8}
									dayEndHour={16}
									weekStartsOn={1}
									minuteStep={60}
									events={mapAllWeekDataToEvents(everySensorData ?? [])}
									onEventClick={(event) => alert(event.dangerLevel)}
								/>
							) : !everySensorData ||
								Object.values(everySensorData).every(
									(sensor) => !sensor.data || sensor.data.length === 0,
								) ? (
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
								<DailyBarChart
									data={everySensorData}
									chartTitle={selectedDay.toLocaleDateString(i18n.language, {
										day: "numeric",
										month: "long",
										year: "numeric",
									})}
								/>
							)}
							<DailyNotes />
						</section>
					</div>
				</div>
			</div>
		</div>
	);
}
