import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { PopupNotes } from "./daily-notes";
import { t } from "i18next";

type PopupProps = {
	title: string;
    selectedDate: Date | null;
    handleClose?: () => void;
    handleDayNav?: () => void;
	children?: React.ReactNode;
}

export function PopupModal({ title, selectedDate, handleClose, handleDayNav, children }: PopupProps) {
	return (
		<Dialog open={true}>
            <DialogTrigger onClick={handleClose}></DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>

				{selectedDate !== null ? (
					<div className="flex flex-col gap-2">
						<h2 className="font-bold">{t("popup.exposureTitle")}</h2>
						<div>{"[Exposures placeholder...]"}</div>
						<h2 className="font-bold">{t("popup.notesTitle")}</h2>
						<PopupNotes selectedDate={selectedDate} />
					</div>
				) : (
					<div>{t("noData")}</div>
				)}
				<div className="bg-card py-4">{children}</div>

				<DialogFooter>
					<Button
						variant={"default"}
						onClick={handleDayNav}
						className="cursor-pointer"
					>
						{t("popup.toDay")}
					</Button>
					<Button
						variant={"destructive"}
						onClick={handleClose}
						className="cursor-pointer"
					>
						{t("buttons.close")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
