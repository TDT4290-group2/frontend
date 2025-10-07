import { cn, dangerLevels, DangerTypes, type Sensor } from "~/app/lib/utils";
import { Card } from "./card";

export function Summary({exposureType, safeCount, warningCount, dangerCount, safeLabel, warningLabel, dangerLabel}
    : {exposureType?: Sensor, safeCount: number, warningCount: number, dangerCount: number, safeLabel: string, warningLabel: string, dangerLabel: string}) {

        // TODO - Apply universal colors - hardcoded as of now
        const safeColor = "text-green-700"; // i.e. Replace with dangerLevels[DangerTypes.low].color or something
        const warningColor = "text-orange-700";
        const dangerColor = "text-red-700";

    return (
        <Card className="flex flex-col w-fit md:max-w-1/3 max-w-fit p-5 gap-0 shadow ">
            <div className="pl-2 pb-2 border-b-2 border-b-slate-300">
                <h2 className="text-2xl">Exposure Summary</h2>
            </div>
            <div className="exposure-subheader">
                <h4 className="text-sm text-right text-slate-400">
                    <span> {exposureType ? exposureType : "Every sensor"} </span>
                </h4>
            </div>
            {/* Safe */}
            <div className="flex p-2 items-baseline" title={dangerLevels[DangerTypes.low].label}>
                <span className={cn("text-2xl font-bold brightness-110 w-8 text-center", safeColor)}>
                    {safeCount}
                </span>
                <span className={cn("text-sm ml-2", safeColor)}>
                    {safeLabel}
                </span>
            </div>
            {/* Warning */}
            <div className="flex p-2 items-baseline" title={dangerLevels[DangerTypes.medium].label}>
                <span className={cn("text-2xl font-bold brightness-110 w-8 text-center", warningColor)}>
                    {warningCount}
                </span>
                <span className={cn("text-sm ml-2", warningColor)}>
                    {warningLabel}
                </span>
            </div>
            {/* Danger */}
            <div className="flex p-2 items-baseline" title={dangerLevels[DangerTypes.high].label}>
                <span className={cn("text-2xl font-bold brightness-110 w-8 text-center", dangerColor)}>
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