import type { Event } from "@/components/weekly-view";
import type { Sensor } from "@/features/sensor-picker/sensors";
import { type DangerKey, DangerTypes, dangerKeys } from "./danger-levels";
import type { AllSensors, SensorDataResponseDto } from "./dto";
import { thresholds } from "./thresholds";

export const mapWeekDataToEvents = (
	data: Array<SensorDataResponseDto>,
	sensor: Sensor,
): Array<Event> => {
	const _thresholds = thresholds[sensor];

	return data.map((item) => {
		let dangerLevel: DangerKey = "safe";
		if (item.value > _thresholds.warning) {
			dangerLevel = "warning";
		}
		if (item.value > _thresholds.danger) {
			dangerLevel = "danger";
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

export const mapAllWeekDataToEvents = (
	everySensorData: AllSensors,
): Array<Event> => {
	const dustEvents = mapWeekDataToEvents(
		everySensorData.dust ?? [],
		"dust",
	);
	const noiseEvents = mapWeekDataToEvents(
		everySensorData.noise ?? [],
		"noise",
	);
	const vibrationEvents = mapWeekDataToEvents(
		everySensorData.vibration ?? [],
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
		if (DangerTypes[ev.dangerLevel] > DangerTypes[existing.dangerLevel]) {
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
): Record<DangerKey, Array<Date>> => {
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
): Record<DangerKey, Array<Date>> => {
	const dustData = mapSensorDataToMonthLists(
		everySensorData.dust ?? [],
		"dust",
	);
	const noiseData = mapSensorDataToMonthLists(
		everySensorData.noise ?? [],
		"noise",
	);
	const vibrationData = mapSensorDataToMonthLists(
		everySensorData.vibration ?? [],
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
	const mergedDays: Record<string, Lowercase<DangerKey>> = {};
	for (const level of dangerKeys) {
		for (const date of mergedData[level]) {
			const key = date.toDateString();

			const existing = mergedDays[key];
			if (!existing || DangerTypes[level] > DangerTypes[existing]) {
				mergedDays[key] = level;
			}
		}
	}

	// Convert to the right format
	const result: Record<DangerKey, Array<Date>> = {
		safe: [],
		warning: [],
		danger: [],
	};
	for (const [key, level] of Object.entries(mergedDays)) {
		result[level].push(new Date(key));
	}

	return result;
};
