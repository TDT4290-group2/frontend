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
	endTime?: Date;
	granularity: TimeGranularity;
	function: AggregationFunction;
	fields?: Array<string>;
};

export type SensorDataResponseDto = {
	time: Date;
	value: number;
};
