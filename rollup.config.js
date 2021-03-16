import svelte from "rollup-plugin-svelte";
import autoPreprocess from "svelte-preprocess";
import ts from "@wessberg/rollup-plugin-ts";
import cjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import pkg from "./package.json";

export default {
  input: "src/index.ts",
  external: ["svelte", "svelte/internal", "svelte/store"],
  plugins: [
    nodeResolve(),
    cjs(),
    ts(),
    svelte({
      emitCss: false,
      hydratable: true,
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
