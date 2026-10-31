import eslint from "@eslint/js";
import globals from "globals";
import babelParser from "@babel/eslint-parser";

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  eslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: globals.node,
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        sourceType: "module",
        babelOptions: {
          plugins: ["@babel/plugin-syntax-typescript"],
        },
      },
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
    },
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
];
