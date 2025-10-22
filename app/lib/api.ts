import { queryOptions } from "@tanstack/react-query";
import type { SensorDataRequestDto, SensorDataResponseDto } from "./dto";
import type { Sensor } from "./sensors";

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

export function sensorQueryOptions({
	sensor,
	query,
}: {
	sensor: Sensor;
	query: SensorDataRequestDto;
}) {
	return queryOptions({
		queryKey: [sensor, query],
		queryFn: () => fetchSensorData(sensor, query),
		staleTime: 10 * 60 * 1000, // 10 min
	});
}
