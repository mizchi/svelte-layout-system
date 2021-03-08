<script lang="ts">
  import type { InlineComponentNode } from "../../nodes";
  import produce from "immer";
  import FaCircle from "svelte-icons/fa/FaCircle.svelte";
  export let node: InlineComponentNode;
  export let onUpdate: (newAst: InlineComponentNode) => void;
  const onInput = (ev: any) => {
    const textValue = ev.target.value as string;
    const newNode = produce(node, (d) => {
      if (d.children[0].type === "Text") {
        d.children[0].data = textValue;
        d.children[0].raw = textValue;
      }
    });
    onUpdate(newNode);
  };

  // @ts-ignore
  $: value = node.children?.[0].data;

  // @ts-ignore
  $: id = node.attributes.find((x) => x.name === "id")?.value[0]?.data;
</script>

<div>
  <div class="flex">
    <div class="w-4 h-4">
      <FaCircle />
    </div>
    <div class="pl-2">{id}(Text)</div>
  </div>
  <div>
    <input {value} on:input={onInput} />
  </div>
</div>

<style>
  input {
    outline: 1px solid black;
  }
</style>
