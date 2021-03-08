<script lang="ts">
  import type { InlineComponentNode } from "../../nodes";
  import FaCircle from "svelte-icons/fa/FaCircle.svelte";

  export let node: InlineComponentNode;
  export let onUpdate: (newAst: InlineComponentNode) => void;
  // @ts-ignore
  $: id = node.attributes.find((x) => x.name === "id")?.value[0]?.data;
</script>

<div>
  <div class="flex">
    <div class="w-4 h-4">
      <FaCircle />
    </div>
    <div class="pl-2">
      {id}(Button)
    </div>
  </div>
</div>
