import type { Preparsed, ParsedSvelteAst } from "./types";

import { parse as parseCss } from "css";
import * as svelteCompiler from "svelte/compiler";
import ts from "typescript";

export const scriptRegexp = /<!--[^]*?-->|<script(\s[^]*?)?(?:>([^]*?)<\/script>|\/>)/;
export const styleRegexp = /<!--[^]*?-->|<style(\s[^]*?)?(?:>([^]*?)<\/style>|\/>)/;

export function parseSvelteTemplate(source: string): ParsedSvelteAst {
  const preparsed = preparse(source);
  const parsed = svelteCompiler.parse(preparsed.html.raw);
  return {
    preparsed,
    script: ts.createSourceFile(
      "$.tsx",
      preparsed.script.raw ?? "",
      ts.ScriptTarget.Latest
    ),
    style: parseCss(preparsed.style.raw ?? ""),
    template: parsed,
  };
}

export function preparse(source: string): Preparsed {
  const [scriptFull, scriptAttrs, scriptContent] = source.match(
    scriptRegexp
  ) ?? ["", "", ""];
  const [styleFull, styleAttrs, styleContent] = source.match(styleRegexp) ?? [
    "",
    "",
    "",
  ];
  const html = source.replace(scriptFull!, "").replace(styleFull!, "");
  return {
    script: {
      attrs: scriptAttrs ?? "",
      raw: scriptContent ?? "",
    },
    style: {
      attrs: styleAttrs ?? "",
      raw: styleContent,
    },
    html: {
      raw: html,
    },
  };
}
