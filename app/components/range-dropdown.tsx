import React from 'react';
import { useRange } from "../hooks/rangeContext";
import { DataRange } from "../hooks/rangeContext";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';

const RangeDropdown: React.FC = () => {
    const {range, setRange} = useRange();
	const rangeOptions = Object.values(DataRange);

    return (
        <Select value={range} onValueChange={newValue => setRange(newValue as DataRange)}>
            <SelectTrigger className='w-32'>
                <SelectValue placeholder="Select range"/>
            </SelectTrigger>
            <SelectContent className="py-2 w-32">
                <SelectGroup>
                    <SelectLabel>Select Range</SelectLabel>

                    {rangeOptions.map((option) => (
                        <SelectItem
                            key={option}
                            value={option}
                        >
                            {option}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default RangeDropdown;