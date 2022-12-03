import { builtinModules } from "module";
import { minify } from "rollup-plugin-esbuild-minify";
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
  minify(),
];

const external = [...builtinModules];

/** @type {import('rollup').RollupOptions[]} */
let config = [];
config.push({
  input: `src/index.ts`,
  output: [
    {
      file: `dist/index.js`,
      format: "esm",
      sourcemap: false,
    },
  ],
  external,
  plugins: plugins(),
});

export default config;
