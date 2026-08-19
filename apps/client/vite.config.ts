import path from "node:path";

import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import csp from "vite-plugin-csp-guard";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isDev = env.VITE_APP_ENV === "development";

  return {
    plugins: [
      tailwindcss(),
      tanstackRouter({ target: "react", autoCodeSplitting: true }),
      react(),
      csp({
        dev: { run: true },
        policy: {
          "default-src": ["'self'"],
          "connect-src": ["'self'", env.VITE_COLYSEUS_URL],
          "script-src": ["'self'", ...(isDev ? ["'unsafe-eval'"] : [])],
          "style-src": ["'self'", "'unsafe-inline'"],
          "img-src": ["'self'", "data:", "blob:"],
        },
      }),
      babel({ presets: [reactCompilerPreset()] }),
    ],
    server: {
      allowedHosts: [".larryling.xyz"],
    },
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
        "@shared": path.resolve(
          import.meta.dirname,
          "../../packages/shared/src"
        ),
      },
    },
  };
});
