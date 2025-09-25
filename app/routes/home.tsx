import { cn, parseAsView } from "@/lib/utils";
import { useQueryState } from "nuqs";
import { Calendar } from "../components/ui/calendar";

export function meta() {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

// biome-ignore lint: page components can be default exports
export default function Home() {
	const [view] = useQueryState("view", parseAsView.withDefault("day"));

	const greenDays = [new Date(2025, 8, 1), new Date(2025, 8, 5)];
	const yellowDays = [new Date(2025, 8, 2), new Date(2025, 8, 6)];
	const redDays = [
		new Date(2025, 8, 3),
		new Date(2025, 8, 7),
		new Date(2025, 8, 8),
	];

	switch (view) {
		case "day":
			return (
				<div>
					<span>{"Overview page"}</span>
					<span>{"Day view"}</span>
				</div>
			);
		case "week":
			return (
				<div>
					<span>{"Overview page"}</span>
					<span>{"Week view"}</span>
				</div>
			);
		case "month":
			return (
				<main className="grid h-full w-full place-content-center">
					<Calendar
						fixedWeeks
						showWeekNumber
						disabled
						mode="single"
						modifiers={{
							safe: greenDays,
							warning: yellowDays,
							danger: redDays,
						}}
						modifiersClassNames={{
							safe: cn("bg-green-500 dark:bg-green-700"),
							warning: cn("bg-orange-500 dark:bg-orange-700"),
							danger: cn("bg-red-500 dark:bg-red-700"),
							disabled: cn("m-2 rounded-2xl text-black dark:text-white"),
						}}
						className="rounded-md border font-bold text-foreground shadow-sm [--cell-size:--spacing(6)] sm:[--cell-size:--spacing(11)] md:[--cell-size:--spacing(20)]"
						captionLayout="dropdown"
						buttonVariant="ghost"
					/>
				</main>
			);
		default: {
			const exhaustiveCheck: never = view;
			throw new Error(`Unhandled view type: ${exhaustiveCheck}`);
		}
	}
}
