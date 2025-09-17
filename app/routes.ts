import { index, type RouteConfig } from "@react-router/dev/routes";

// biome-ignore lint: default export in config files is fine
export default [index("routes/home.tsx")] satisfies RouteConfig;
