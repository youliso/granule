import { builtinModules } from "module";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";

const plugins = () => [
  json(),
  typescript({
    tsconfig: "./tsconfig.json",
  }),
  commonjs(),
  resolve({
    preferBuiltins: true,
  }),
  terser(),
];

const external = [...builtinModules];

/** @type {import('rollup').RollupOptions[]} */
const config = [
  {
    input: "./src/index.ts",
    output: [
      {
        file: `./dist/index.js`,
        exports: "auto",
        format: "commonjs",
        sourcemap: false,
      },
    ],
    external,
    plugins: plugins(),
  },
  {
    input: "./src/index.ts",
    output: [
      {
        file: `./dist/index.mjs`,
        format: "esm",
        sourcemap: false,
      },
    ],
    external,
    plugins: plugins(),
  },
];

export default config;
