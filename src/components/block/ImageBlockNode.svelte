<script lang="ts">
  import type { InlineComponentNode, AttributeNode } from "../../nodes";
  import FaCircle from "svelte-icons/fa/FaCircle.svelte";

  export let node: InlineComponentNode;
  export let onUpdate: (newAst: InlineComponentNode) => void;
  $: src = node.attributes.find((x) => x.name === "src") as AttributeNode;
  $: value = src?.value[0].type === "Text" ? src.value[0].data : "";

  // @ts-ignore
  $: id = node.attributes.find((x) => x.name === "id")?.value[0]?.data;
</script>

{#if src}
  <div class="flex">
    <div class="w-4 h-4">
      <FaCircle />
    </div>
    <div class="pl-2">{id}(Image)</div>
  </div>
  <img src={value} width="50%" alt="preview" />
{/if}

<style>
</style>
