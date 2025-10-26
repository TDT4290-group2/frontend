import { t } from "i18next";
import { toast } from "sonner";
import type { Sensor } from "../lib/sensors";

export function triggerSensorAlert(
	sensor: Sensor,
	dangerLevel: "danger" | "warning",
) {
	if (dangerLevel === "danger") {
		toast.error(t("alert.danger"), {
			description: (
				<span>
					{t("alert.measuresAtCriticalLevels", {
						sensor: t(sensor),
					})}
					<br />
					{t("alert.immediateActionRequired")}
				</span>
			),
			position: "bottom-right",
			dismissible: true,
			duration: 20000,
		});
	} else {
		toast.warning(t("alert.warning"), {
			description: (
				<span>
					{t("alert.measuresExceededRecommendedLimits", {
						sensor: t(sensor),
					})}
					<br />
					{t("alert.pleaseBeCautious")}
				</span>
			),
			position: "bottom-right",
			dismissible: true,
			duration: 20000,
		});
	}
}
