import React, { createContext, useContext, useState, type ReactNode } from 'react';

export enum DataRange { Day = "Day", Week = "Week", Month = "Month" }

interface RangeContextValue {
    range: DataRange;
    setRange: (range: DataRange) => void;
}

const RangeContext = createContext<RangeContextValue | undefined>(undefined);

export const useRange = (): RangeContextValue => {
    const context = useContext(RangeContext);
    if (!context) {
        throw new Error('ERR: useRange must be used within a RangeProvider');
    }
    return context;
};

interface RangeProviderProps {
    children: ReactNode;
    initialRange?: DataRange;
}

export const RangeProvider: React.FC<RangeProviderProps> = ({
    children,
    initialRange = DataRange.Day,
}) => {
    const [range, setRange] = useState<DataRange>(initialRange);

    React.useEffect(() => {
        console.log("Selected range:", range)
    }, [range])

    return (
        <RangeContext.Provider value={{ range, setRange }}>
            {children}
        </RangeContext.Provider>
    );
};