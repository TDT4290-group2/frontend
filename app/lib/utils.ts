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

//Temporary thresholds
export const noiseThresholds = { warning: 80, danger: 130 };
export const vibrationThresholds = { warning: 80, danger: 100 };
export const dustThresholds = { warning: 30, danger: 50 };

export const thresholds: Record<Sensor, { warning: number; danger: number }> = {
	"dust": {
		warning: 30, 
		danger: 50
	},
	"noise": {
		warning: 80, 
		danger: 130
	},
	"vibration": {
		warning: 80, 
		danger: 100
	}
}

export const mapWeekDataToEvents = (
	data: Array<SensorDataResponseDto>,
): Array<Event> =>
	data.map((item) => {
		let dangerLevel: DangerLevel = "SAFE";
		if (item.value > noiseThresholds.warning) {
			dangerLevel = "WARNING";
		}
		if (item.value > noiseThresholds.danger) {
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
		if (item.value < noiseThresholds.warning) {
			safe.push(new Date(item.time));
		} else if (item.value < noiseThresholds.danger) {
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

// For counting records of limits exceeded - simple counting, might need it more advanced?
export const summarizeDanger = (exposureType: Sensor, data: Array<SensorDataResponseDto>): number => {
	if (data.length <= 0) return 0;
	const dangerLevel = thresholds[exposureType].danger;
	return data.reduce((count, item) => item.value > dangerLevel ? count + 1 : count, 0);
}

export const summarizeWarnings = (exposureType: Sensor, data: Array<SensorDataResponseDto>): number => {
	if (data.length <= 0) return 0;
	const warningLevel = thresholds[exposureType].warning;
	return data.reduce((count, item) => item.value > warningLevel ? count + 1 : count, 0);
}

// To be used after getting counts of warnings and dangers
export const summarizeSafe = (exposureType: Sensor, data: Array<SensorDataResponseDto>): number => {
	if (data.length <= 0) return 0;
	const maxValue = thresholds[exposureType].warning;
	
	return data.filter(item => !isEmptyDataItem(item) && item.value < maxValue).length;
}
const isEmptyDataItem = (item: SensorDataResponseDto): boolean => (!item || item.value === null || item.value === 0)

export const summarizeForDays = (warningLevel: "safe" | "warning" | "danger",exposureType: Sensor, data: Array<SensorDataResponseDto>): number => {
	let hours = 0;
	if (warningLevel === "safe") hours = minutesSummaryConversion(summarizeSafe(exposureType, data));
	else if (warningLevel === "warning") hours = minutesSummaryConversion(summarizeWarnings(exposureType, data));
	else if (warningLevel === "danger") hours = minutesSummaryConversion(summarizeDanger(exposureType, data));
	return hours;
}

const minutesSummaryConversion = (number: number): number => {
	return Math.round(number / 60);
}