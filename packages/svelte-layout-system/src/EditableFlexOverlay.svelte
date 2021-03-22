<script lang="ts">
  import type { FlexData, FlexChildren, FlexChange } from "./types";
  import Seekbar from "./Seekbar.svelte";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { getFlexDataFromElement } from "./lib/layout";
  export let target: HTMLElement;
  let rect: null | { width: number; height: number } = null;
  let flexData: FlexData;

  // run once if target is ready
  let started = false;
  let unobserve: any = null;
  onDestroy(() => unobserve?.());
  $: if (target != null && !started) {
    started = true;
    rect = target.getBoundingClientRect();
    flexData = getFlexDataFromElement(target);
    const observer = new ResizeObserver((entries: any) => {
      for (const entry of entries) {
        if (entry.target === target) {
          flexData = getFlexDataFromElement(target);
          rect = {
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          };
        }
      }
    });
    observer.observe(target);
    unobserve = observer.unobserve(target);
  }
  // events
  const dispatch = createEventDispatcher<{ change: FlexChange }>();
  const onSeekEnd = (ev: CustomEvent<FlexChildren>) => {
    dispatch("change", {
      target,
      children: ev.detail,
    });
  };
</script>

{#if flexData && rect}
  <div class="editable-flex-overlay">
    {#if flexData.direction === "row"}
      <Seekbar
        type="horizontal"
        length={rect.width}
        children={flexData.children}
        on:seekend={onSeekEnd}
      />
    {:else}
      <Seekbar
        type="vertical"
        length={rect.height}
        children={flexData.children}
        on:seekend={onSeekEnd}
      />
    {/if}
  </div>
{/if}

<style>
  .editable-flex-overlay {
    position: relative;
  }
</style>
