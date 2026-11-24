import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

/**
 * Configuración plana moderna: ESLint 10 + typescript-eslint + react-hooks.
 * No se usa eslint-config-next porque sus plugins (import, jsx-a11y, react)
 * declaran soporte solo hasta ESLint 9 y generaban conflictos de peer en npm install.
 */
export default defineConfig([
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    // next.config.js es CommonJS
    files: ["*.js", "*.cjs"],
    languageOptions: {
      globals: {
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
        process: "readonly",
        console: "readonly",
      },
    },
  },
]);
