import { updateAttirbute } from "./rewriter/updateAttribute";
import { insertChild } from "./rewriter/insertChild";
import type { ParsedSvelteAst } from "./node_types";
import type {
  AttributeNode,
  ElementNode,
  InlineComponentNode,
  MustacheTagNode,
  Node,
  TextNode,
} from "./nodes";
import * as b from "./ast_builder";

import produce from "immer";
import { walk as walkEstree } from "estree-walker";
import { rewriteFlexItemLength } from "./rewriter/rewriteFlexItemLength";
import { deleteNode } from "./rewriter/deleteNode";
import type { RewriteCommand } from "./command_types";

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

export function setAttr(
  node: InlineComponentNode | ElementNode,
  key: string,
  value: Array<TextNode | MustacheTagNode>
): AttributeNode | void {
  const idx = node.attributes.findIndex((x) => x.name === key);
  if (idx > -1) {
    node.attributes[idx].value = value;
  } else {
    node.attributes.push(b.attribute(key, value));
  }
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

export function transform(parsed: ParsedSvelteAst, cmd: RewriteCommand) {
  return produce(parsed, (newParsed) => {
    const fragment = newParsed.template.html as Node;
    switch (cmd.type) {
      case "flex-children": {
        visit(fragment, (...args) => rewriteFlexItemLength(cmd, ...args));
        break;
      }
      case "insert-child": {
        visit(fragment, (...args) => insertChild(cmd, ...args));
        break;
      }
      case "update-attribute": {
        visit(fragment, (...args) => updateAttirbute(cmd, ...args));
        break;
      }
      case "delete-node": {
        visit(fragment, (...args) => deleteNode(cmd, ...args));
        break;
      }
    }
  });
}

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
