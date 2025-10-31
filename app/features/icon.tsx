import bellIcon from "/icons/bell_light.png";
import dustIcon from "/icons/dustIcon_light.png";
import noiseIcon from "/icons/noiseIcon_light.png";
import vibrationIcon from "/icons/vibrationIcon_light.png";

export type IconVariant = "dust" | "noise" | "vibration" | "bell";
type IconSize = "small" | "medium";

type IconProps = {
	variant: IconVariant;
	size: IconSize;
	className?: string;
};

const srcMap: Record<IconVariant, string> = {
	dust: dustIcon,
	noise: noiseIcon,
	vibration: vibrationIcon,
	bell: bellIcon,
};

export function Icon({ variant, size, className }: IconProps) {
	const isSmall = size === "small";

	return (
		<img
			src={srcMap[variant]}
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
