module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:unicorn/all",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["simple-import-sort", "import", "prefer-arrow"],
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "prefer-arrow/prefer-arrow-functions": [
      "error",
      {
        disallowPrototype: true,
        singleReturnOnly: true,
        classPropertiesAllowed: false,
      },
    ],
    "unicorn/no-keyword-prefix": ["error", { disallowedPrefixes: ["new"] }],
    "unicorn/no-null": "off",
    "unicorn/no-useless-undefined": "off",
  },
  ignorePatterns: ["node_modules/", "dist/", "build/", "coverage/"],
  overrides: [
    {
      files: ["index.ts"],
      rules: {
        "unicorn/no-empty-file": "off",
      },
    },
  ],
};
