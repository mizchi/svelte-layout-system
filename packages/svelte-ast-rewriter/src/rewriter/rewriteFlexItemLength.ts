import type { InlineComponentNode, Node } from "../nodes";
import type { FlexChildren } from "svelte-layout-system";
import { hasAttr, getAttr } from "../transformer";

export type RewriteFlexItemLengthCommand = {
  type: "flex-children";
  nodeId: string;
  children: FlexChildren;
};

export function rewriteFlexItemLength(
  cmd: RewriteFlexItemLengthCommand,
  node: Node,
  parent: Node | void,
  _prop?: string,
  _index?: number
) {
  if (isFlexParent(parent as any, cmd.nodeId) && isFlexItem(node as any)) {
    const parentFlex = parent as InlineComponentNode;
    const flexItem = node as InlineComponentNode;
    const lengthAttr = getAttr(flexItem, "length");
    if (lengthAttr) {
      const selfIndexInParent = parentFlex.children
        // skip TextNode
        .filter((x) => x.type === "InlineComponent")
        // equal self
        .findIndex((x) => x === flexItem);
      lengthAttr.value = [
        {
          type: "Text",
          data: cmd.children[selfIndexInParent],
        } as any,
      ];
    }
  }
}

function isFlexParent(
  node: Node, // TODO
  id: string
): node is InlineComponentNode {
  return (
    node &&
    node.type === "InlineComponent" &&
    ["Flex", "EditableFlex"].includes(node.name) &&
    hasAttr(node as InlineComponentNode, "id", id)
  );
}
function isFlexItem(node: InlineComponentNode): node is InlineComponentNode {
  return node && node.type === "InlineComponent" && node.name === "FlexItem";
}
