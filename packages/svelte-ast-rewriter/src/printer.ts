import ts from "typescript";
import { stringify as compileCss } from "css";
import prettier from "prettier/standalone";
import tsPlugin from "prettier/parser-typescript";
import cssPlugin from "prettier/parser-postcss";
import type { Ast } from "svelte/types/compiler/interfaces";

// @ts-ignore
import * as sveltePrinter from "@mizchi/svelte-printer";
import type { ParsedSvelteAst } from "./types";

export function printTemplate(ast: Ast): string {
  const code = sveltePrinter.printCode(ast);
  return prettier.format(code, {
    parser: "svelte",
    plugins: [sveltePrinter as any],
  });
}

export function renderSvelteTemplate(parsed: ParsedSvelteAst): string {
  const printer = ts.createPrinter();
  const printedScript = printer.printFile(parsed.script);
  const css = compileCss(parsed.style);
  const cloned = clone(parsed.template);
  const html = sveltePrinter.printCode(cloned as Ast);
  return prettier.format(
    `<script${parsed.preparsed.script.attrs}>${printedScript}</script>
${html}
<style${parsed.preparsed.style.attrs}>${css}</style>
`,
    {
      parser: "svelte",
      plugins: [tsPlugin, sveltePrinter as any, cssPlugin],
    }
  );
}

function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
