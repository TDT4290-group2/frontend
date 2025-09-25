import { Calendar } from "@/components/ui/calendar";
import { WeeklyOverview } from "@/components/weekly";
import { cn } from "@/lib/utils";

export function meta() {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

// biome-ignore lint: page components can be default exports
export default function Home() {
	const _chartData = [
		{ x: "08.10", y: 18 },
		{ x: "09.05", y: 30 },
		{ x: "10.01", y: 23 },
		{ x: "11.23", y: 7 },
		{ x: "15.32", y: 20 },
		{ x: "16.01", y: 21 },
	];

	const greenDays = [new Date(2025, 8, 1), new Date(2025, 8, 5)];
	const yellowDays = [new Date(2025, 8, 2), new Date(2025, 8, 6)];
	const redDays = [
		new Date(2025, 8, 3),
		new Date(2025, 8, 7),
		new Date(2025, 8, 8),
	];

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
			<WeeklyOverview />
		</main>
	);
}
