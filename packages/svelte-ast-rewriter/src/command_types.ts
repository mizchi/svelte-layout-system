import type { FlexChildren } from "svelte-layout-system";
import type {
  InlineComponentNode,
  Node,
  AttributeNode,
  MustacheTagNode,
  TextNode,
  ElementNode,
} from "./nodes";

export type DeleteNodeCommand = {
  type: "delete-node";
  id: string;
};

export type InsertChildCommand = {
  type: "insert-child";
  id: string;
  newNode: Node;
};

export type RewriteFlexItemLengthCommand = {
  type: "flex-children";
  id: string;
  children: FlexChildren;
};

export type UpdateAttributeCommand = {
  type: "update-attribute";
  id: string;
  attributeName: string;
  value: Array<TextNode | MustacheTagNode>;
};

export type VoidCommand = {
  type: "void";
};

export type RewriteCommand =
  | VoidCommand
  | RewriteFlexItemLengthCommand
  | InsertChildCommand
  | DeleteNodeCommand
  | UpdateAttributeCommand;
