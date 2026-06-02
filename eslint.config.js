import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["dist", ".repo-inspect", "*.d.ts"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        document: "readonly",
        window: "readonly",
        HTMLElement: "readonly",
        KeyboardEvent: "readonly",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
  {
    files: ["api/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        Buffer: "readonly",
        URLSearchParams: "readonly",
        fetch: "readonly",
        process: "readonly",
      },
    },
  },
];
