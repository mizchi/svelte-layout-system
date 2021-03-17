import svelte from "rollup-plugin-svelte";
import autoPreprocess from "svelte-preprocess";
import alias from "@rollup/plugin-alias";
import path from "path";

const PROD = process.env.NODE_ENV === "production";

export default {
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        seekbar: path.resolve(__dirname, "seekbar.html"),
      },
    },
  },
  plugins: [
    alias({
      entries: PROD
        ? []
        : [
            {
              find: "svelte-layout-system",
              replacement: path.resolve(__dirname, "../src/index.ts"),
            },
          ],
    }),
    svelte({
      emitCss: false,
      preprocess: autoPreprocess({
        postcss: {
          plugins: [require("tailwindcss"), require("autoprefixer")],
        },
      }),
    }),
  ],
};
