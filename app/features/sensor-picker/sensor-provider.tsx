import { useState } from "react";
import type { Sensor } from "./sensors";
import { SensorContext } from "./use-sensor";

export function SensorProvider({ children }: { children: React.ReactNode }) {
	const [sensor, setSensor] = useState<Sensor>("dust");

	return (
		<SensorContext value={{ sensor, setSensor }}>{children}</SensorContext>
	);
}
