<script lang="ts" context="module">
  import type { Writable } from "svelte/store";

  export type ElementTreeContext = {
    editMode: Writable<"prop" | "layout">;
  };
  export const editMode: Writable<"prop" | "layout"> = writable("prop");

  const marker = "tree";
  export const getTreeContext = () => getContext<ElementTreeContext>(marker);
</script>

<script lang="ts">
  import ElementTreeNode from "./ElementTreeNode.svelte";
  import type { ExtendedTemplateNode } from "../../nodes";
  import { writable } from "svelte/store";
  import { getContext, setContext } from "svelte";
  export let root: ExtendedTemplateNode;
  export let onUpdate: (newAst: ExtendedTemplateNode) => void;

  setContext<ElementTreeContext>(marker, {
    editMode,
  });
</script>

<div class="whitespace-nowrap w-full h-full overflow-y-auto font-mono">
  <ElementTreeNode node={root} {onUpdate} />
</div>
