import React, {
	createContext,
	type ReactNode,
	useContext,
	useState,
} from "react";

type ContextValue = {
	selectedDay: Date;
	setSelectedDay: (day: Date) => void;
};

const DayContext = createContext<ContextValue | undefined>(undefined);

export const useDayContext = (): ContextValue => {
	const context = useContext(DayContext);

	if (!context) {
		throw new Error("useDayContext must be used within a DayContextProvider");
	}

	return context;
};

type ContextProviderProps = {
	children: ReactNode;
};

export const DayContextProvider: React.FC<ContextProviderProps> = ({
	children,
}) => {
	// const [selectedDay, setSelectedDay] = useState<Date>(new Date());
	const [selectedDay, setSelectedDay] = useState<Date>(new Date("2025-02-17"));

	return (
		<DayContext.Provider value={{ selectedDay, setSelectedDay }}>
			{children}
		</DayContext.Provider>
	);
};
