import {
	Item,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import { Icon } from "@/features/icon";
import { NotificationPopup } from "@/features/popups/notification-popup";
import { usePopup } from "@/features/popups/use-popup";
import type { DangerKey } from "@/lib/danger-levels";
import type { NotificationResponseDto } from "@/lib/dto";
import { getNotifications } from "@/lib/notification-api";
import type { Sensor } from "@/lib/sensors";
import { cn } from "@/lib/utils";
import { Card } from "@/ui/card";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Parses Date objects into "dd.mm hh.mm"
function formatNotificationDate(date: Date): string {
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const hour = String(date.getHours()).padStart(2, "0");
	const minute = String(date.getMinutes()).padStart(2, "0");
	return `${day}.${month} ${hour}.${minute}`;
}

function mapNotificationToFrontend(n: NotificationResponseDto) {
	const sensorMap: Record<string, Sensor> = {
		Noise: "noise",
		Dust: "dust",
		Vibration: "vibration",
	};

	const dangerMap: Record<string, DangerKey> = {
		High: "danger",
		Medium: "warning",
	};

	return {
		id: n.id,
		sensor: sensorMap[n.dataType ?? "Noise"],
		dangerLevel: dangerMap[n.exceedingLevel ?? "Low"],
		date: n.happenedAt ? new Date(n.happenedAt) : new Date(),
	};
}

type NotifData = {
	date: Date;
	sensor: Sensor;
	dangerLevel: DangerKey;
	id: string;
};

export function Notifications({
	onParentClose,
}: {
	onParentClose: () => void;
}) {
	const { t, i18n } = useTranslation();
	const { visible, openPopup, closePopup } = usePopup();
	const [selectedNotification, setSelectedNotification] =
		useState<NotifData | null>(null);
	const [notifications, setNotifications] = useState<Array<NotifData>>([]);

	useEffect(() => {
		async function fetchData() {
			try {
				const res = await getNotifications();
				setNotifications(res.map(mapNotificationToFrontend));
			} catch (e) {
				console.error("Failed to fetch notifications:", e);
			}
		}
		fetchData();
	}, []);

	const closeAll = () => {
		closePopup();
		onParentClose();
	};

	function handleNotifClick(clickedNotif: NotifData): void {
		setSelectedNotification(clickedNotif);
		openPopup();
	}
	return (
		<>
			<Card className="h-64 w-full gap-0 overflow-y-auto px-4">
				<ItemGroup className="gap-1" role="list">
					{notifications.length > 0 ? (
						notifications.map(({ id, sensor, date, dangerLevel }) => (
							<button
								type={"button"}
								key={`${date} ${sensor} ${dangerLevel}`}
								onClick={() =>
									handleNotifClick({ id, date, sensor, dangerLevel })
								}
								className="cursor-pointer"
							>
								<Item
									variant="outline"
									role="listitem"
									size="sm"
									className="rounded-3xl border-3 border-border bg-background hover:bg-card-highlight"
								>
									<ItemMedia variant="default" className="pt-1">
										<Icon variant={sensor} size="medium" />
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
						))
					) : (
						<li className="text-center text-2xl text-muted-foreground">
							{t(($) => $.popup.noNotifications)}
						</li>
					)}
				</ItemGroup>
			</Card>
			{selectedNotification && (
				<NotificationPopup
					open={visible}
					onClose={closeAll}
					relevantDate={selectedNotification.date}
					title={t(($) => $.popup.notifTitle, {
						date: selectedNotification.date.toLocaleDateString(i18n.language, {
							day: "numeric",
							month: "long",
							hour: "2-digit",
							minute: "2-digit",
						}),
					})}
					pathname={`/${selectedNotification.sensor}`}
				>
					<div className="flex justify-start gap-2">
						<span
							className={cn(
								"rounded-full text-center font-medium capitalize",
								`bg-${selectedNotification.dangerLevel} ${selectedNotification.dangerLevel === "danger" && "text-secondary"}`,
								"h-fit w-fit px-2",
							)}
						>
							{t(($) => $[selectedNotification.sensor as Sensor])}
						</span>
						<span className="text-muted-foreground">{"->"}</span>
						<div className={`text-${selectedNotification.dangerLevel}`}>
							{t(($) => $.popup[selectedNotification.dangerLevel])}
						</div>
					</div>
				</NotificationPopup>
			)}
		</>
	);
}
