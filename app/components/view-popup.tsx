import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { DangerKey } from "@/lib/danger-levels";
import type { Sensor } from "@/lib/sensors";
import { cn } from "@/lib/utils";
import { DialogDescription } from "@radix-ui/react-dialog";
import { t } from "i18next";
import { PopupNotes } from "./daily-notes";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

type PopupProps = {
	title: string;
	selectedDate: Date;
	exposureData?: PopupData | null;
	togglePopup?: () => void;
	handleDayNav?: () => void;
	children?: React.ReactNode;
};

export type PopupData = Record<Sensor, DangerKey>;

export function PopupModal({
	title,
	selectedDate,
	exposureData,
	togglePopup,
	handleDayNav,
	children,
}: PopupProps) {
	return (
		<Dialog open={true} onOpenChange={togglePopup}>
			<DialogTrigger onClick={togglePopup}></DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="font-bold text-xl">{title}</DialogTitle>
				</DialogHeader>
				<DialogDescription className="font-medium text-xl">
					{t(($) => $.popup.exposureTitle)}
				</DialogDescription>
				<div className="flex flex-col gap-2">
					{exposureData && (
						<Card className="p-2 md:p-5">
							{Object.entries(exposureData).map(([sensor, danger]) => (
								<div key={sensor} className="flex justify-start gap-2">
									<span
										className={cn(
											"rounded-full text-center font-medium capitalize",
											`bg-${danger} ${danger === "danger" && "text-secondary"}`,
											"h-fit w-fit px-2",
										)}
									>
										{t(($) => $[sensor as Sensor])}
									</span>
									<span className="text-muted-foreground">{"->"}</span>
									<div className={`text-${danger}`}>
										{t(($) => $.popup[danger])}
									</div>
								</div>
							))}
						</Card>
					)}
					<h2 className="pt-4 font-bold">{t(($) => $.popup.notesTitle)}</h2>
					<PopupNotes selectedDate={selectedDate} />
				</div>
				<div>{children}</div>

				<DialogFooter>
					<Button
						variant={"default"}
						onClick={handleDayNav}
						className="cursor-pointer"
					>
						{t(($) => $.popup.toDay)}
					</Button>
					<Button
						variant={"destructive"}
						onClick={togglePopup}
						className="cursor-pointer"
					>
						{t(($) => $.buttons.close)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function WeeklyPopup({
	title,
	highestExposure,
	togglePopup,
	handleDayNav,
	children,
}: {
	title: string;
	highestExposure: DangerKey;
	togglePopup: () => void;
	handleDayNav: () => void;
	children?: React.ReactNode;
}) {
	return (
		<Dialog open={true} onOpenChange={togglePopup}>
			<DialogTrigger onClick={togglePopup}></DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="font-bold text-xl">{title}</DialogTitle>
				</DialogHeader>
				<DialogDescription className="font-medium text-xl">
					{t(($) => $.popup.exposureTitle)}
				</DialogDescription>
				<div className="flex flex-col gap-2">
					{highestExposure && (
						<Card className="p-2 md:p-5">
							<div className="flex flex-col justify-start gap-2">
								<div className={`text-${highestExposure}`}>
									{t(($) => $.popup[highestExposure])}
								</div>
								<div>{t(($) => $.popup.openDaily)}</div>
							</div>
						</Card>
					)}
				</div>
				<div>{children}</div>

				<DialogFooter>
					<Button
						variant={"default"}
						onClick={handleDayNav}
						className="cursor-pointer"
					>
						{t(($) => $.popup.toDay)}
					</Button>
					<Button
						variant={"destructive"}
						onClick={togglePopup}
						className="cursor-pointer"
					>
						{t(($) => $.buttons.close)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
