import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import type {
	AggregateFnKey,
	GranularityKey,
	SensorDataRequestDto,
} from "./dto";
import type { Sensor } from "./sensors";

export type View = "day" | "week" | "month";

const viewToGranularity: Record<View, GranularityKey> = {
	day: "minute",
	week: "hour",
	month: "day",
};

const sensorViewToAggregateFn: Record<Sensor, Record<View, AggregateFnKey>> = {
	dust: {
		day: "avg",
		week: "avg",
		month: "avg",
	},
	noise: {
		day: "avg",
		week: "max",
		month: "max",
	},
	vibration: {
		day: "avg",
		week: "max",
		month: "max",
	},
};

const sensorToField: Record<Sensor, string | undefined> = {
	dust: "pm1_stel",
	noise: undefined,
	vibration: undefined,
};

function getStartEnd(view: View, selectedDay: Date) {
	if (view === "day") {
		return {
			startTime: new Date(selectedDay.setUTCHours(8)),
			endTime: new Date(selectedDay.setUTCHours(16)),
		};
	}
	if (view === "week") {
		return {
			startTime: startOfWeek(selectedDay, { weekStartsOn: 1 }),
			endTime: endOfWeek(selectedDay, { weekStartsOn: 1 }),
		};
	}
	if (view === "month") {
		return {
			startTime: startOfMonth(selectedDay),
			endTime: endOfMonth(selectedDay),
		};
	}
	throw new Error("Invalid view");
}

export function buildSensorQuery(
	sensor: Sensor,
	view: View,
	selectedDay: Date,
): SensorDataRequestDto {
	const { startTime, endTime } = getStartEnd(view, selectedDay);
	const granularity = viewToGranularity[view];
	const func = sensorViewToAggregateFn[sensor][view];
	const field = sensorToField[sensor];

	const query: SensorDataRequestDto = {
		startTime,
		endTime,
		granularity,
		function: func,
		field: field,
	};

	return query;
}
