const svelte = require("rollup-plugin-svelte");
const autoPreprocess = require("svelte-preprocess");
const unirollPlugin = require("uniroll/rollup-plugin");
const fs = require("fs");

const { createFilter } = require("rollup-pluginutils");

function string(opts = {}) {
  if (!opts.include) {
    throw Error("include option should be specified");
  }

  const filter = createFilter(opts.include, opts.exclude);

  return {
    name: "string",

    transform(code, id) {
      if (filter(id)) {
        return {
          code: `export default ${JSON.stringify(code)};`,
          map: { mappings: "" },
        };
      }
    },
  };
}

const raw = () => ({
  enforce: "post",
  name: "raw",
  resolveId(id) {
    if (id.endsWith("?raw")) {
      return id;
    }
  },
  load(id) {
    if (id.endsWith("?raw")) {
      const fpath = id.replace("?raw", "");
      const raw = fs.readFileSync(fpath, "utf-8");
      return `export default ${JSON.stringify(raw)};`;
    }
  },
});

module.exports = {
  plugins: [
    string({
      include: ["src/data/**/*"],
    }),
    unirollPlugin(),
    svelte({
      exclude: ["src/data/**/*"],
      emitCss: false,
      preprocess: autoPreprocess(),
    }),
  ],
};
