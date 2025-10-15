import { type ClassValue, clsx } from "clsx";
import {
	addDays,
	addMonths,
	addWeeks,
	startOfMonth,
	startOfWeek,
	subDays,
	subMonths,
	subWeeks,
} from "date-fns";
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
export type DangerKeywords = "safe" | "warning" | "danger";

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

type Threshold = {
	warning: number;
	danger: number;
};

export const thresholds: Record<Sensor, Threshold> = {
	dust: {
		warning: 80,
		danger: 100,
	},
	noise: {
		warning: 80,
		danger: 130,
	},
	vibration: {
		warning: 80,
		danger: 100,
	},
};

export const mapWeekDataToEvents = (
	data: Array<SensorDataResponseDto>,
	sensor: Sensor,
): Array<Event> => {
	const _thresholds = thresholds[sensor];

	return data.map((item) => {
		let dangerLevel: DangerLevel = "SAFE";
		if (item.value > _thresholds.warning) {
			dangerLevel = "WARNING";
		}
		if (item.value > _thresholds.danger) {
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
};

export const mapMonthDataToDangerLists = (
	data: Array<SensorDataResponseDto>,
	sensor: Sensor,
) => {
	const safe: Array<Date> = [];
	const warning: Array<Date> = [];
	const danger: Array<Date> = [];

	const _thresholds = thresholds[sensor];

	Object.values(data).forEach((item) => {
		if (item.value < _thresholds.warning) {
			safe.push(new Date(item.time));
		} else if (item.value < _thresholds.danger) {
			warning.push(new Date(item.time));
		} else {
			danger.push(new Date(item.time));
		}
	});

	return { safe, warning, danger };
};

export const mapSensorDataToMonthLists = (
	data: Array<SensorDataResponseDto>,
	relevantSensor: Sensor | undefined,
): Record<DangerKeywords, Array<Date>> => {
	if (!relevantSensor) {
		// Handle data for ALL sensors
		const dustData = mapSensorDataToMonthLists(data, "dust");
		const noiseData = mapSensorDataToMonthLists(data, "noise");
		const vibrationData = mapSensorDataToMonthLists(data, "vibration");
		return {
			safe: [...dustData.safe, ...noiseData.safe, ...vibrationData.safe],
			warning: [
				...dustData.warning,
				...noiseData.warning,
				...vibrationData.warning,
			],
			danger: [
				...dustData.danger,
				...noiseData.danger,
				...vibrationData.danger,
			],
		};
	}
	const safe: Array<Date> = [];
	const warning: Array<Date> = [];
	const danger: Array<Date> = [];

	Object.values(data).forEach((item) => {
		if (item.value < thresholds[relevantSensor].warning) {
			safe.push(new Date(item.time));
		} else if (item.value < thresholds[relevantSensor].danger) {
			warning.push(new Date(item.time));
		} else {
			danger.push(new Date(item.time));
		}
	});

	return { safe, warning, danger };
};

export const getPrevDay = (selectedDay: Date, view: View): Date => {
	if (view === "day") {
		return subDays(selectedDay, 1);
	}
	if (view === "week") {
		return startOfWeek(subWeeks(selectedDay, 1), { weekStartsOn: 1 });
	}
	return startOfMonth(subMonths(selectedDay, 1));
};

export const getNextDay = (selectedDay: Date, view: View): Date => {
	if (view === "day") {
		return addDays(selectedDay, 1);
	}
	if (view === "week") {
		return startOfWeek(addWeeks(selectedDay, 1), { weekStartsOn: 1 });
	}
	return startOfMonth(addMonths(selectedDay, 1));
};
