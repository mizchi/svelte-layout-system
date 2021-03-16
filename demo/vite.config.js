const svelte = require("rollup-plugin-svelte");
const autoPreprocess = require("svelte-preprocess");

module.exports = {
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
