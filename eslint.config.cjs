module.exports = [
  {
    files: ["**/*.js", "**/*.html"],
    ignores: ["node_modules/**", "dist/**", "build/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        fetch: "readonly",
      },
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "script",
      },
    },
    plugins: {
      html: require("eslint-plugin-html"),
      security: require("eslint-plugin-security"),
    },
    rules: {
      "no-unused-vars": ["warn", { args: "none" }],
      "no-console": "off",
      "security/detect-object-injection": "off",
      "no-implicit-globals": "error",
      eqeqeq: ["error", "smart"],
      curly: ["error", "multi-line"],
    },
  },
];
