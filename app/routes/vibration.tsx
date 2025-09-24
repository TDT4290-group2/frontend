import { parseAsView } from "@/lib/utils";
import { useQueryState } from "nuqs";

// biome-ignore lint: page components can be default exports
export default function Vibration() {
	const [view] = useQueryState("view", parseAsView.withDefault("day"));

	switch (view) {
		case "day":
			return (
				<div>
					<span>{"Vibration page"}</span>
					<span>{"Day view"}</span>
				</div>
			);
		case "week":
			return (
				<div>
					<span>{"Vibration page"}</span>
					<span>{"Week view"}</span>
				</div>
			);
		case "month":
			return (
				<div>
					<span>{"Vibration page"}</span>
					<span>{"Month view"}</span>
				</div>
			);
		default: {
			const exhaustiveCheck: never = view;
			throw new Error(`Unhandled view type: ${exhaustiveCheck}`);
		}
	}
}
