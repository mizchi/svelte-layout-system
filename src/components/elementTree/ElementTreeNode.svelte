<script lang="ts">
  import type { ExtendedTemplateNode, TextNode } from "../../nodes";
  import InlineComponentNode from "./InlineComponentNode.svelte";
  import produce from "immer";
  import { updateChildHandler} from "../treeUtils";

  export let node: ExtendedTemplateNode;
  export let onUpdate: (newAst: ExtendedTemplateNode) => void;

  // const onUpdateChild = ()

  // const updateChildHandler = (idx: number) => (
  //   newChild: ExtendedTemplateNode
  // ) => {
  //   console.log("update index", node, idx);
  //   const newNode = produce(node, (draft) => {
  //     // @ts-ignore
  //     draft.children[idx] = newChild;
  //   });
  //   onUpdate(newNode);
  // };

  const updateAttributeValueHandler = (idx: number) => (
    newChild: ExtendedTemplateNode
  ) => {
    // debugger;
    // console.log("update attr value", node, idx, newChild);

    const newNode = produce(node, (draft) => {
      // @ts-ignore
      draft.value[idx] = newChild;
    });
    onUpdate(newNode);
  };

  const onUpdateText = (ev: any) => {
    if (ev.target instanceof HTMLInputElement) {
      console.log("update text", node, ev.target.value);
      const newNode = {
        ...node,
        data: ev.target.value,
        raw: undefined as any,
      } as TextNode;
      onUpdate(newNode);
    }
  };

  const onUpdateExpression = (newNode: ExtendedTemplateNode) => {
    // @ts-ignore
    onUpdate({ ...node, expression: newNode });
  };
</script>

{#if node.type === "Fragment"}
  <div>
    <div class="pl-1">
      {#each node.children as child, i}
        <div style="width: 100%">
          <svelte:self node={child} onUpdate={updateChildHandler(node, i, onUpdate)} />
        </div>
      {/each}
    </div>
  </div>
{:else if node.type === "Element"}
  {#each node.children as child, idx}
    <svelte:self node={child} onUpdate={updateChildHandler(node, idx, onUpdate)} />
  {/each}
{:else if node.type === "InlineComponent"}
  <InlineComponentNode {node} {onUpdate} />
{:else if node.type === "Attribute"}
  {node.name}=
  {#each node.value as v, idx}
    <svelte:self node={v} onUpdate={updateAttributeValueHandler(idx)} />
  {/each}
{:else if node.type === "MustacheTag"}
  {"{"}
  <svelte:self node={node.expression} onUpdate={onUpdateExpression} />
  {"}"}
{:else if node.type === "Identifier"}
  {node.name}
{:else if node.type === "Text"}
  {#if /\s+$/.test(node.data)}
    <!-- No content -->
  {:else}
    {node.data}
    <!-- <input
      value={node.data}
      on:input={onUpdateText}
      class="rounded border border-gray-200 focus:bg-white focus:outline-none min-w-min"
    /> -->
  {/if}
{:else}
  <!-- unknown: {node.type} -->
{/if}
