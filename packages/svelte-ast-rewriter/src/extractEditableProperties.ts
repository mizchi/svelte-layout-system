import ts from "typescript";
import type { NodeAttribute } from "./node_types";

type ScriptEditableProperty = {
  identifier: string;
  type: "number" | "string" | "boolean";
  comment?: string;
  defaultValue?: NodeAttribute;
};

export function extractEditableProperties(
  source: ts.SourceFile
): Array<ScriptEditableProperty> {
  const properties: Array<ScriptEditableProperty> = [];
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
