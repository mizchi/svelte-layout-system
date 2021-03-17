import svelte from "rollup-plugin-svelte";
import autoPreprocess from "svelte-preprocess";
import path from "path";

export default {
  build: {
    target: "es2019",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        seekbar: path.resolve(__dirname, "seekbar.html"),
      },
    },
  },
  plugins: [
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
