"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	CartesianGrid,
	Line,
	LineChart,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts";

export const description = "A line chart";

const chartConfig = {
	desktop: {
		label: "Desktop",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

export function ChartLineDefault({
	chartData,
	// chartTitle,
	unit,
	children,
}: {
	chartData: Array<{
		x: string;
		y: number;
	}>;
	chartTitle: string;
	unit: string;
	children: React.ReactNode;
}) {
	return (
		<Card className="sm: w-full md:w-4/5 lg:w-3/4">
			<CardHeader>
				<CardTitle className="text-2xl">{chartTitle}</CardTitle>
				{/* <CardTitle>{chartTitle}</CardTitle> */}
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
							tickMargin={2}
							interval={12}
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
						{children}
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

const DangerTypes = {
	high: "DANGER",
	medium: "WARNING",
} as const;

type DangerLevel = (typeof DangerTypes)[keyof typeof DangerTypes];

type DangerLevelInfo = {
	label: string;
	color: string;
};

const dangerLevels: Record<DangerLevel, DangerLevelInfo> = {
	DANGER: { label: "Keep under this threshold", color: "red" },
	WARNING: {
		label: "",
		color: "orange",
	},
};

export function ThresholdLine({
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
