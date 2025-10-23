import { type ReactNode, useState } from "react";
import { DateContext } from "./use-date";

export function DateProvider({ children }: { children: ReactNode }) {
	const [date, setDate] = useState<Date>(new Date());

	return (
		<DateContext value={{ date, setDate: (d: Date) => setDate(d) }}>
			{children}
		</DateContext>
	);
}
