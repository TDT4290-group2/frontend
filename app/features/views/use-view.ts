import { createContext, useContext } from "react";
import type { View } from "./views";

type ContextValue = {
	view: View;
	setView: (day: View) => void;
};

export const ViewContext = createContext<ContextValue | null>(null);

export function useView() {
	const context = useContext(ViewContext);

	if (!context) {
		throw new Error("useView must be used within a ViewContextProvider");
	}

	return context;
}
