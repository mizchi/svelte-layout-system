<script lang="ts">
  import type { FlexData, FlexChildren } from "./types";
  import Seekbar from "./Seekbar.svelte";
  import { createEventDispatcher } from "svelte";
  export let type: "horizontal" | "vertical" = "horizontal";
  export let flexData: FlexData;
  export let width: number;
  export let height: number; // wip for vertical

  const dispatch = createEventDispatcher<{
    change: FlexChildren;
  }>();

  const onSeekEnd = (ev: CustomEvent<FlexChildren>) => {
    dispatch("change", ev.detail);
  };
</script>

<div class="editable-flex-overlay">
  {#if type === "horizontal"}
    <Seekbar
      type="horizontal"
      length={width}
      children={flexData.children}
      on:seekend={onSeekEnd}
    />
  {:else}
    <Seekbar
      type="vertical"
      length={height}
      children={flexData.children}
      on:seekend={onSeekEnd}
    />
  {/if}
</div>

<style>
  .editable-flex-overlay {
    position: relative;
  }
</style>
