/** biome-ignore-all lint/suspicious/noAlert: we allow alerts for testing */

import { parseAsView, type View } from "@/features/views/utils";
import { getNextDay, getPrevDay } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useTranslation } from "react-i18next";
import { DailyBarChart } from "../components/daily-bar-chart";
import { DailyNotes } from "../components/daily-notes";
import { MonthlyView } from "../components/monthly-view";
import { getSummaryForAll, Summary } from "../components/summary";
import { Button } from "../components/ui/button";
import { Notifications } from "../components/ui/notifications";
import { WeekView } from "../components/weekly-view";
import { useDate } from "../features/date-picker/use-date";
import { sensorQueryOptions } from "../lib/api";
import {
	mapAllSensorDataToMonthLists,
	mapAllWeekDataToEvents,
} from "../lib/events";
import { buildSensorQuery } from "../lib/queries";

export function meta() {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

// biome-ignore lint: page components can be default exports
export default function Home() {
	const { t, i18n } = useTranslation();

	const [view, setView] = useQueryState("view", parseAsView.withDefault("day"));
	const translatedView = t(`overview.${view}`);
	const { date, setDate } = useDate();

	const noise = useQuery(
		sensorQueryOptions({
			sensor: "noise",
			query: buildSensorQuery("noise", view, date),
		}),
	);

	const vibration = useQuery(
		sensorQueryOptions({
			sensor: "vibration",
			query: buildSensorQuery("vibration", view, date),
		}),
	);

	const dust = useQuery(
		sensorQueryOptions({
			sensor: "dust",
			query: buildSensorQuery("dust", view, date),
		}),
	);

	const data = {
		noise: noise.data ?? [],
		vibration: vibration.data ?? [],
		dust: dust.data ?? [],
	};

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
					<Select value={view} onValueChange={(value: View) => setView(value)}>
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
					<Button onClick={() => setDate(getNextDay(date, view))} size={"icon"}>
						{">"}
					</Button>
				</div>
			</div>
			<div className="flex w-full flex-col gap-4 md:flex-row">
				<div className="flex flex-col gap-4">
					<Summary exposureType="all" data={getSummaryForAll(view, data)} />
					<Notifications />
				</div>
				<div className="flex flex-1 flex-col gap-1">
					<div className="view-wrapper w-full">
						<section className="flex w-full flex-col place-items-center gap-4 pb-5">
							{view === "month" && (
								<MonthlyView
									selectedDay={date}
									data={mapAllSensorDataToMonthLists(data)}
								/>
							)}
							{view === "week" && (
								<WeekView
									dayStartHour={8}
									dayEndHour={16}
									weekStartsOn={1}
									minuteStep={60}
									events={mapAllWeekDataToEvents(data)}
									onEventClick={(event) => alert(event.dangerLevel)}
								/>
							)}
							{view === "day" && (
								<DailyBarChart
									data={data}
									chartTitle={date.toLocaleDateString(i18n.language, {
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
