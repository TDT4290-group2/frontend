import { useQuery } from "@tanstack/react-query";
import type { SensorDataRequestDto, SensorDataResponseDto } from "./dto";
import type { Sensor } from "./utils";

const baseURL = "http://localhost:5063/api/";

const uid = "8f1c2d3e-4b5a-6c7d-8e9f-0a1b2c3d4e5f"; //temporary

export const useSensorData = (
	sensor: Sensor,
	sensorDataRequest: SensorDataRequestDto,
) => {
	const { data, isLoading } = useQuery<SensorDataResponseDto[]>({
		queryKey: [sensor, sensorDataRequest],
		queryFn: async (): Promise<SensorDataResponseDto[]> => {
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
		},
	});

	return { data, isLoading };
};
