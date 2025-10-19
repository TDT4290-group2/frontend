import { type ClassValue, clsx } from "clsx";
import {
	addDays,
	addMonths,
	addWeeks,
	subDays,
	subMonths,
	subWeeks,
} from "date-fns";
import { parseAsStringLiteral } from "nuqs";
import { twMerge } from "tailwind-merge";
import type { Event } from "../components/weekly-view";
import type { AllSensors, SensorDataResponseDto } from "./dto";

export function cn(...inputs: Array<ClassValue>) {
	return twMerge(clsx(inputs));
}

export type View = "day" | "week" | "month";
const views: Array<View> = ["day", "week", "month"];
export const parseAsView = parseAsStringLiteral(views);

export type Sensor = "dust" | "noise" | "vibration";
export const sensors: Array<Sensor> = ["dust", "noise", "vibration"];
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
		endDate.setUTCHours(endDate.getUTCHours() + 1);

		return {
			startDate: startDate,
			endDate: endDate,
			dangerLevel: dangerLevel,
		};
	});
};

const dangerPriority: Record<DangerLevel, number> = {
	SAFE: 0,
	WARNING: 1,
	DANGER: 2,
};

const toKeyword: Record<DangerLevel, DangerKeywords> = {
	SAFE: "safe",
	WARNING: "warning",
	DANGER: "danger",
};

export const mapAllWeekDataToEvents = (
	everySensorData: AllSensors,
): Array<Event> => {
	const dustEvents = mapWeekDataToEvents(
		everySensorData.dust.data ?? [],
		"dust",
	);
	const noiseEvents = mapWeekDataToEvents(
		everySensorData.noise.data ?? [],
		"noise",
	);
	const vibrationEvents = mapWeekDataToEvents(
		everySensorData.vibration.data ?? [],
		"vibration",
	);
	const allEvents = [...dustEvents, ...noiseEvents, ...vibrationEvents];

	// Avoid duplicate events - map them by start time and choose one with highest danger
	const bySlot = new Map<number, Event>();

	for (const ev of allEvents) {
		const slotKey = ev.startDate.getTime();

		const existing = bySlot.get(slotKey);
		if (!existing) {
			bySlot.set(slotKey, { ...ev });
			continue;
		}

		// choose the event with highest danger level
		if (dangerPriority[ev.dangerLevel] > dangerPriority[existing.dangerLevel]) {
			existing.dangerLevel = ev.dangerLevel;
		}
	}

	const mergedEvents = Array.from(bySlot.values()).sort(
		(a, b) => a.startDate.getTime() - b.startDate.getTime(),
	);
	return mergedEvents;
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
	relevantSensor: Sensor,
): Record<DangerKeywords, Array<Date>> => {
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

export const mapAllSensorDataToMonthLists = (
	everySensorData: AllSensors,
): Record<DangerKeywords, Array<Date>> => {
	const dustData = mapSensorDataToMonthLists(
		everySensorData.dust.data ?? [],
		"dust",
	);
	const noiseData = mapSensorDataToMonthLists(
		everySensorData.noise.data ?? [],
		"noise",
	);
	const vibrationData = mapSensorDataToMonthLists(
		everySensorData.vibration.data ?? [],
		"vibration",
	);
	const mergedData = {
		safe: [...dustData.safe, ...noiseData.safe, ...vibrationData.safe],
		warning: [
			...dustData.warning,
			...noiseData.warning,
			...vibrationData.warning,
		],
		danger: [...dustData.danger, ...noiseData.danger, ...vibrationData.danger],
	};
	// Prioritize duplicate dates based on danger level
	const mergedDays: Record<string, DangerKeywords> = {};
	for (const level of ["SAFE", "WARNING", "DANGER"] as const) {
		const dangerLevel = toKeyword[level];
		for (const date of mergedData[dangerLevel]) {
			const key = date.toDateString();

			const existing = mergedDays[key];
			if (
				!existing ||
				dangerPriority[level] >
					dangerPriority[existing.toUpperCase() as DangerLevel]
			) {
				mergedDays[key] = dangerLevel;
			}
		}
	}

	// Convert to the right format
	const result: Record<DangerKeywords, Array<Date>> = {
		safe: [],
		warning: [],
		danger: [],
	};
	for (const [key, level] of Object.entries(mergedDays)) {
		result[level].push(new Date(key));
	}

	return result;
};

export const getPrevDay = (selectedDay: Date, view: View): Date => {
	let prevDay: Date;
	if (view === "day") {
		prevDay = subDays(selectedDay, 1);
	} else if (view === "week") {
		prevDay = subWeeks(selectedDay, 1);
	} else {
		prevDay = subMonths(selectedDay, 1);
	}
	const utcPrevDay = new Date(
		Date.UTC(
			prevDay.getUTCFullYear(),
			prevDay.getUTCMonth(),
			prevDay.getUTCDate(),
		),
	);
	return utcPrevDay;
};

export const getNextDay = (selectedDay: Date, view: View): Date => {
	let nextDay: Date;
	if (view === "day") {
		nextDay = addDays(selectedDay, 1);
	} else if (view === "week") {
		nextDay = addWeeks(selectedDay, 1);
	} else {
		nextDay = addMonths(selectedDay, 1);
	}

	const utcNextDay = new Date(
		Date.UTC(
			nextDay.getUTCFullYear(),
			nextDay.getUTCMonth(),
			nextDay.getUTCDate(),
		),
	);
	return utcNextDay;
};
