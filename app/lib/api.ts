import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type {
	AllSensorData,
	AllSensors,
	SensorDataRequestDto,
	SensorDataResponseDto,
	SensorDataResult,
} from "./dto";
import { buildSensorQuery } from "./queries";
import type { Sensor, View } from "./utils";
import { sensors } from "./utils";

const baseURL = import.meta.env.VITE_BASE_URL;

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
): SensorDataResult => {
	const { data, isLoading, isError } = useQuery<Array<SensorDataResponseDto>>({
		queryKey: ["sensorData", sensor, sensorDataRequest],
		queryFn: () => fetchSensorData(sensor, sensorDataRequest),
		staleTime: 10 * 60 * 1000, //10 min
	});

	return { data, isLoading, isError };
};

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

	const everySensorData: AllSensors = Object.fromEntries(
		sensors.map((sensor, index) => [
			sensor,
			{
				data: results[index].data,
				isLoading: results[index].isLoading,
				isError: results[index].isError,
			},
		]),
	) as AllSensors;

	const isLoadingAny = Object.values(everySensorData).some(
		(res) => res.isLoading,
	);
	const isErrorAny = Object.values(everySensorData).some((res) => res.isError);

	return {
		everySensorData,
		isLoadingAny,
		isErrorAny,
	};
};
