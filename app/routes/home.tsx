import { parseAsView } from "@/lib/utils";
import { useQueryState } from "nuqs";

export function meta() {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

// biome-ignore lint: page components can be default exports
export default function Home() {
	const [view] = useQueryState("view", parseAsView.withDefault("day"));

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
				<div>
					<span>{"Overview page"}</span>
					<span>{"Month view"}</span>
				</div>
			);
		default: {
			const exhaustiveCheck: never = view;
			throw new Error(`Unhandled view type: ${exhaustiveCheck}`);
		}
	}
}
