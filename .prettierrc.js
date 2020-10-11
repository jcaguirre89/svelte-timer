module.exports = {
  svelteSortOrder: "scripts-styles-markup",
  svelteStrictMode: true,
  svelteBracketNewLine: true,
  svelteAllowShorthand: true,
  plugins: ["prettier-plugin-svelte"],
  overrides: [
      {
          files: "*.ts",
          options: {
              parser: "typescript"
          }
      }
  ]
};
