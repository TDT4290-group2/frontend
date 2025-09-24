import { ChartLineDefault, ThresholdLine } from "@/components/line-chart";
import { Calendar } from "@/components/ui/calendar";
import React from "react";

export function meta() {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

// biome-ignore lint: page components can be default exports
export default function Home() {
	const chartData = [
		{ x: "08.10", y: 18 },
		{ x: "09.05", y: 30 },
		{ x: "10.01", y: 23 },
		{ x: "11.23", y: 7 },
		{ x: "15.32", y: 20 },
		{ x: "16.01", y: 21 },
	];

  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12)
  )

	const greenDays = [
		new Date(2025, 8, 1),
		new Date(2025, 8, 5),
	]

	const yellowDays = [
		new Date(2025, 8, 2),
		new Date(2025, 8, 6),
	]

	const redDays = [
		new Date(2025, 8, 3),
		new Date(2025, 8, 7),
		new Date(2025, 8, 8),
	]

	return (
		<div>
			<Calendar
      mode="single"
      onSelect={setDate}
			greenDays={greenDays}
			yellowDays={yellowDays}
			redDays={redDays}
      className="rounded-md border shadow-sm"
      captionLayout="dropdown"
    />
		</div>
	);
}
