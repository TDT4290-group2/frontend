import { AggregationFunction, type SensorDataRequestDto, TimeGranularity } from "./dto";
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";

type View = "day" | "week" | "month";
type Sensor = "dust" | "noise" | "vibration";

const granularityMap: Record<View, TimeGranularity> = {
  day: TimeGranularity.Minute,
  week: TimeGranularity.Hour,
  month: TimeGranularity.Day,
};

const functionMap: Record<Sensor, Record<View, AggregationFunction>> = {
  dust: {
    day: AggregationFunction.Avg,
    week: AggregationFunction.Avg,
    month: AggregationFunction.Avg,
  },
  noise: {
    day: AggregationFunction.Avg,
    week: AggregationFunction.Max,
    month: AggregationFunction.Max,
  },
  vibration: {
    day: AggregationFunction.Avg,
    week: AggregationFunction.Max,
    month: AggregationFunction.Max,
  },
};

const fieldMap: Record<Sensor, string | undefined> = {
  dust: "pm1_stel",
  noise: undefined,
  vibration: undefined,
};

function getStartEnd(view: View, selectedDay: Date) {
  switch (view) {
    case "day":
      return {
        startTime: new Date(selectedDay.setHours(8)),
        endTime: new Date(selectedDay.setHours(16)),
      };
    case "week":
      return {
        startTime: startOfWeek(selectedDay),
        endTime: endOfWeek(selectedDay),
      };
    case "month":
      return {
        startTime: startOfMonth(selectedDay),
        endTime: endOfMonth(selectedDay),
      };
    default:
      throw new Error("Invalid view");
  }
}

export function buildSensorQuery(sensor: Sensor, view: View, selectedDay: Date): SensorDataRequestDto {
  const { startTime, endTime } = getStartEnd(view, selectedDay);
  const granularity = granularityMap[view];
  const func = functionMap[sensor][view];
  const field = fieldMap[sensor];

  const query: SensorDataRequestDto = {
    startTime,
    endTime,
    granularity,
    function: func,
  };
  if (field) query.field = field;
  return query;
}