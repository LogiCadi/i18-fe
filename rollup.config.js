const typescript = require("@rollup/plugin-typescript");
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const terser = require("@rollup/plugin-terser");

module.exports = {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "umd",
    name: "I18",
  },
  plugins: [resolve(), commonjs(), typescript(), terser()],
};
