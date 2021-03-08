const svelte = require("rollup-plugin-svelte");
const autoPreprocess = require("svelte-preprocess");
const unirollPlugin = require("uniroll/rollup-plugin");
// const replace

module.exports = {
  plugins: [
    unirollPlugin(),
    svelte({
      emitCss: false,
      preprocess: autoPreprocess(),
    }),
  ],
};
