import type { Sensor } from "@/features/sensor-picker/sensors";

export const granularityEnum = {
	minute: 0,
	hour: 1,
	day: 2,
} as const;
export type GranularityKey = keyof typeof granularityEnum;
export type GranularityValue = (typeof granularityEnum)[GranularityKey];

export const aggregateFnEnum = {
	avg: 0,
	sum: 1,
	min: 2,
	max: 3,
	count: 4,
} as const;
export type AggregateFnKey = keyof typeof aggregateFnEnum;
export type AggregateFnValue = keyof (typeof aggregateFnEnum)[AggregateFnKey];

export type SensorDataRequestDto = {
	startTime: Date;
	endTime: Date;
	granularity: GranularityKey;
	function: AggregateFnKey;
	field?: string;
};

export type SensorDataResponseDto = {
	time: Date;
	value: number;
};

export type AllSensors = Record<Sensor, Array<SensorDataResponseDto>>;
