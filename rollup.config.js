import { builtinModules } from "module";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";

const plugins = () => [
  json(),
  commonjs(),
  typescript({
    useTsconfigDeclarationDir: true,
  }),
  nodeResolve({
    preferBuiltins: true,
  }),
  terser(),
];

const external = [
  ...builtinModules
];

/** @type {import('rollup').RollupOptions[]} */
let config = [];
config.push({
  input: `./src/index.ts`,
  output: [
    {
      file: `./dist/index.js`,
      exports: "auto",
      format: "commonjs",
      sourcemap: false,
    },
    {
      file: `./dist/index.mjs`,
      format: "esm",
      sourcemap: false,
    },
  ],
  external,
  plugins: plugins(),
});

export default config;
