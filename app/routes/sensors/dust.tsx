/** biome-ignore-all lint/suspicious/noAlert: We use alert for testing, but will be changed later */

import { ChartLineDefault, ThresholdLine } from "@/components/line-chart";
import { MonthlyView } from "@/components/monthly-view";
import { Notifications } from "@/components/notifications";
import { Summary } from "@/components/summary";
import { WeekView } from "@/components/weekly-view";
import { useDate } from "@/features/date-picker/use-date";
import { useView } from "@/features/views/use-view";
import { languageToLocale } from "@/i18n/locale";
import { sensorQueryOptions } from "@/lib/api";
import type { SensorDataRequestDto } from "@/lib/dto";
import { mapSensorDataToMonthLists, mapWeekDataToEvents } from "@/lib/events";
import { thresholds } from "@/lib/thresholds";
import { useQuery } from "@tanstack/react-query";
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import { Activity } from "react";
import { useTranslation } from "react-i18next";

// biome-ignore lint: page components can be default exports
export default function Dust() {
	const { view } = useView();
	const { date } = useDate();
	const { t, i18n } = useTranslation();

	const dayQuery: SensorDataRequestDto = {
		startTime: new Date(date.setUTCHours(8)),
		endTime: new Date(date.setUTCHours(16)),
		granularity: "minute",
		function: "avg",
		field: "pm1_stel",
	};

	const weekQuery: SensorDataRequestDto = {
		startTime: startOfWeek(date, { weekStartsOn: 1 }),
		endTime: endOfWeek(date, { weekStartsOn: 1 }),
		granularity: "hour",
		function: "avg",
		field: "pm1_stel",
	};

	const monthQuery: SensorDataRequestDto = {
		startTime: startOfMonth(date),
		endTime: endOfMonth(date),
		granularity: "day",
		function: "avg",
		field: "pm1_stel",
	};

	const query =
		view === "day" ? dayQuery : view === "week" ? weekQuery : monthQuery;

	const { data } = useQuery(
		sensorQueryOptions({
			sensor: "dust",
			query,
		}),
	);

	return (
		<div className="flex w-full flex-col-reverse gap-4 md:flex-row">
			<div className="flex flex-col gap-4">
				<Summary exposureType={"dust"} data={data} />
				<Notifications />
			</div>
			<div className="flex flex-1 flex-col items-end gap-4">
				<Activity mode={view === "month" ? "visible" : "hidden"}>
					<MonthlyView
						selectedDay={date}
						data={mapSensorDataToMonthLists(data ?? [], "dust") ?? []}
					/>
				</Activity>

				<Activity mode={view === "week" ? "visible" : "hidden"}>
					<WeekView
						locale={languageToLocale[i18n.language]}
						dayStartHour={8}
						dayEndHour={16}
						weekStartsOn={1}
						minuteStep={60}
						events={mapWeekDataToEvents(data ?? [], "dust")}
						onEventClick={(event) => alert(event.dangerLevel)}
					/>
				</Activity>

				<Activity mode={view === "day" ? "visible" : "hidden"}>
					<ChartLineDefault
						chartData={data ?? []}
						chartTitle={date.toLocaleDateString(i18n.language, {
							day: "numeric",
							month: "long",
							year: "numeric",
						})}
						unit={t("points")}
						startHour={8}
						endHour={16}
						maxY={110}
					>
						<ThresholdLine y={thresholds.dust.danger} dangerLevel="danger" />
						<ThresholdLine y={thresholds.dust.warning} dangerLevel="warning" />
					</ChartLineDefault>
				</Activity>
			</div>
		</div>
	);
}
