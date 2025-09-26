import { type ClassValue, clsx } from "clsx";
import { parseAsStringLiteral } from "nuqs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Array<ClassValue>) {
	return twMerge(clsx(inputs));
}

export type View = "day" | "week" | "month";
const views: Array<View> = ["day", "week", "month"];
export const parseAsView = parseAsStringLiteral(views);

export const timeSections: Array<string> = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00"];