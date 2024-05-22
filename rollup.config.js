const typescript = require("@rollup/plugin-typescript");
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const terser = require("@rollup/plugin-terser");

module.exports = {
  input: "src/index.ts", // 入口文件
  output: {
    file: "dist/index.js", // 输出文件
    format: "umd", // 输出格式，这里使用了IIFE，适合浏览器环境
    name: "I18", // 输出文件的全局变量名
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    // terser(), // 使用TypeScript插件
    // 可以添加其他插件，如处理CSS、图片等
  ],
};
