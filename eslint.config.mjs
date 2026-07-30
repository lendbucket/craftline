import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override the default ignores of eslint-config-next so we can add our own.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Throwaway one-off scripts -- reproductions, probes, audit scratch output.
    // The directory is gitignored and nothing here ships.
    "scratch/**",
  ]),
]);

export default eslintConfig;
