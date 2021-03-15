<script lang="ts">
  import type { FlexData } from "../../lib/gridApi";
  import MultiSeek from "./MultiSeek.svelte";
  import { createEventDispatcher } from "svelte";
  import type { FlexGrowValue, PixelValue } from "../../lib/layout";

  export let type: "horizontal" | "vertical" = "horizontal";
  export let flexData: FlexData;
  export let width: number;
  export let height: number; // wip for vertical

  const dispatch = createEventDispatcher<{
    "change-flex": FlexData;
  }>();

  const onSeekEnd = (ev: CustomEvent<Array<FlexGrowValue | PixelValue>>) => {
    dispatch("change-flex", {
      direction: flexData.direction,
      proportions: ev.detail,
    });
  };

  let element: HTMLElement;
</script>

<div style="position:relative;" bind:this={element}>
  {#if type === "horizontal"}
    <MultiSeek
      type="horizontal"
      length={width}
      values={flexData.proportions}
      on:seekend={onSeekEnd}
    />
  {:else}
    <MultiSeek
      type="vertical"
      length={height}
      values={flexData.proportions}
      on:seekend={onSeekEnd}
    />
  {/if}
</div>
