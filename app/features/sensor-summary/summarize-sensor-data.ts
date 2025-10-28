import type { Sensor } from "@/features/sensor-picker/sensors";
import type { View } from "@/features/views/views";
import type { AllSensors, SensorDataResponseDto } from "@/lib/dto";
import { type Threshold, thresholds } from "@/lib/thresholds";

export type SummaryData = {
	safeCount: number;
	dangerCount: number;
	warningCount: number;
};

export const summarizeSingleSensorData = (
	view: View,
	sensor: Sensor,
	data: Array<SensorDataResponseDto>,
): SummaryData => {
	let summaryData: SummaryData = {
		safeCount: 0,
		dangerCount: 0,
		warningCount: 0,
	};

	const threshold: Threshold = thresholds[sensor];

	switch (view) {
		case "month":
			summaryData = getSummaryForMonth(data, threshold);
			break;
		case "week":
			summaryData = getSummaryForWeekly(data, threshold);
			break;
		case "day":
			summaryData = getSummaryForDay(data, threshold);
			break;

		default: {
			const exhaustiveCheck: never = view;
			throw new Error(`Unhandled view case: ${exhaustiveCheck}`);
		}
	}

	return summaryData;
};

export const summarizeAllSensorData = (
	view: View,
	data: AllSensors,
): SummaryData => {
	let allData = Object.entries(data)
		.map(
			([sensor, sensorData]) =>
				data && summarizeSingleSensorData(view, sensor as Sensor, sensorData),
		)
		.reduce(
			(acc, curr) => {
				if (!curr) return acc;
				acc.safeCount += curr.safeCount;
				acc.dangerCount += curr.dangerCount;
				acc.warningCount += curr.warningCount;
				return acc;
			},
			{ safeCount: 0, dangerCount: 0, warningCount: 0 },
		);
	if (!allData) allData = { safeCount: 0, dangerCount: 0, warningCount: 0 };
	return allData;
};

const getSummaryForMonth = (
	data: Array<SensorDataResponseDto>,
	threshold: Threshold,
): SummaryData => {
	const monthSummary = countByThreshold(data, threshold);
	return monthSummary;
};

const getSummaryForWeekly = (
	data: Array<SensorDataResponseDto>,
	threshold: Threshold,
): SummaryData => {
	const weekSummary = countByThreshold(data, threshold);
	return weekSummary;
};

const getSummaryForDay = (
	data: Array<SensorDataResponseDto>,
	threshold: Threshold,
): SummaryData => {
	const unscaledDaySummary = countByThreshold(data, threshold);
	return scaleForDay(unscaledDaySummary);
};

const countByThreshold = (
	data: Array<SensorDataResponseDto>,
	threshold: Threshold,
): SummaryData => {
	const summaryData: SummaryData = {
		safeCount: 0,
		warningCount: 0,
		dangerCount: 0,
	};

	for (const item of data) {
		if (item.value < threshold.warning) {
			summaryData.safeCount++;
		} else if (item.value < threshold.danger) {
			summaryData.warningCount++;
		} else {
			summaryData.dangerCount++;
		}
	}

	return summaryData;
};

const scaleForDay = (summaryData: SummaryData): SummaryData => ({
	dangerCount: Math.ceil(summaryData.dangerCount / 60),
	warningCount: Math.round(summaryData.warningCount / 60),
	safeCount: Math.floor(summaryData.safeCount / 60),
});
