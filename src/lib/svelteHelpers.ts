import type { NodeAttribute } from "./types";
import ts, { TextSpan } from "typescript";
import { parse as parseCss, stringify as compileCss, Stylesheet } from "css";
import prettier from "prettier/standalone";
import tsPlugin from "prettier/parser-typescript";
import cssPlugin from "prettier/parser-postcss";
// @ts-ignore
import * as sveltePlugin from "prettier-plugin-svelte";
import * as svelteCompiler from "svelte/compiler";
import type { Ast, TemplateNode } from "svelte/types/compiler/interfaces";

// import type { Ast } from "svelte/types/compiler/interfaces";
// import { format } from "prettier";
// @ts-ignore
import * as sveltePrinter from "@mizchi/svelte-printer";

export function printTemplate(ast: Ast): string {
  const code = sveltePrinter.printCode(ast);
  return prettier.format(code, { parser: "svelte", plugins: [sveltePrinter] });
}

export type ParsedSvelteTemplate = {
  script: {
    attrs: string;
    ast: ts.SourceFile;
  };
  style: {
    attrs: string;
    ast: Stylesheet;
  };
  html: string;
  tree: TemplateNode;
};

export type ParsedSvelteAst = {
  script: {
    attrs: string;
    ast: ts.SourceFile;
  };
  style: {
    attrs: string;
    ast: Stylesheet;
  };
  html: {
    ast: Ast;
  };
};

type ScriptEditableProperty = {
  identifier: string;
  type: "number" | "string" | "boolean";
  comment?: string;
  defaultValue?: NodeAttribute;
};

const scriptRegexp = /<!--[^]*?-->|<script(\s[^]*?)?(?:>([^]*?)<\/script>|\/>)/;
const styleRegexp = /<!--[^]*?-->|<style(\s[^]*?)?(?:>([^]*?)<\/style>|\/>)/;

export function renderSvelteTemplate(parsed: ParsedSvelteAst): string {
  const printer = ts.createPrinter();
  const printedScript = printer.printFile(parsed.script.ast);
  const css = compileCss(parsed.style.ast);
  // TODO: Fix me
  const pureJsonAst = JSON.parse(JSON.stringify(parsed.html.ast));
  const html = sveltePrinter.printCode(pureJsonAst);
  // debugger;
  return prettier.format(
    `<script${parsed.script.attrs}>${printedScript}</script>
${html}
<style${parsed.style.attrs}>${css}</style>
`,
    {
      parser: "svelte",
      plugins: [tsPlugin, sveltePlugin, cssPlugin],
    }
  );
}

export function parseSvelteTemplate(source: string): ParsedSvelteAst {
  const [scriptFull, scriptAttrs, scriptContent] = source.match(
    scriptRegexp
  ) ?? ["", "", ""];
  const [styleFull, styleAttrs, styleContent] = source.match(styleRegexp) ?? [
    "",
    "",
    "",
  ];
  const html = source.replace(scriptFull, "").replace(styleFull, "");
  const parsed = svelteCompiler.parse(html);
  return {
    script: {
      attrs: scriptAttrs ?? "",
      ast: ts.createSourceFile(
        "$.tsx",
        scriptContent ?? "",
        ts.ScriptTarget.Latest
      ),
    },
    style: {
      attrs: styleAttrs ?? "",
      ast: parseCss(styleContent ?? ""),
    },
    html: {
      ast: parsed,
    },
  };
}

export function extractEditableProperties(
  source: ts.SourceFile
): Array<ScriptEditableProperty> {
  let properties: Array<ScriptEditableProperty> = [];
  for (const stmt of source.statements) {
    if (ts.isVariableStatement(stmt)) {
      const hasExportModifier = stmt.modifiers?.some((mod) => {
        return mod.kind === ts.SyntaxKind.ExportKeyword;
      });
      if (!hasExportModifier) continue;
      // var = 0, let = 1, const = 2
      if (stmt.declarationList.flags === 1) {
        const m = stmt.getFullText(source).match(/\/\*\s(.*?)\s\*\//);
        const comment = m?.[1];
        stmt.declarationList.forEachChild((child) => {
          if (ts.isVariableDeclaration(child)) {
            const text = child.type?.getText(source);
            const defaultValue = child.initializer?.getText(source);
            properties.push({
              identifier: child.name.getFullText(source).replace(/\s/, ""),
              type: text as any,
              comment,
              defaultValue: defaultValue
                ? {
                    type: "string",
                    value: defaultValue.substr(1, defaultValue.length - 2),
                  }
                : undefined,
            });
          }
        });
      }
    }
  }
  return properties;
}
