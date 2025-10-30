import { BasePopup } from "./base-popup";

export function NotificationPopup({
		title,
		relevantDate,
		open,
		onClose,
		children,
	}: {
		title: string;
		relevantDate: Date;
        open: boolean;
		onClose: () => void;
		children?: React.ReactNode;
	}) {
		return (
			<BasePopup
				title={title}
				open={open}
				relevantDate={relevantDate}
				onClose={onClose}
			>
                {/* Exposure: */}
				{children}
			</BasePopup>
		);
	}