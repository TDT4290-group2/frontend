import type { Sensor } from "@/features/sensor-picker/sensors";

type Threshold = {
	warning: number;
	danger: number;
};

export const thresholds: Record<Sensor, Threshold> = {
	dust: {
		warning: 69,
		danger: 100,
	},
	noise: {
		warning: 120,
		danger: 130,
	},
	vibration: {
		warning: 100,
		danger: 400,
	},
};
