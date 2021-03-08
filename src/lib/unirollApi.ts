import type { ResolveIdFallback } from "uniroll";
import { bundleLocal as uBundleLocal } from "uniroll";
import { svelte } from "rollup-plugin-uniroll-svelte";

import ts from "typescript";

globalThis.fetch = fetch;

const skypackTargetList = [
  "svelte",
  "svelte/internal",
  "preact",
  "preact/hooks",
];

export function getImportUrls(code: string) {
  const source = ts.createSourceFile(
    "file:///_.tsx",
    code,
    ts.ScriptTarget.ESNext
  );
  const urls: string[] = [];
  source.statements.forEach((node) => {
    if (ts.isImportDeclaration(node)) {
      const target = node.moduleSpecifier.getText(source);
      const trimed = target.substr(1, target.length - 2);
      urls.push(trimed);
    }

    if (ts.isExportDeclaration(node)) {
      // const target = node.moduleSpecifier
      if (node.moduleSpecifier) {
        const target = node.moduleSpecifier.getText(source);
        const trimed = target.substr(1, target.length - 2);
        urls.push(trimed);
      }
    }
  });
  return urls;
}

const resolveIdFallback: ResolveIdFallback = (id, importer) => {
  if (importer == null) return;
  if (id.startsWith(".")) return;
  if (id.startsWith("https://")) return id;
  if (skypackTargetList.includes(id)) {
    // console.log("fallback with skypack", id, `https://cdn.skypack.dev/${id}`);
    return `https://cdn.skypack.dev/${id}`;
  }
  return `https://esm.sh/${id}`;
};

export async function bundleLocal(files: {
  [k: string]: string;
}): Promise<string> {
  try {
    const bundle = await uBundleLocal({
      files,
      input: "/index.tsx",
      resolveIdFallback,
      extraPlugins: [
        svelte({
          target: ts.ScriptTarget.ES2019,
          resolveIdFallback,
        }),
      ],
    });
    const out = await bundle.generate({ format: "es" });
    return out.output[0].code as string;
    // return 'console.log("wip")';
  } catch (err) {
    console.log("build error", err);
    throw err;
  }
}
