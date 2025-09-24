import React, {
	createContext,
	type ReactNode,
	useContext,
	useState,
} from "react";

export enum DataRange {
	Day = "Day",
	Week = "Week",
	Month = "Month",
}

type RangeContextValue = {
	range: DataRange;
	setRange: (range: DataRange) => void;
};

const RangeContext = createContext<RangeContextValue | undefined>(undefined);

export const useRange = (): RangeContextValue => {
	const context = useContext(RangeContext);
	if (!context) {
		throw new Error("ERR: useRange must be used within a RangeProvider");
	}
	return context;
};

type RangeProviderProps = {
	children: ReactNode;
	initialRange?: DataRange;
};

export const RangeProvider: React.FC<RangeProviderProps> = ({
	children,
	initialRange = DataRange.Day,
}) => {
	const [range, setRange] = useState<DataRange>(initialRange);

	return (
		<RangeContext.Provider value={{ range, setRange }}>
			{children}
		</RangeContext.Provider>
	);
};
