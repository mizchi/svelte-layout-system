<script lang="ts">
  import type { FlexData } from "../../lib/gridApi";
  import { getFlexAnchors } from "../../lib/gridApi";
  import MultiSeek from "./MultiSeek.svelte";
  import { createEventDispatcher } from "svelte";

  // props
  export let type: "horizontal" | "vertical" = "horizontal";
  export let flexData: FlexData;
  export let width: number;
  export let height: number;

  const dispatch = createEventDispatcher();

  let anchors = getFlexAnchors(
    flexData,
    type === "horizontal" ? width : height
  );

  // console.log("anchors", anchors);

  const onSeekStart = (ev: CustomEvent<number[]>) => {
    dispatch("seek start", ev.detail);
  };

  const onSeekEnd = (ev: CustomEvent<number[]>) => {
    const newFlex: FlexData = {
      direction: flexData.direction,
      proportions: ev.detail.map((rate) => `${rate}` as const),
    };
    dispatch("change-flex", newFlex);
  };

  let element: HTMLElement;
</script>

<!-- controller -->
<div style="position:relative;" bind:this={element}>
  {#if type === "horizontal"}
    <MultiSeek
      x={0}
      y={0}
      type="horizontal"
      length={width}
      {anchors}
      parent={element}
      on:seekstart={onSeekStart}
      on:seekend={onSeekEnd}
    />
  {:else}
    <MultiSeek
      x={0}
      y={0}
      type="vertical"
      length={height}
      {anchors}
      parent={element}
      on:seekstart={onSeekStart}
      on:seekend={onSeekEnd}
    />
  {/if}
</div>
