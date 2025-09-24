import { ChartLineDefault, ThresholdLine } from "@/components/line-chart";
import { WeeklyOverview } from "./weekly";

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
	return (
		<div>
			<ChartLineDefault
				chartData={chartData}
				chartTitle="Dust Exposure Graph"
				unit="decibel"
			>
				<ThresholdLine y={25} dangerLevel="DANGER" />
			</ChartLineDefault>
			<WeeklyOverview />
		</div>
	);
}
