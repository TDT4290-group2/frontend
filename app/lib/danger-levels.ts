export const DangerTypes: Record<DangerKey, number> = {
	"danger": 2,
	"warning": 1,
	"safe": 0,
} as const;
export const dangerKeys = ["safe", "warning", "danger"] as const;
export type DangerKey = typeof dangerKeys[number];

type DangerLevelInfo = {
	label: string;
	color: string;
};

export const dangerLevels: Record<DangerKey, DangerLevelInfo> = {
	danger: {
		label: "Threshold exceeded!",
		color: "var(--danger)",
	},
	warning: {
		label: "Close to exposure limit",
		color: "var(--warning)",
	},
	safe: {
		label: "Safely within exposure limit",
		color: "var(--safe)",
	},
};
