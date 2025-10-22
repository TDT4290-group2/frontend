/** biome-ignore-all lint/suspicious/noAlert: we allow alerts for testing */

import {
	mapAllSensorDataToMonthLists,
	mapAllWeekDataToEvents,
} from "@/lib/events";
import { getNextDay, getPrevDay } from "@/lib/utils";
import { parseAsView, type View } from "@/lib/views";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/ui/select";
import { useQueryState } from "nuqs";
import { useTranslation } from "react-i18next";
import { DailyBarChart } from "../components/daily-bar-chart";
import { DailyNotes } from "../components/daily-notes";
import { MonthlyView } from "../components/monthly-view";
import { Summary } from "../components/summary";
import { Button } from "../components/ui/button";
import { Card, CardTitle } from "../components/ui/card";
import { Notifications } from "../components/ui/notifications";
import { WeekView } from "../components/weekly-view";
import { languageToLocale } from "../i18n/locale";
import { useAllSensorData } from "../lib/api";
import { useDayContext } from "../lib/day-context";

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
	const { selectedDay, setSelectedDay } = useDayContext();

	const { everySensorData, isLoadingAny, isErrorAny } = useAllSensorData(
		view,
		selectedDay,
	);

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
					<Summary
						exposureType="all"
						view={view}
						data={everySensorData ?? []}
					/>
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
