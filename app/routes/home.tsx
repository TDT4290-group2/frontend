/** biome-ignore-all lint/suspicious/noAlert: we allow alerts for testing */

import { DailyBarChart } from "@/components/daily-bar-chart";
import { DailyNotes } from "@/components/daily-notes";
import { MonthlyView } from "@/components/monthly-view";
import { Notifications } from "@/components/notifications";
import { Summary } from "@/components/summary";
import { Button } from "@/components/ui/button";
import { WeekView } from "@/components/weekly-view";
import { useDate } from "@/features/date-picker/use-date";
import { sensors } from "@/features/sensor-picker/sensors";
import { useView } from "@/features/views/use-view";
import { ViewSelect } from "@/features/views/view-select";
import { languageToLocale } from "@/i18n/locale";
import { sensorQueryOptions } from "@/lib/api";
import type { AllSensors } from "@/lib/dto";
import {
	mapAllSensorDataToMonthLists,
	mapAllWeekDataToEvents,
} from "@/lib/events";
import { buildSensorQuery } from "@/lib/queries";
import { getNextDay, getPrevDay } from "@/lib/utils";
import { useQueries } from "@tanstack/react-query";
import { Activity, useMemo } from "react";
import { useTranslation } from "react-i18next";

// biome-ignore lint: page components can be default exports
export default function Home() {
	const { t, i18n } = useTranslation();

	const { view } = useView();
	const translatedView = t(`overview.${view}`);
	const { date, setDate } = useDate();

	const sensorQueries = useMemo(
		() =>
			sensors.map((sensor) => ({
				sensor,
				query: buildSensorQuery(sensor, view, date),
			})),
		[view, date],
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

	return (
		<div className="flex w-full flex-col items-center md:items-start">
			<div className="mb-4 flex w-full flex-col items-start gap-2 md:mb-0 md:flex-row md:justify-between">
				<h1 className="p-2 text-3xl">
					{t("overview.title", { view: translatedView })}
				</h1>
				<div className="flex flex-row gap-4">
					<Button onClick={() => setDate(getPrevDay(date, view))} size={"icon"}>
						{"<"}
					</Button>
					<ViewSelect />
					<Button onClick={() => setDate(getNextDay(date, view))} size={"icon"}>
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
							<Activity mode={view === "month" ? "visible" : "hidden"}>
								<MonthlyView
									selectedDay={date}
									data={mapAllSensorDataToMonthLists(everySensorData ?? [])}
								/>
							</Activity>
							<Activity mode={view === "week" ? "visible" : "hidden"}>
								<WeekView
									locale={languageToLocale[i18n.language]}
									dayStartHour={8}
									dayEndHour={16}
									weekStartsOn={1}
									minuteStep={60}
									events={mapAllWeekDataToEvents(everySensorData ?? [])}
									onEventClick={(event) => alert(event.dangerLevel)}
								/>
							</Activity>

							<Activity mode={view === "day" ? "visible" : "hidden"}>
								<DailyBarChart
									data={everySensorData}
									chartTitle={date.toLocaleDateString(i18n.language, {
										day: "numeric",
										month: "long",
										year: "numeric",
									})}
								/>
							</Activity>
							<DailyNotes />
						</section>
					</div>
				</div>
			</div>
		</div>
	);
}
