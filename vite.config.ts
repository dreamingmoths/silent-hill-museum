/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    setupFiles: ["src/tests/setup.ts"],
  },

  define: {
    "process.env.APP_VERSION": JSON.stringify(process.env.npm_package_version),
  },

  build: {
    target: "es6",
  },
});
