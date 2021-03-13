<script lang="ts">
  import type { GridData } from "../../lib/gridApi";
  import { getGridAnchors } from "../../lib/gridApi";
  import MultiSeek from "./MultiSeek.svelte";
  import { createEventDispatcher, onMount } from "svelte";
  export let gridRoot: HTMLElement;
  export let grid: GridData;
  const dispatch = createEventDispatcher();

  let anchors: {
    width: number;
    height: number;
    rowAnchors: number[];
    columnAnchors: number[];
  } | null = null;

  onMount(() => {
    const rect = gridRoot.getBoundingClientRect();
    const a = getGridAnchors(grid, rect.width, rect.height);
    anchors = {
      width: rect.width,
      height: rect.height,
      rowAnchors: a.rowsAnchors,
      columnAnchors: a.columnAnchors,
    };
  });

  const onSeekEnd = (ev: CustomEvent<number[]>) => {
    const newGrid = {
      ...grid,
      columns: ev.detail.map((rate) => `${rate}fr`),
    };
    dispatch("change-grid", newGrid);
  };

  const onSeekEndVertical = (ev: CustomEvent<number[]>) => {
    const newGrid = {
      ...grid,
      rows: ev.detail.map((rate) => `${rate}fr`),
    };
    dispatch("change-grid", newGrid);
  };

  let element: SVGSVGElement;
  const onClose = (ev: any) => {
    ev.preventDefault();
    dispatch("close");
  };
</script>

<!-- controller -->
{#if anchors}
  <svg
    width={anchors.width}
    height={anchors.height}
    bind:this={element}
    on:contextmenu={onClose}
    style="background: rgba(128,128,128,0.5)"
  >
    <MultiSeek
      x={0}
      y={0}
      type="horizontal"
      length={anchors.width}
      anchors={anchors.columnAnchors}
      parent={element}
      on:seekend={onSeekEnd}
    />
    <MultiSeek
      x={anchors.width - 20}
      y={0}
      type="vertical"
      length={anchors.height}
      anchors={anchors.rowAnchors}
      parent={element}
      on:seekend={onSeekEndVertical}
    />
    <rect x={anchors.width - 16} y={0} width={16} height={16} fill="red" />
    <text
      x={anchors.width - 12}
      y={12}
      font-size="16px"
      dominant-baseline="center"
      on:click={onClose}
      fill="black">x</text
    >
  </svg>
{/if}
