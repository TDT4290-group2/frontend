import React, { createContext, useContext, useState, type ReactNode } from 'react';

export enum RangeType {
    Daily = 'daily',
    Weekly = 'weekly',
    Monthly = 'monthly',
    Total = 'total',
}

interface RangeContextValue {
    range: RangeType;
    setRange: (range: RangeType) => void;
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
    initialRange?: RangeType;
}

export const RangeProvider: React.FC<RangeProviderProps> = ({
    children,
    initialRange = RangeType.Daily,
}) => {
    const [range, setRange] = useState<RangeType>(initialRange);

    return (
        <RangeContext.Provider value={{ range, setRange }}>
            {children}
        </RangeContext.Provider>
    );
};