import { cn, dangerLevels, DangerTypes } from "~/app/lib/utils";
import { Card } from "./card";

export function Summary({safeCount, warningCount, dangerCount, safeLabel, warningLabel, dangerLabel}
    : {safeCount: number, warningCount: number, dangerCount: number, safeLabel: string, warningLabel: string, dangerLabel: string}) {

        // TODO - Apply universal colors - hardcoded as of now
        const safeColor = "text-green-700"; // i.e. Replace with dangerLevels[DangerTypes.low].color or something
        const warningColor = "text-orange-700";
        const dangerColor = "text-red-700";

    return (
        <Card className="flex flex-col w-fit max-w-1/3 p-5 gap-0 shadow ">
            <h2 className="text-2xl">Exposure Summary</h2>
            {/* Safe */}
            <div className="flex p-2" title={dangerLevels[DangerTypes.low].label}>
                <span className={cn("text-2xl font-bold brightness-110", safeColor)}>
                    {safeCount}
                </span>
                <span className={cn("text-sm ml-2", safeColor)}>
                    {safeLabel}
                </span>
            </div>
            {/* Warning */}
            <div className="flex p-2" title={dangerLevels[DangerTypes.medium].label}>
                <span className={cn("text-2xl font-bold brightness-110", warningColor)}>
                    {warningCount}
                </span>
                <span className={cn("text-sm ml-2", warningColor)}>
                    {warningLabel}
                </span>
            </div>
            {/* Danger */}
            <div className="flex p-2">
                <span className={cn("text-2xl font-bold brightness-110", dangerColor)}>
                    {dangerCount}
                </span>
                <span className={cn("text-sm ml-2", dangerColor)}>
                    {dangerLabel}
                </span>
            </div>
        </Card>
    );
}

export default Summary;