<script lang="ts">
  import type { ExtendedTemplateNode, InlineComponentNode } from "../../nodes";
  import produce from "immer";
  import ElementTreeNode from "./ElementTreeNode.svelte";

  export let node: InlineComponentNode;
  export let onUpdate: (newAst: ExtendedTemplateNode) => void;

  const updateChildHandler = (idx: number) => (
    newChild: ExtendedTemplateNode
  ) => {
    const newNode = produce(node, (draft) => {
      draft.children[idx] = newChild;
    });
    onUpdate(newNode);
  };

  function getRoutePath(child: InlineComponentNode) {
    const x = child.attributes.find((x) => x.name === "path");
    if (x?.value[0].type === "Text") {
      return x.value[0].data;
    }
    return;
  }

  let selectedChildIndex = node.children.findIndex(
    (x) => x.type === "InlineComponent" && x.name === "Route"
  );
</script>

<div>
  {#each node.children as child, idx}
    {#if child.type === "InlineComponent" && child.name === "Route"}
      <button
        class="bg-black rounded text-white mr-2 p-1"
        style="min-width: 32px"
        on:click={() => (selectedChildIndex = idx)}
      >
        {getRoutePath(child) ?? "path"}
      </button>
    {/if}
  {/each}
</div>
{#if selectedChildIndex > -1 && node.children[selectedChildIndex]}
  <ElementTreeNode
    node={node.children[selectedChildIndex]}
    onUpdate={updateChildHandler(selectedChildIndex)}
  />
{/if}
