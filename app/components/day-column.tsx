type SlotStatus = "none" | "green" | "orange" | "red";

type HourSlot = {
	hourNo: number;
	status: SlotStatus;
};

export type Day = {
	date: string;
	hours: Array<HourSlot>;
};

type DayProps = {
	selectedDay: Day;
};

const statusColors: Record<SlotStatus, string> = {
	// Temp colors
	none: "bg-gray-500",
	green: "bg-[var(--safe)]",
	orange: "bg-[var(--warning)]",
	red: "bg-[var(--danger)]",
};

export function DayColumn({ selectedDay }: DayProps) {
	const columnLabel: string = new Date(selectedDay.date).toLocaleDateString(
		"default",
		{ weekday: "short" },
	);

	return (
		<div className="day-column flex min-w-2 flex-col overflow-auto rounded border">
			<div className="py-1 text-center font-bold">{columnLabel}</div>
			<div className="day-column-hours">
				{selectedDay.hours.map((hour) => (
					<div
						key={`${hour.hourNo} ${hour.status}`}
						className={`hour-slot flex min-h-10 border-black border-t border-dotted ${statusColors[hour.status]}`}
					/>
				))}
			</div>
		</div>
	);
}
