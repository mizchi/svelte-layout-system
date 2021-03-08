<script lang="ts">
  import type { ExtendedTemplateNode, InlineComponentNode } from "../../nodes";
  import FaChevronRight from "svelte-icons/fa/FaChevronRight.svelte";
  import FaChevronDown from "svelte-icons/fa/FaChevronDown.svelte";
  import ElementTreeNode from "./ElementTreeNode.svelte";
  import RouterNode from "./RouterNode.svelte";
  import ParagraphBlockNode from "../block/ParagraphBlockNode.svelte";
  import ImageBlockNode from "../block/ImageBlockNode.svelte";
  import TextButtonBlockNode from "../block/TextButtonBlockNode.svelte";
  import { getTreeContext } from "../elementTree/ElementTree.svelte";
  import { updateChildHandler } from "../treeUtils";
  import FlexNode from "./FlexNode.svelte";

  export let node: InlineComponentNode;
  export let defaultOpened: boolean = true;
  export let onUpdate: (newAst: ExtendedTemplateNode) => void;

  let opened = defaultOpened;
  let onClickOpenToggle = () => {
    opened = !opened;
  };

  // const updateChildHandler = (idx: number) => (
  //   newChild: ExtendedTemplateNode
  // ) => {
  //   // console.log("update index", node, idx);
  //   const newNode = produce(node, (draft) => {
  //     // @ts-ignore
  //     draft.children[idx] = newChild;
  //   });
  //   onUpdate(newNode);
  // };

  const { editMode } = getTreeContext();
</script>

{#if node.name === "Router"}
  <RouterNode {node} {onUpdate} />
{:else if node.name === "ParagraphBlock"}
  <ParagraphBlockNode {node} {onUpdate} />
{:else if node.name === "ImageBlock"}
  <ImageBlockNode {node} {onUpdate} />
{:else if node.name === "TextButtonBlock"}
  <TextButtonBlockNode {node} {onUpdate} />
{:else if node.name === "Flex"}
  <FlexNode {node} {onUpdate} />
{:else if node.name === "Route"}
  {#each node.children as child, i}
    <div style="width: 100%">
      <ElementTreeNode
        node={child}
        onUpdate={updateChildHandler(node, i, onUpdate)}
      />
    </div>
  {/each}
{:else}
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
      <h1>{node.name}</h1>
    </div>
  </div>
  <!-- {#each node.attributes as attr, i}
  <ElementTreeNode node={attr} onUpdate={updateAttributeHandler(i)} />
  &nbsp;
{/each} -->
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
      <!-- <div>
      <button class="w-4 h-4"><FaPlus /></button>
    </div> -->
    </div>
  {/if}
{/if}
