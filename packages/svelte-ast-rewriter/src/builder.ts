import type { Expression } from "typescript";
import type {
  AttributeNode,
  Node,
  InlineComponentNode,
  TextNode,
  MustacheTagNode,
} from "./nodes";

export type InsertChildCommand = {
  type: "insert-child";
  nodeId: string;
  child: Node;
};

export function inlineComponent(
  componentName: string,
  attributes: AttributeNode[] = [],
  children: Node[] = []
): InlineComponentNode {
  return {
    type: "InlineComponent",
    name: componentName,
    attributes: attributes,
    children,
  };
}

export function attribute(
  name: string,
  value: Array<TextNode | MustacheTagNode>
): AttributeNode {
  return {
    type: "Attribute",
    name,
    value,
  };
}

export function text(value: string): TextNode {
  return {
    type: "Text",
    data: value,
    raw: value,
  };
}

export function mustacheTag(expression: Node): MustacheTagNode {
  return {
    type: "MustacheTag",
    expression,
  };
}
