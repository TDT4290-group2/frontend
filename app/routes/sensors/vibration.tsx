/** biome-ignore-all lint/suspicious/noAlert: we allow alerts for testing */

import { ChartLineDefault, ThresholdLine } from "@/components/line-chart";
import { MonthlyView } from "@/components/monthly-view";
import { Notifications } from "@/components/notifications";
import { Summary, summarizeSingleSensorData } from "@/components/summary";
import { WeekView } from "@/components/weekly-view";
import { useDate } from "@/features/date-picker/use-date";
import { useView } from "@/features/views/use-view";
import { sensorQueryOptions } from "@/lib/api";
import type { SensorDataRequestDto } from "@/lib/dto";
import { mapSensorDataToMonthLists, mapWeekDataToEvents } from "@/lib/events";
import { thresholds } from "@/lib/thresholds";
import { makeCumulative } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import { Activity } from "react";
import { useTranslation } from "react-i18next";

// biome-ignore lint: page components can be default exports
export default function Vibration() {
	const { view } = useView();
	const { t, i18n } = useTranslation();

	const { date } = useDate();

	const dayQuery: SensorDataRequestDto = {
		startTime: new Date(date.setUTCHours(8)),
		endTime: new Date(date.setUTCHours(16)),
		granularity: "minute",
		function: "avg",
	};

	const weekQuery: SensorDataRequestDto = {
		startTime: startOfWeek(date, { weekStartsOn: 1 }),
		endTime: endOfWeek(date, { weekStartsOn: 1 }),
		granularity: "hour",
		function: "max",
	};

	const monthQuery: SensorDataRequestDto = {
		startTime: startOfMonth(date),
		endTime: endOfMonth(date),
		granularity: "day",
		function: "sum",
	};

	const query =
		view === "day" ? dayQuery : view === "week" ? weekQuery : monthQuery;

	const { data } = useQuery(
		sensorQueryOptions({
			sensor: "vibration",
			query,
		}),
	);

	return (
		<div className="flex w-full flex-col-reverse gap-4 md:flex-row">
			<div className="flex flex-col gap-4">
				<Summary
					exposureType={"vibration"}
					data={summarizeSingleSensorData(
						view,
						"vibration",
						makeCumulative(data),
					)}
				/>
				<Notifications />
			</div>
			<div className="flex flex-1 flex-col items-end gap-4">
				<Activity mode={view === "month" ? "visible" : "hidden"}>
					<MonthlyView
						selectedDay={date}
						data={mapSensorDataToMonthLists(data ?? [], "vibration")}
					/>
				</Activity>

				<Activity mode={view === "week" ? "visible" : "hidden"}>
					<WeekView
						dayStartHour={8}
						dayEndHour={16}
						weekStartsOn={1}
						minuteStep={60}
						events={mapWeekDataToEvents(makeCumulative(data), "vibration")}
						onEventClick={(event) => alert(event.dangerLevel)}
					/>
				</Activity>

				<Activity mode={view === "day" ? "visible" : "hidden"}>
					<ChartLineDefault
						chartData={makeCumulative(data)}
						chartTitle={date.toLocaleDateString(i18n.language, {
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
				</Activity>
			</div>
		</div>
	);
}
