module.exports = [
  {
    files: ["src/**/*.js", "public/**/*.js", "scripts/**/*.mjs", "tests/**/*.js"],
    ignores: ["node_modules/**", "dist/**", "build/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        fetch: "readonly",
      },
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    plugins: {
      security: require("eslint-plugin-security"),
    },
    rules: {
      "no-unused-vars": ["warn", { args: "none" }],
      "no-console": "off",
      "security/detect-object-injection": "off",
      eqeqeq: ["error", "smart"],
      curly: ["error", "multi-line"],
    },
  },
];
