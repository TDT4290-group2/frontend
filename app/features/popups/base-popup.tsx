import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { t } from "i18next";
import { NavLink } from "react-router";

type BasePopupProps = {
	title: string;
	open: boolean;
	onClose: () => void;
	relevantDate: Date | null;
	children: React.ReactNode;
};

export function BasePopup({
	title,
	open,
	onClose,
	relevantDate,
	children,
}: BasePopupProps) {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="font-bold text-xl">{title}</DialogTitle>
				</DialogHeader>

				<DialogDescription className="font-medium text-xl">
					{t(($) => $.popup.exposureTitle)}
				</DialogDescription>

				{children}

				<DialogFooter>
					{relevantDate && (
						<Button
							variant="default"
							className="cursor-pointer"
							onClick={onClose}
						>
							<NavLink
								to={{
									search: `?view=Day&date=${relevantDate.toLocaleDateString("en-CA")}`,
								}}
								prefetch="intent"
							>
								{t(($) => $.popup.toDay)}
							</NavLink>
						</Button>
					)}
					<Button
						variant="destructive"
						onClick={onClose}
						className="cursor-pointer"
					>
						{t(($) => $.buttons.close)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
