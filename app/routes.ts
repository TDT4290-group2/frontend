import { index, layout, type RouteConfig } from "@react-router/dev/routes";

// biome-ignore lint: default export in config files is fine
export default [
	layout("routes/sidebar.tsx", [index("routes/home.tsx")]),
] satisfies RouteConfig;
