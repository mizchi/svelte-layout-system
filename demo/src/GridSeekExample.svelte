<script lang="ts">
  import type { GridData } from "../..";
  import GridEditorLayer from "./GridEdit.svelte";
  let grid: GridData = {
    rows: ["1fr", "40px", "1fr"],
    columns: ["1fr", "30px", "1fr"],
    areas: [
      ["a", "b", "c"],
      ["e", "f", "g"],
      ["h", "i", "j"],
    ],
  };
  $: containerStyle = `
    display: grid;
    grid-template-rows: ${grid.rows.join(" ")};
    grid-template-columns: ${grid.columns.join(" ")};
    grid-template-areas: ${grid.areas
      .map((rows) => `'${rows.join(" ")}'`)
      .join(" ")};
  `;
  let target: null | HTMLElement = null;
  const onChangeGrid = (ev: CustomEvent<GridData>) => {
    grid = ev.detail;
  };

  let showEditor = false;
</script>

<h1>Grid</h1>
<div style="position:relative; width: 600px; height: 250px;">
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
        <div style="width:100%;height:100%;display:grid;place-items: center;">
          {area}
        </div>
      </div>
    {/each}
  </div>
</div>
