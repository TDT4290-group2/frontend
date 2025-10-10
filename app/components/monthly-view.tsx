import { cn } from "../lib/utils";
import { Calendar } from "./ui/calendar";
import { Card } from "./ui/card";

type MonthlyProps = {
    safeDates: Date[],
    warningDates: Date[],
    dangerDates: Date[],
}

export function MonthlyView({safeDates, warningDates, dangerDates}: MonthlyProps){
    
    const sameDate = (dateList: Date[], clickedDay: Date) => (
        dateList.some(day => day.toDateString() === clickedDay.toDateString())
    );
    
    // Checks if the day clicked has data with temporary interaction with alert
    const handleDayClick = (clickedDay: Date) => {        
        if (sameDate(safeDates, clickedDay)) {
            alert(`Safe day on ${clickedDay.toLocaleDateString()}`);
        } else if (sameDate(warningDates, clickedDay)) {
            alert(`Warnings issued on ${clickedDay.toLocaleDateString()}`);
        } else if (sameDate(dangerDates, clickedDay)) {
            alert(`Danger: Exposure limits exceeded on ${clickedDay.toLocaleDateString()}`);
        }
        // Do nothing - that day has no data
        return;
    }

    return (
        <Card className="w-full">
            <Calendar
                fixedWeeks
                showWeekNumber
                mode="single"
                weekStartsOn={1}
                onDayClick={day => handleDayClick(day)}
                modifiers={{
                    safe: safeDates,
                    warning: warningDates,
                    danger: dangerDates,
                }}
                modifiersClassNames={{
                    safe: cn("bg-safe cursor-pointer hover:brightness-85 rounded-2xl"),
                    warning: cn("bg-warning cursor-pointer hover:brightness-85 rounded-2xl"),
                    danger: cn("bg-destructive cursor-pointer hover:brightness-85 rounded-2xl"),
                    disabled: cn(
                        "m-2 rounded-2xl text-black dark:text-white",
                    ),
                }}
                className="w-full bg-transparent font-bold text-foreground [--cell-size:--spacing(6)] sm:[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
                captionLayout="dropdown"
                buttonVariant="default"
            />
        </Card>
    );
}