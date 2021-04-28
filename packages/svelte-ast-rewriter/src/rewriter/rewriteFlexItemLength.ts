import type { InlineComponentNode, Node } from "../nodes";
import { hasAttr, getAttr } from "../transformer";
import type { RewriteFlexItemLengthCommand } from "../command_types";

export function rewriteFlexItemLength(
  cmd: RewriteFlexItemLengthCommand,
  node: Node,
  parent: Node | void,
  _prop?: string,
  _index?: number
) {
  if (isFlexParent(parent as any, cmd.id) && isFlexItem(node as any)) {
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
