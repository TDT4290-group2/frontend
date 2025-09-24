import { type ClassValue, clsx } from "clsx";
import { parseAsStringLiteral } from "nuqs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Array<ClassValue>) {
	return twMerge(clsx(inputs));
}

export type View = "day" | "week" | "month";
const views: Array<View> = ["day", "week", "month"];
export const parseAsView = parseAsStringLiteral(views);
