import produce from "immer";
import type {
  ExtendedTemplateNode,
  InlineComponentNode,
  ElementNode,
} from "../nodes";

type NodeWithChildren = InlineComponentNode | ElementNode;

export const updateChild = (
  node: NodeWithChildren,
  idx: number,
  newChild: ExtendedTemplateNode
) => {
  return produce(node, (draft) => {
    draft.children[idx] = newChild;
  });
};

export const updateChildHandler = (
  node: ExtendedTemplateNode,
  idx: number,
  onUpdate: (newNode: ExtendedTemplateNode) => void
) => (newChild: ExtendedTemplateNode) => {
  onUpdate(updateChild(node as NodeWithChildren, idx, newChild));
};
