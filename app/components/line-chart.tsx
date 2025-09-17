"use client";
import {
	CartesianGrid,
	Line,
	LineChart,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts";

import {
	Card,
	CardContent,
	// CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
				{/* <CardDescription>January - June 2024</CardDescription> */}
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
						<ReferenceLine
							y={threshold}
							stroke="red"
							strokeDasharray={"4 4"}
							label={{
								value: "Keep under this threshold",
								position: "left",
								fill: "red",
								offset: -150,
								dy: -10,
							}}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
