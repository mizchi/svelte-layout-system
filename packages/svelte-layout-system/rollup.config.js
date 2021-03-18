import svelte from "rollup-plugin-svelte";
import autoPreprocess from "svelte-preprocess";
import ts from "@wessberg/rollup-plugin-ts";
import cjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import pkg from "./package.json";
// import replace from "@rollup/plugin-replace";

export default {
  input: "src/index.ts",
  external: ["svelte", "svelte/internal", "svelte/store"],
  plugins: [
    nodeResolve({
      include: "node_modules/**",
    }),
    cjs(),
    ts(),
    svelte({
      emitCss: false,
      compilerOptions: {
        hydratable: true,
      },
      preprocess: autoPreprocess({}),
    }),
  ],
  output: [
    {
      format: "es",
      file: pkg.module,
    },
  ],
};
