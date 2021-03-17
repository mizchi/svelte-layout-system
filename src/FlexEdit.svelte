<script lang="ts">
  import type { FlexData, FlexChildren } from "./types";
  import Seekbar from "./Seekbar.svelte";
  import { createEventDispatcher } from "svelte";

  export let type: "horizontal" | "vertical" = "horizontal";
  export let flexData: FlexData;
  export let width: number;
  export let height: number; // wip for vertical

  const dispatch = createEventDispatcher<{
    "change-flex": FlexChildren;
  }>();

  const onSeekEnd = (ev: CustomEvent<FlexChildren>) => {
    dispatch("change-flex", ev.detail);
  };
</script>

<div class="flex-edit-layer">
  {#if type === "horizontal"}
    <Seekbar
      type="horizontal"
      length={width}
      values={flexData.children}
      on:seekend={onSeekEnd}
    />
  {:else}
    <Seekbar
      type="vertical"
      length={height}
      values={flexData.children}
      on:seekend={onSeekEnd}
    />
  {/if}
</div>

<style>
  .flex-edit-layer {
    position: relative;
  }
</style>
