import type { ParsedSvelteAst } from "./types";
import type {
  AttributeNode,
  ElementNode,
  InlineComponentNode,
  Node,
} from "./nodes";
import type { RewriteFlexItemLengthCommand } from "./rewriter/rewriteFlexItemLength";

import produce from "immer";
import { walk as walkEstree } from "estree-walker";
import { rewriteFlexItemLength } from "./rewriter/rewriteFlexItemLength";

export function hasAttr(
  node: InlineComponentNode | ElementNode,
  key: string,
  equalTo?: string
): boolean {
  const attr = node.attributes.find((x) => x.name === key);
  if (equalTo != null && attr?.value[0].type === "Text") {
    return attr.value[0].data === equalTo;
  } else {
    return !!attr;
  }
}

export function getAttr(
  node: InlineComponentNode | ElementNode,
  key: string
): AttributeNode | void {
  return node.attributes.find((x) => x.name === key);
}

export function getAttrText(
  node: InlineComponentNode | ElementNode,
  key: string
): string | void {
  const attr = node.attributes.find((x) => x.name === key);
  const first = attr?.value[0];
  if (first?.type === "Text") {
    return first.data;
  }
  return;
}

type VoidCommand = {
  type: "void";
};

export type RewriteCommand = VoidCommand | RewriteFlexItemLengthCommand;

function visit(
  node: Node,
  visitor: (node: Node, parent?: Node, prop?: string, index?: number) => void
) {
  walkEstree(node, {
    enter(next, parent, prop, index) {
      visitor(next as Node, parent as Node | undefined, prop, index);
    },
  });
}

export function transform(parsed: ParsedSvelteAst, cmd: RewriteCommand) {
  return produce(parsed, (newParsed) => {
    switch (cmd.type) {
      case "flex-children": {
        visit(newParsed.template.html as Node, (...args) =>
          rewriteFlexItemLength(cmd, ...args)
        );
      }
    }
  });
}
