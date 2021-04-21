import type { InlineComponentNode, Node, ElementNode } from "../nodes";
import { hasAttr } from "../transformer";

export type DeleteNodeCommand = {
  type: "delete-node";
  id: string;
};

export function deleteNode(
  cmd: DeleteNodeCommand,
  node: Node,
  parent: Node | void,
  _prop?: string,
  _index?: number
) {
  if (isTarget(node, cmd.id) && parent && parent.type === "InlineComponent") {
    // const index = parent.children.findIndex((n) => node);
    parent.children = parent.children.filter((n) => {
      return (
        (n.type === "InlineComponent" || n.type === "Element") &&
        !hasAttr(n, "id", cmd.id)
      );
    });
  }
}

function isTarget(
  node: Node,
  id: string
): node is InlineComponentNode | ElementNode {
  return (
    node &&
    ["InlineComponent", "ElementNode"].includes(node.type) &&
    hasAttr(node as InlineComponentNode, "id", id)
  );
}
