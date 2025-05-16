const { defineConfig, globalIgnores } = require("eslint/config");

const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const globals = require("globals");
const js = require("@eslint/js");

const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: "module",

      parserOptions: {
        project: "./tsconfig.base.json",
        tsconfigRootDir: __dirname,
      },

      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },

    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    extends: compat.extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended"
    ),
    rules: {},
  },
  globalIgnores([
    "**/node_modules/",
    "**/dist/",
    "backend/.mastra/**",
    "**/*.config.js",
    "**/*.cjs",
  ]),
]);
