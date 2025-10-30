import {
	Item,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import type { DangerKey } from "@/lib/danger-levels";
import type { Sensor } from "@/lib/sensors";
import { cn } from "@/lib/utils";
import { Card } from "@/ui/card";
import { useTranslation } from "react-i18next";
import dustIcon from "/icons/dustIcon.png";
import noiseIcon from "/icons/noiseIcon.png";
import vibrationIcon from "/icons/vibrationIcon.png";
import { Button } from "./ui/button";
import { usePopup } from "@/features/popups/usePopup";
import { NotificationPopup } from "@/features/popups/notification-popup";
import { useState } from "react";

const notifications: Array<{
	sensor: Sensor;
	dangerLevel: DangerKey;
	date: Date;
}> = [
	{
		sensor: "noise",
		dangerLevel: "warning",
		// "01.04 9.41" → 1 April 2025, 09:41
		date: new Date(2025, 3, 1, 9, 41),
	},
	{
		sensor: "vibration",
		dangerLevel: "danger",
		// "24.05 14.04" → 24 May 2025, 14:04
		date: new Date(2025, 4, 24, 14, 4),
	},
	{
		sensor: "dust",
		dangerLevel: "warning",
		// "04.03 8.53" → 4 March 2025, 08:53
		date: new Date(2025, 2, 4, 8, 53),
	},
	{
		sensor: "dust",
		dangerLevel: "warning",
		// "04.03 8.54" → 4 March 2025, 08:54
		date: new Date(2025, 2, 4, 8, 54),
	},
];

type NotifData = {
	date: Date;
	sensor: Sensor;
	dangerLevel: DangerKey;
};

export function Notifications() {
	const { t, i18n } = useTranslation();

	const { visible, openPopup, closePopup } = usePopup();

	const [notifData, setNotifData] = useState<NotifData | null>(null);

	function handleNotifClick(clickedNotif: NotifData): void {
		setNotifData(clickedNotif);
		openPopup();
	}

	return (
		<>
			<Card className="h-64 w-full gap-0 overflow-y-auto px-4">
				<ItemGroup className="gap-1" role="list">
					{notifications.map(({ sensor, date, dangerLevel }) => (
						<button
							type={"button"}
							key={`${date} ${sensor} ${dangerLevel}`}
							onClick={() => handleNotifClick({ date, sensor, dangerLevel })}
							className="cursor-pointer"
						>
							<Item
								variant="outline"
								role="listitem"
								size="sm"
								className="rounded-3xl border-3 border-border bg-background hover:bg-card-highlight"
							>
								<ItemMedia variant="image">
									{sensor === "noise" && (
										<img
											src={noiseIcon}
											alt={"noise symbol"}
											width={200}
											height={200}
										/>
									)}
									{sensor === "dust" && (
										<img
											src={dustIcon}
											alt={"dust symbol"}
											width={512}
											height={512}
										/>
									)}
									{sensor === "vibration" && (
										<img
											src={vibrationIcon}
											alt={"vibration symbol"}
											width={512}
											height={512}
										/>
									)}
								</ItemMedia>
								<ItemContent>
									<ItemTitle className="line-clamp-1">
										{t(($) => $[sensor])}
									</ItemTitle>
									<ItemDescription className={cn(`text-${dangerLevel}`)}>
										{t(($) => $[dangerLevel])}
									</ItemDescription>
								</ItemContent>
								<ItemContent>
									<span>{formatNotificationDate(date)}</span>
								</ItemContent>
							</Item>
						</button>
					))}
				</ItemGroup>
			</Card>
			{notifData && (
				<NotificationPopup
					open={visible}
					onClose={closePopup}
					relevantDate={notifData.date}
					title={t(($) => $.popup.notifTitle, {
						date: notifData.date.toLocaleDateString(i18n.language, {
							day: "numeric",
							month: "long",
							hour: "2-digit",
							minute: "2-digit",
						}),
					})}
				>
					<div className="flex justify-start gap-2">
						<span
							className={cn(
								"rounded-full text-center font-medium capitalize",
								`bg-${notifData.dangerLevel} ${notifData.dangerLevel === "danger" && "text-secondary"}`,
								"h-fit w-fit px-2",
							)}
						>
							{t(($) => $[notifData.sensor as Sensor])}
						</span>
						<span className="text-muted-foreground">{"->"}</span>
						<div className={`text-${notifData.dangerLevel}`}>
							{t(($) => $.popup[notifData.dangerLevel])}
						</div>
					</div>
				</NotificationPopup>
			)}
		</>
	);
}

// Parses Date objects into the previous string format of dd.mm hh.mm
function formatNotificationDate(date: Date): string {
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const hour = String(date.getHours()).padStart(2, "0");
	const minute = String(date.getMinutes()).padStart(2, "0");

	return `${day}.${month} ${hour}.${minute}`;
}
