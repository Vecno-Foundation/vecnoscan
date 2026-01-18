import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    cloudflare({
      viteEnvironment: { name: "ssr" },
    }),
    tsconfigPaths(),
    svgr({ include: "**/*.svg" }),
  ],
});