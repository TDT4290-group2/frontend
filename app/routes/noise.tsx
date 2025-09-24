import { parseAsView } from "@/lib/utils";
import { useQueryState } from "nuqs";
import { ChartLineDefault, ThresholdLine } from "../components/line-chart";

const data = [
	{ x: "08.10", y: 18 },
	{ x: "09.05", y: 30 },
	{ x: "10.01", y: 23 },
	{ x: "11.23", y: 7 },
	{ x: "15.32", y: 20 },
	{ x: "16.01", y: 21 },
];

// biome-ignore lint: page components can be default exports
export default function Noise() {
	const [view] = useQueryState("view", parseAsView.withDefault("day"));

	switch (view) {
		case "day":
			return (
				<div>
					<ChartLineDefault
						chartData={data}
						chartTitle="Noise Exposure"
						unit="desibel"
					>
						<ThresholdLine y={25} dangerLevel="DANGER" />
					</ChartLineDefault>
				</div>
			);
		case "week":
			return (
				<div>
					<span>{"Noise page"}</span>
					<span>{"Week view"}</span>
				</div>
			);
		case "month":
			return (
				<div>
					<span>{"Noise page"}</span>
					<span>{"Month view"}</span>
				</div>
			);
		default: {
			const exhaustiveCheck: never = view;
			throw new Error(`Unhandled view type: ${exhaustiveCheck}`);
		}
	}
}
