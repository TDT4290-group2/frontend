import bellIcon from "/icons/bell_light.png";
import dustIcon from "/icons/dustIcon_light.png";
import noiseIcon from "/icons/noiseIcon_light.png";
import vibrationIcon from "/icons/vibrationIcon_light.png";

export type IconVariant = "dust" | "noise" | "vibration" | "bell";
type IconSize = "small" | "medium";

const srcMapLight: Record<IconVariant, string> = {
	dust: dustIconLight,
	noise: noiseIconLight,
	vibration: vibrationIconLight,
	bell: bellIconLight,
};

const srcMapDark: Record<IconVariant, string> = {
	dust: dustIconDark,
	noise: noiseIconDark,
	vibration: vibrationIconDark,
	bell: bellIconDark,
};

export function Icon({ variant, size, className }: IconProps) {
	const isSmall = size === "small";
	const { theme } = useTheme();

	return (
		<img
			src={theme === "light" ? srcMapLight[variant] : srcMapDark[variant]}
			alt={`${variant} icon`}
			width={200}
			height={200}
			style={{
				width: isSmall ? "1.5em" : "2em",
				height: isSmall ? "1.5em" : "2em",
				display: "inline-block",
				verticalAlign: "middle",
			}}
			className={className ? className : ""}
		/>
	);
}
