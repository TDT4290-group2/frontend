import type { Sensor } from "@/features/sensor-picker/sensors";

type Threshold = {
	warning: number;
	danger: number;
};

export const thresholds: Record<Sensor, Threshold> = {
	dust: {
		warning: 80,
		danger: 100,
	},
	noise: {
		warning: 80,
		danger: 60,
	},
	vibration: {
		warning: 100,
		danger: 400,
	},
};
