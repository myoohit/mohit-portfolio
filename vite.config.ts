import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, type UserConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(async ({ command }): Promise<UserConfig> => ({
  css: { transformer: "lightningcss" },
  resolve: {
    alias: { "@": `${process.cwd()}/src` },
    // Keep a single copy of React and TanStack Query in the bundle — several
    // packages here depend on both, and duplicates cause hook errors.
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ],
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      // src/server.ts wraps the default SSR handler so a failed render
      // returns a friendly error page instead of a raw 500 response.
      server: { entry: "server" },
      importProtection: {
        behavior: "error",
        client: { files: ["**/server/**"], specifiers: ["server-only"] },
      },
    }),
    // Nitro builds the deployable server bundle — only needed for `vite build`.
    ...(command === "build" ? [await loadNitroPlugin()] : []),
    viteReact(),
  ],
}));

async function loadNitroPlugin() {
  const { nitro } = await import("nitro/vite");
  const deployTarget = process.env["DEPLOY_TARGET"];
  const preset = deployTarget === "render" ? "node-server" : "vercel";
  return nitro({ preset });
}
