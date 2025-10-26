import type { Sensor } from "@/features/sensor-picker/sensors";
import { type DangerKey, dangerKeys, dangerTypes } from "@/lib/danger-levels";
import type { AllSensors, SensorDataResponseDto } from "@/lib/dto";
import { thresholds } from "@/lib/thresholds";

const _mapMonthDataToDangerLists = (
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
	const mergedDays: Record<string, Lowercase<DangerKey>> = {};
	for (const level of dangerKeys) {
		for (const date of mergedData[level]) {
			const key = date.toDateString();

			const existing = mergedDays[key];
			if (!existing || dangerTypes[level] > dangerTypes[existing]) {
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
