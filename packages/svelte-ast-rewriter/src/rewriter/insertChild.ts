import type { InlineComponentNode, Node, ElementNode } from "../nodes";
import { hasAttr } from "../transformer";

export type InsertChildCommand = {
  type: "insert-child";
  nodeId: string;
  newNode: Node;
};

export function insertChild(
  cmd: InsertChildCommand,
  node: Node,
  _parent: Node | void,
  _prop?: string,
  _index?: number
) {
  if (isTarget(node, cmd.nodeId)) {
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
