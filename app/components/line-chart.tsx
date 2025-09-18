"use client";
import {
	CartesianGrid,
	Line,
	LineChart,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

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
	threshold,
	unit,
}: {
	chartData: Array<{
		x: string;
		y: number;
	}>;
	chartTitle: string;
	threshold: number;
	unit: string;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{chartTitle}</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<LineChart
						accessibilityLayer
						data={chartData}
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="x"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							label={{ value: "Time", position: "insideBottom", offset: 0 }}
						/>
						<YAxis
							dataKey="y"
							tickLine={false}
							axisLine={false}
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
							formatter={(value: number) => [`${value}`, ` ${unit}`]}
						/>
						<Line
							dataKey="y"
							type="natural"
							stroke="var(--color-desktop)"
							strokeWidth={2}
							dot={false}
						/>
						<ThresholdLine y={threshold} dangerLevel={DangerLevel.HIGH} />
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

enum DangerLevel {
	HIGH,
}

type DangerLevelInfo = {
	label: string;
	color: string;
};

const dangerLevels: Record<DangerLevel, DangerLevelInfo> = {
	[DangerLevel.HIGH]: { label: "Keep under this threshold", color: "red" },
};

function ThresholdLine({
	y,
	dangerLevel,
}: {
	y: number;
	dangerLevel: DangerLevel;
}) {
	const color = dangerLevels[dangerLevel].color;
	const label = dangerLevels[dangerLevel].label;
	return (
		<ReferenceLine
			y={y}
			stroke={color}
			strokeDasharray="4 4"
			label={{
				value: label,
				position: "left",
				fill: color,
				offset: -150,
				dy: -10,
			}}
		/>
	);
}
