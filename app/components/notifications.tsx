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

const notifications: Array<{
	sensor: Sensor;
	dangerLevel: DangerKey;
	date: string;
}> = [
	{
		sensor: "noise",
		dangerLevel: "warning",
		date: "01.04 9.41",
	},
	{
		sensor: "vibration",
		dangerLevel: "danger",
		date: "24.05 14.04",
	},
	{
		sensor: "dust",
		dangerLevel: "warning",
		date: "04.03 8.53",
	},
	{
		sensor: "dust",
		dangerLevel: "warning",
		date: "04.03 8.54",
	},
];

export function Notifications() {
	const { t } = useTranslation();

	return (
		<Card className="h-64 w-full gap-0 overflow-y-auto px-4">
			<ItemGroup className="gap-1" role="list">
				{notifications.map(({ sensor, date, dangerLevel }) => (
					<Item
						key={`${date} ${sensor} ${dangerLevel}`}
						variant="outline"
						role="listitem"
						size="sm"
						className="rounded-3xl border-3 border-border bg-background"
					>
						<ItemMedia variant="image">
							{sensor === "noise" && (
								// biome-ignore lint/a11y/useAltText: alt text not needed for decorative images
								<img src={noiseIcon} width={200} height={200} />
							)}
							{sensor === "dust" && (
								// biome-ignore lint/a11y/useAltText: alt text not needed for decorative images
								<img src={dustIcon} width={512} height={512} />
							)}
							{sensor === "vibration" && (
								// biome-ignore lint/a11y/useAltText: alt text not needed for decorative images
								<img src={vibrationIcon} width={512} height={512} />
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
							<span>{date}</span>
						</ItemContent>
					</Item>
				))}
			</ItemGroup>
		</Card>
	);
}
