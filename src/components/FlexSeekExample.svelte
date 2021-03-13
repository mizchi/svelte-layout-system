<script lang="ts">
  import type { FlexData } from "../lib/gridApi";
  // import FlexEditorLayer from "./FlexEdit.svelte";
  let flexData: FlexData = {
    direction: "row",
    proportions: ["1", "2", "1"],
  };
  let target: HTMLElement | null = null;
  const onChangeFlex = (ev: CustomEvent<FlexData>) => {
    flexData = ev.detail;
  };
</script>

<h1>Flex</h1>
<div style="position:relative; padding: 10px">
  {#if target && flexData}
    <div style="position:absolute">
      <!-- <FlexEditorLayer
        {flexData}
        on:change-flex={onChangeFlex}
      /> -->
    </div>
  {/if}

  <div bind:this={target} style="width: {500}px;height:{100}px; display: flex">
    {#if flexData.direction === "row"}
      {#each flexData.proportions as proportion}
        <div
          style="flex: {proportion}; height: 100%; display:grid; place-items:center; outline: 1px dashed black"
        >
          {proportion}
        </div>
      {/each}
    {/if}
  </div>
</div>
