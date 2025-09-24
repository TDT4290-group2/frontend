import type React from "react";
import { DataRange, useRange } from "../hooks/range-context";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

export const RangeDropdown: React.FC = () => {
	const { range, setRange } = useRange();
	const rangeOptions = Object.values(DataRange);

	return (
		<Select
			value={range}
			onValueChange={(newValue) => setRange(newValue as DataRange)}
		>
			<SelectTrigger className="w-32">
				<SelectValue placeholder="Select range" />
			</SelectTrigger>
			<SelectContent className="w-32 py-2">
				<SelectGroup>
					<SelectLabel>{"Select Range"}</SelectLabel>

					{rangeOptions.map((option) => (
						<SelectItem key={option} value={option}>
							{option}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};
