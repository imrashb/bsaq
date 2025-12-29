import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import js from "@eslint/js";
import graphqlPlugin from "@graphql-eslint/eslint-plugin";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    extends: ["prettier"],
  },
  {
    plugins: {
      prettier: { rules: prettierPlugin.rules },
    },
  },
  {
    files: ["**/*.js"],
    processor: graphqlPlugin.processor,
    rules: {
      ...js.configs.recommended.rules,
      ...prettierConfig.rules,
      ...prettierPlugin.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.graphql"],
    languageOptions: {
      parser: graphqlPlugin.parser,
    },
    plugins: {
      "@graphql-eslint": graphqlPlugin,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
];
