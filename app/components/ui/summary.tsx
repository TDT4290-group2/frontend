import { cn, dangerLevels, DangerTypes, thresholds, type Sensor, type View } from "~/app/lib/utils";
import { Card } from "./card";
import { useIsMobile } from "~/app/hooks/use-mobile";
import type { AllSensors, SensorDataResponseDto } from "~/app/lib/dto";

type SummaryProps = {
    exposureType: Sensor | "all",
    data: Array<SensorDataResponseDto> | AllSensors | undefined,
    view: View,
}

type SummaryLabel = Record<"safe" | "warning" | "danger", string>

export function Summary({
        exposureType,
        data,
        view
    } : SummaryProps){

    const safeColor = "text-safe"; 
    const warningColor = "text-warning";
    const dangerColor = "text-destructive";

    const defaultLabels: SummaryLabel = {
        safe: DangerTypes.low,
        warning: DangerTypes.medium,
        danger: DangerTypes.high
    }

    const viewLabelConfig: Record<View, SummaryLabel> = {
        day: {
            safe: "Hours with safe amount of exposure",
            warning: "Hours where a warning was issued due to exposure",
            danger: "Hours of exposure above limit"
        },
        week: {
            safe: "Hours with safe amount of exposure",
            warning: "Hours where a warning was issued due to exposure",
            danger: "Hours of exposure above limit"
        },
        month: {
            safe: "Days where no limit was close to exceeding",
            warning: "Days where a warning was issued due to exposure",
            danger: "Days where exposure exceeded limit"
        }
    }
    let summaryData: SummaryType = getSummaryData({view, exposureType, data});

    const summaryLabels = {
        exposureType : exposureType === "all" ? "Every sensor" : exposureType,
        safeLabel: viewLabelConfig[view].safe || defaultLabels.safe, 
        warningLabel: viewLabelConfig[view].warning || defaultLabels.warning, 
        dangerLabel: viewLabelConfig[view].danger || defaultLabels.danger
    }
    const isMobile = useIsMobile();

    return (
        <Card className="flex flex-col w-full p-5 gap-0 shadow ">
            <div className="md:pl-2 md:pb-2 border-b-2 border-b-slate-300">
                <h2 className="text-xl text-center md:text-left md:text-2xl">Exposure Summary</h2>
            </div>
            <div className="exposure-subheader">
                <h4 className="text-sm text-center md:text-right text-slate-400">
                    <span> {summaryLabels.exposureType} </span>
                </h4>
            </div>
            <div className="exposures-wrapper flex flex-row md:flex-col gap-4 md:gap-0 justify-center ">
                {/* Safe */}
                <div className="flex p-2 justify-center items-baseline md:justify-start" title={dangerLevels[DangerTypes.low].label}>
                    <span className={cn("text-2xl font-bold brightness-110 w-8 text-right md:text-center", safeColor)}>
                        {summaryData.safeCount}
                    </span>
                    <span className={cn("text-xs ml-1 md:text-sm md:ml-2", safeColor)}>
                        {isMobile ? defaultLabels.safe : summaryLabels.safeLabel}
                    </span>
                </div>
                {/* Warning */}
                <div className="flex p-2 justify-center items-baseline md:justify-start" title={dangerLevels[DangerTypes.medium].label}>
                    <span className={cn("text-2xl font-bold brightness-110 w-8 text-right md:text-center", warningColor)}>
                        {summaryData.warningCount}
                    </span>
                    <span className={cn("text-xs ml-1 md:text-sm md:ml-2", warningColor)}>
                        {isMobile ? defaultLabels.warning : summaryLabels.warningLabel}
                    </span>
                </div>
                {/* Danger */}
                <div className="flex p-2 justify-center items-baseline md:justify-start" title={dangerLevels[DangerTypes.high].label}>
                    <span className={cn("text-2xl font-bold brightness-110 w-8 text-right md:text-center", dangerColor)}>
                        {summaryData.dangerCount}
                    </span>
                    <span className={cn("text-xs ml-1 md:text-sm md:ml-2", dangerColor)}>
                        {isMobile ? defaultLabels.danger : summaryLabels.dangerLabel}
                    </span>
                    
                </div>
            </div>
        </Card>
    );
}

function getSummaryData({view, exposureType, data} : SummaryProps ): SummaryType {
    let summaryData;
    if (exposureType === "all") summaryData = getSummaryForAll(view, data as AllSensors ?? []);
    else {
        summaryData = getSingleSummary(view, exposureType, data as Array<SensorDataResponseDto> ?? []);
    }
    return summaryData;
}

type SummaryType = {safeCount: number, dangerCount: number, warningCount: number}

const getSingleSummary = (view: View, sensor: Sensor, data: Array<SensorDataResponseDto>): SummaryType => {
    const summaryData = {safeCount: 0, dangerCount: 0, warningCount: 0}

    const threshold =  thresholds[sensor];

    if (view === "month") {
        for (const item of data) {
            if (item.value < threshold.warning) {
                summaryData.safeCount++;
            }
            else if (item.value < threshold.danger) {
                summaryData.warningCount++;
            }
            else {
                summaryData.dangerCount++;
            }
        }
    }
    else if (view === "week") {
        for (const item of data) {
            if (item.value < threshold.warning) {
                summaryData.safeCount++;
            }
            else if (item.value < threshold.danger) {
                summaryData.warningCount++;
            }
            else {
                summaryData.dangerCount++;
            }
        }
    }
    else {
        for (const item of data) {
            if (item.value < threshold.warning) {
                summaryData.safeCount++;
            }
            else if (item.value < threshold.danger) {
                summaryData.warningCount++;
            }
            else {
                summaryData.dangerCount++;
            }
        }
        summaryData.dangerCount = Math.ceil(summaryData.dangerCount / 60)
        summaryData.warningCount = Math.round(summaryData.warningCount / 60)
        summaryData.safeCount = Math.floor(summaryData.safeCount / 60)
    }

    return summaryData;

}

const getSummaryForAll = (view: View, data: AllSensors): SummaryType => {
    let allData = Object.entries(data)
	.map(([sensor, sensorData]) => (data && getSingleSummary(view, sensor as Sensor, sensorData.data ?? [])))
        .reduce((acc: SummaryType, curr) => {
            if (!curr) return acc;
            acc.safeCount += curr.safeCount;
            acc.dangerCount += curr.dangerCount;
            acc.warningCount += curr.warningCount;
            return acc;
        }, { safeCount: 0, dangerCount: 0, warningCount: 0 })
    if (!allData) allData = { safeCount: 0, dangerCount: 0, warningCount: 0 }
    return allData;

}

export default Summary;