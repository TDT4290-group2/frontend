import {
	index,
	layout,
	type RouteConfig,
	route,
} from "@react-router/dev/routes";

// biome-ignore lint: default export in config files is fine
export default [
	layout("routes/layout.tsx", [
		index("routes/home.tsx"),
		route("/dust", "routes/dust.tsx"),
		route("/vibration", "routes/vibration.tsx"),
		route("/noise", "routes/noise.tsx"),
	]),
] satisfies RouteConfig;
