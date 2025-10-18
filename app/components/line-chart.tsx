"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { formatDate } from "date-fns";
import {
	CartesianGrid,
	Line,
	LineChart,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts";
import type { CurveType } from "recharts/types/shape/Curve";
import { useDayContext } from "../lib/day-context";
import type { SensorDataResponseDto } from "../lib/dto";
import { type DangerLevel, dangerLevels } from "../lib/utils";

export const description = "A line chart";

const chartConfig = {
	desktop: {
		label: "Desktop",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

export function ChartLineDefault({
	chartData,
	chartTitle,
	startHour,
	endHour,
	maxY,
	unit,
	lineType = "natural",
	children,
}: {
	chartData: Array<SensorDataResponseDto>;
	chartTitle: string;
	startHour: number;
	endHour: number;
	maxY: number;
	unit: string;
	lineType?: string;
	children: React.ReactNode;
}) {
	const { selectedDay } = useDayContext();

	const transformedData = chartData.map((item) => ({
		time: new Date(item.time).getTime(),
		value: item.value,
	}));

	const ticks = Array.from({ length: endHour - startHour + 1 }, (_, i) => {
		const date = new Date(selectedDay);
		date.setHours(startHour + i);
		return date.getTime();
	});

	const formatTime = (time: number) => {
		const date = new Date(time);
		return formatDate(date, "HH");
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>{chartTitle}</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<LineChart
						accessibilityLayer
						data={transformedData}
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="time"
							type="number"
							tickFormatter={formatTime}
							ticks={ticks}
							tickLine={false}
							axisLine={false}
							tickMargin={2}
							label={{ value: "Time", position: "insideBottom", offset: 0 }}
						/>
						<YAxis
							dataKey="value"
							tickLine={false}
							axisLine={false}
							domain={[0, maxY]}
							label={{
								value: unit,
								position: "insideCenter",
								offset: -5,
								angle: -90,
							}}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
							formatter={(value: number) => [`${value.toFixed(2)}`, ` ${unit}`]}
						/>
						<Line
							dataKey="value"
							type={lineType as CurveType}
							stroke="var(--color-desktop)"
							strokeWidth={2}
							dot={false}
						/>
						{children}
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

export function ThresholdLine({
	y,
	dangerLevel,
	label,
}: {
	y: number;
	dangerLevel: DangerLevel;
	label?: string;
}) {
	const color = dangerLevels[dangerLevel].color;
	const lineLabel = label ?? dangerLevels[dangerLevel].label;
	return (
		<ReferenceLine
			y={y}
			stroke={color}
			strokeDasharray="4 4"
			label={{
				value: lineLabel,
				position: "left",
				fill: color,
				offset: -150,
				dy: -10,
			}}
		/>
	);
}
