import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// biome-ignore lint: default export in config files is fine
export default defineConfig({
	plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
	base: "https://tdt4290-group2.github.io/frontend/",
});
