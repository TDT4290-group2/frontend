import type { Sensor } from "./utils";

export enum TimeGranularity {
	Minute,
	Hour,
	Day,
}

export enum AggregationFunction {
	Avg,
	Sum,
	Min,
	Max,
	Count,
}

export type SensorDataRequestDto = {
	startTime: Date;
	endTime: Date;
	granularity: TimeGranularity;
	function: AggregationFunction;
	field?: string;
};

export type SensorDataResponseDto = {
	time: Date;
	value: number;
};

export type SensorDataResult = {
	data: Array<SensorDataResponseDto> | undefined;
	isLoading: boolean;
	isError: boolean;
};

export type AllSensors = Record<Sensor, SensorDataResult>;

export type AllSensorData = {
	everySensorData: AllSensors;
	isLoadingAny: boolean;
	isErrorAny: boolean;
};
