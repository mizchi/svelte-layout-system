import type { InsertChildCommand } from "../command_types";
import type { InlineComponentNode, Node, ElementNode } from "../nodes";
import { hasAttr } from "../transformer";

export function insertChild(
  cmd: InsertChildCommand,
  node: Node,
  _parent: Node | void,
  _prop?: string,
  _index?: number
) {
  if (isTarget(node, cmd.id)) {
    node.children.push(cmd.newNode);
  }
}

function isTarget(
  node: Node, // TODO
  id: string
): node is InlineComponentNode | ElementNode {
  return (
    node &&
    ["InlineComponent", "ElementNode"].includes(node.type) &&
    hasAttr(node as InlineComponentNode, "id", id)
  );
}
