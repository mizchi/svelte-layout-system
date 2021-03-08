<script lang="ts">
  import type { GridData } from "../lib/gridApi";
  import { renderToStyle } from "../lib/gridApi";
  import TitleBlock from "../data/sdk/components/block/TitleBlock.svelte";
  import GridEditorLayer from "./GridEditorLayer.svelte";
  let grid: GridData = {
    rows: ["1fr", "40px", "1fr"],
    columns: ["1fr", "30px", "1fr"],
    areas: [
      ["a", "b", "c"],
      ["e", "f", "g"],
      ["h", "i", "j"],
    ],
  };
  $: containerStyle = renderToStyle(grid);

  let target: null | HTMLElement = null;
  const onChangeGrid = (ev: CustomEvent<GridData>) => {
    grid = ev.detail;
  };

  let showEditor = false;
</script>

<h1>Grid</h1>
<div style="position:relative; width: 600px; height: 500px;">
  <!-- controller -->
  {#if target && showEditor}
    <div style="position:absolute">
      <GridEditorLayer
        {grid}
        gridRoot={target}
        on:change-grid={onChangeGrid}
        on:close={() => (showEditor = false)}
      />
    </div>
  {/if}

  <div
    bind:this={target}
    style={`width: 100%; height: 100%; ${containerStyle}`}
  >
    {#each grid.areas.flat() as area}
      <div
        id={area}
        on:click={() => (showEditor = true)}
        style={`
      grid-area: ${area};
      background: wheat;
      box-sizing-border-bottom;
      border: 1px dashed black;
      `}
      >
        <TitleBlock>{area}</TitleBlock>
        <!-- <ImageBlock src="https://i.imgur.com/nAnqC.jpg" /> -->
      </div>
    {/each}
  </div>
</div>
