import { type ClassValue, clsx } from "clsx";
import { parseAsStringLiteral } from "nuqs";
import { twMerge } from "tailwind-merge";
import type { Event } from "../components/weekly-view";
import type { SensorDataResponseDto } from "./dto";

export function cn(...inputs: Array<ClassValue>) {
	return twMerge(clsx(inputs));
}

export type View = "day" | "week" | "month";
const views: Array<View> = ["day", "week", "month"];
export const parseAsView = parseAsStringLiteral(views);

export type Sensor = "dust" | "noise" | "vibration";
const sensors: Array<Sensor> = ["dust", "noise", "vibration"];
export const parseAsSensor = parseAsStringLiteral(sensors);

export const DangerTypes = {
	high: "DANGER",
	medium: "WARNING",
	low: "SAFE",
} as const;

export type DangerLevel = (typeof DangerTypes)[keyof typeof DangerTypes];

type DangerLevelInfo = {
	label: string;
	color: string;
};

export const dangerLevels: Record<DangerLevel, DangerLevelInfo> = {
	DANGER: {
		label: "Threshold exceeded!",
		color: "var(--danger)",
	},
	WARNING: {
		label: "Close to exposure limit",
		color: "var(--warning)",
	},
	SAFE: {
		label: "Safely within exposure limit",
		color: "var(--safe)",
	},
};

//TODO: make generic thresholds
const noiseThresholds = [80, 130];

export const mapWeekDataToEvents = (
	data: Array<SensorDataResponseDto>,
): Array<Event> =>
	data.map((item) => {
		let dangerLevel: DangerLevel = "SAFE";
		if (item.value > noiseThresholds[0]) {
			dangerLevel = "WARNING";
		}
		if (item.value > noiseThresholds[1]) {
			dangerLevel = "DANGER";
		}

		const startDate = new Date(item.time);
		const endDate = new Date(item.time);
		endDate.setHours(endDate.getHours() + 1);

		return {
			startDate: startDate,
			endDate: endDate,
			dangerLevel: dangerLevel,
		};
	});

export const mapMonthDataToDangerLists = (
	data: Array<SensorDataResponseDto>,
) => {
	const safe: Array<Date> = [];
	const warning: Array<Date> = [];
	const danger: Array<Date> = [];

	Object.values(data).forEach((item) => {
		if (item.value < noiseThresholds[0]) {
			safe.push(new Date(item.time));
		} else if (item.value < noiseThresholds[1]) {
			warning.push(new Date(item.time));
		} else {
			danger.push(new Date(item.time));
		}
	});

	return { safe, warning, danger };
};
