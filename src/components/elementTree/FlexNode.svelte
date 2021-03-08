<script lang="ts">
  import type { ExtendedTemplateNode, InlineComponentNode } from "../../nodes";
  import FaChevronRight from "svelte-icons/fa/FaChevronRight.svelte";
  import FaChevronDown from "svelte-icons/fa/FaChevronDown.svelte";
  import ElementTreeNode from "./ElementTreeNode.svelte";
  import { getTreeContext } from "../elementTree/ElementTree.svelte";
  import { updateChildHandler } from "../treeUtils";

  export let node: InlineComponentNode;
  export let defaultOpened: boolean = true;
  export let onUpdate: (newAst: ExtendedTemplateNode) => void;

  let opened = defaultOpened;
  let onClickOpenToggle = () => {
    opened = !opened;
  };

  const { editMode } = getTreeContext();
  $: direction =
    // @ts-ignore
    node.attributes.find((x) => x.name === "direction")?.value[0].data ?? "row";
</script>

{#if $editMode === "prop"}
  {#each node.children as child, idx}
    <div style="width: 100%">
      <ElementTreeNode
        node={child}
        onUpdate={updateChildHandler(node, idx, onUpdate)}
      />
    </div>
  {/each}
{:else if $editMode === "layout"}
  <div class="inline-flex">
    <button
      class="w-4 h-4 grid place-items-center"
      on:click={onClickOpenToggle}
    >
      {#if opened}
        <FaChevronDown />
      {:else}
        <FaChevronRight />
      {/if}
    </button>
    &nbsp;
    <div class="grid place-items-center">
      <h1>{node.name}:{direction}</h1>
    </div>
  </div>
  {#if opened}
    <div class="pl-4">
      {#each node.children as child, i}
        <div style="width: 100%">
          <ElementTreeNode
            node={child}
            onUpdate={updateChildHandler(node, i, onUpdate)}
          />
        </div>
      {/each}
    </div>
  {/if}
{/if}
