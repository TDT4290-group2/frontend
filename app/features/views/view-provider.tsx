import { useQueryState } from "nuqs";
import { ViewContext } from "./use-view";
import { parseAsView } from "./utils";

export function ViewProvider({ children }: { children: React.ReactNode }) {
	const [view, setView] = useQueryState("view", parseAsView.withDefault("day"));

	return <ViewContext value={{ view, setView }}>{children}</ViewContext>;
}
