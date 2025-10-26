import type { Sensor } from "@/features/sensor-picker/sensors";
import type { View } from "@/features/views/views";
import type { AllSensors, SensorDataResponseDto } from "@/lib/dto";
import { thresholds } from "@/lib/thresholds";

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
	const summaryData = { safeCount: 0, dangerCount: 0, warningCount: 0 };

	const threshold = thresholds[sensor];

	switch (view) {
		case "month":
			for (const item of data) {
				if (item.value < threshold.warning) {
					summaryData.safeCount++;
				} else if (item.value < threshold.danger) {
					summaryData.warningCount++;
				} else {
					summaryData.dangerCount++;
				}
			}
			break;
		case "week":
			for (const item of data) {
				if (item.value < threshold.warning) {
					summaryData.safeCount++;
				} else if (item.value < threshold.danger) {
					summaryData.warningCount++;
				} else {
					summaryData.dangerCount++;
				}
			}
			break;
		case "day":
			for (const item of data) {
				if (item.value < threshold.warning) {
					summaryData.safeCount++;
				} else if (item.value < threshold.danger) {
					summaryData.warningCount++;
				} else {
					summaryData.dangerCount++;
				}
			}
			summaryData.dangerCount = Math.ceil(summaryData.dangerCount / 60);
			summaryData.warningCount = Math.round(summaryData.warningCount / 60);
			summaryData.safeCount = Math.floor(summaryData.safeCount / 60);
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
