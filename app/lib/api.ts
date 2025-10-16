import { useQueries, useQuery } from "@tanstack/react-query";
import type { SensorDataRequestDto, SensorDataResponseDto } from "./dto";
import { sensors, type Sensor, type View } from "./utils";
import { useMemo } from "react";
import { buildSensorQuery } from "./queries";

const baseURL = "http://localhost:5063/api/";

const uid = "8f1c2d3e-4b5a-6c7d-8e9f-0a1b2c3d4e5f"; //temporary

const fetchSensorData = async (
	sensor: Sensor,
	sensorDataRequest: SensorDataRequestDto,
): Promise<Array<SensorDataResponseDto>> => {
	const response = await fetch(`${baseURL}sensor/${sensor}/${uid}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(sensorDataRequest),
	});

	if (!response.ok) {
		throw new Error("Failed to fetch sensor data");
	}

	return response.json();
};


export const useSensorData = (
	sensor: Sensor,
	sensorDataRequest: SensorDataRequestDto,
) => {
	const { data, isLoading, isError } = useQuery<Array<SensorDataResponseDto>>({
		queryKey: ["sensorData", sensor, sensorDataRequest],
		queryFn: () => fetchSensorData(sensor, sensorDataRequest),
		staleTime: 10 * 60 * 1000, //10 min
	});

	return { data, isLoading, isError };
};

export type SensorDataResult = {
	sensor: Sensor;
	data: Array<SensorDataResponseDto> | undefined;
	isLoading: boolean;
	isError: boolean;
};

type AllSensorData = {
    everySensorData: Array<SensorDataResult>;
    isLoadingAny: boolean;
    isErrorAny: boolean;
}

export const useAllSensorData = (
	view: View,
	selectedDay: Date,
): AllSensorData => {
	const sensorQueries = useMemo(
		() =>
			sensors.map((sensor) => ({
				sensor,
				query: buildSensorQuery(sensor, view, selectedDay),
			})),
		[view, selectedDay],
	);

	const results = useQueries({
		queries: sensorQueries.map(({ sensor, query }) => ({
			queryKey: [`${sensor}Data`, sensor, query],
			queryFn: () => fetchSensorData(sensor, query),
			staleTime: 10 * 60 * 1000,
		})),
	});

	const everySensorData: Array<SensorDataResult> = results.map(
		(res, index) => ({
			sensor: sensors[index],
			data: res.data,
			isLoading: res.isLoading,
			isError: res.isError,
		}),
	);

	const isLoadingAny = everySensorData.some((res) => res.isLoading);
	const isErrorAny = everySensorData.some((res) => res.isError);

	return {
		everySensorData,
		isLoadingAny,
		isErrorAny,
	};
};