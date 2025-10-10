import { cn, dangerLevels, DangerTypes, type Sensor } from "~/app/lib/utils";
import { Card } from "./card";
import { useIsMobile } from "~/app/hooks/use-mobile";

type SummaryProps = {
    exposureType?: Sensor,
    safeCount?: number,
    warningCount?: number,
    dangerCount?: number,
    safeLabel?: string,
    warningLabel?: string,
    dangerLabel?: string
}

export function Summary({
        exposureType,
        safeCount,
        warningCount,
        dangerCount,
        safeLabel,
        warningLabel,
        dangerLabel
    } : SummaryProps){

    const safeColor = "text-safe"; 
    const warningColor = "text-warning";
    const dangerColor = "text-destructive";

    const summaryData = {
        exposureType : exposureType || "Every sensor",
        safeCount: safeCount || 24, 
        warningCount: warningCount || 12, 
        dangerCount: dangerCount || 3, 
        safeLabel: safeLabel || "Safe days", 
        warningLabel: warningLabel ||  "Days with warnings", 
        dangerLabel: dangerLabel || "Days where threshold was exceeded"
    }
    const isMobile = useIsMobile();

    return (
        <Card className="flex flex-col w-full p-5 gap-0 shadow ">
            <div className="md:pl-2 md:pb-2 border-b-2 border-b-slate-300">
                <h2 className="text-xl text-center md:text-left md:text-2xl">Exposure Summary</h2>
            </div>
            <div className="exposure-subheader">
                <h4 className="text-sm text-center md:text-right text-slate-400">
                    <span> {summaryData.exposureType} </span>
                </h4>
            </div>
            <div className="exposures-wrapper flex flex-row md:flex-col gap-4 md:gap-0 justify-center ">
                {/* Safe */}
                <div className="flex p-2 justify-center items-baseline md:justify-start" title={dangerLevels[DangerTypes.low].label}>
                    <span className={cn("text-2xl font-bold brightness-110 w-8 text-right md:text-center", safeColor)}>
                        {summaryData.safeCount}
                    </span>
                    <span className={cn("text-xs ml-1 md:text-sm md:ml-2", safeColor)}>
                        {isMobile ? DangerTypes.low : summaryData.safeLabel}
                    </span>
                </div>
                {/* Warning */}
                <div className="flex p-2 justify-center items-baseline md:justify-start" title={dangerLevels[DangerTypes.medium].label}>
                    <span className={cn("text-2xl font-bold brightness-110 w-8 text-right md:text-center", warningColor)}>
                        {summaryData.warningCount}
                    </span>
                    <span className={cn("text-xs ml-1 md:text-sm md:ml-2", warningColor)}>
                        {isMobile ? DangerTypes.medium : summaryData.warningLabel}
                    </span>
                </div>
                {/* Danger */}
                <div className="flex p-2 justify-center items-baseline md:justify-start" title={dangerLevels[DangerTypes.high].label}>
                    <span className={cn("text-2xl font-bold brightness-110 w-8 text-right md:text-center", dangerColor)}>
                        {summaryData.dangerCount}
                    </span>
                    <span className={cn("text-xs ml-1 md:text-sm md:ml-2", dangerColor)}>
                        {isMobile ? DangerTypes.high : summaryData.dangerLabel}
                    </span>
                    
                </div>
            </div>
        </Card>
    );
}

export default Summary;