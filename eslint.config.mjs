import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Disable explicit any warnings
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Keep as warn
      "react-hooks/exhaustive-deps": "warn", // Set to warn instead of error
      "@next/next/no-html-link-for-pages": "warn", // Set to warn instead of error
    },
  },
];

export default eslintConfig;