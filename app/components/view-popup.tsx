import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { t } from "i18next";
import { Button } from "./ui/button";

type PopupProps = {
	title: string;
    handleClose?: () => void;
    handleDayNav?: () => void;
	children?: React.ReactNode;
}

export function PopupModal({ title, handleClose, handleDayNav, children }: PopupProps) {
	return (
		<Dialog open={true}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>

				{/* Row 2: Main content */}
                
				<div className="py-4">{children}</div>

				{/* Row 3: Footer (actions, buttons, etc.) */}
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
