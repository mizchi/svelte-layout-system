import type {
  InlineComponentNode,
  Node,
  AttributeNode,
  MustacheTagNode,
  TextNode,
  ElementNode,
} from "../nodes";
import { hasAttr, setAttr } from "../transformer";

export type UpdateAttributeCommand = {
  type: "update-attribute";
  nodeId: string;
  attributeName: string;
  value: Array<TextNode | MustacheTagNode>;
};

export function updateAttirbute(
  cmd: UpdateAttributeCommand,
  node: Node,
  _parent: Node | void,
  _prop?: string,
  _index?: number
) {
  if (isTarget(node, cmd.nodeId)) {
    setAttr(node, cmd.attributeName, cmd.value);
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
