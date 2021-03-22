<script lang="ts">
  import type { FlexData, FlexChildren } from "./types";
  import Seekbar from "./Seekbar.svelte";
  import { onDestroy, createEventDispatcher } from "svelte";
  import { getFlexValuesFromChildren } from "./lib/layout";

  export let target: HTMLElement;

  let started = false;
  let editData: null | { width: number; height: number; data: FlexData } = null;
  let unobserve: any = null;

  onDestroy(() => {
    unobserve?.();
  });

  $: if (!started && target) {
    started = true;
    const flexData = getFlexValuesFromChildren(target);
    console.log("caculated", flexData);
    const rect = target.getBoundingClientRect();
    editData = {
      data: flexData,
      height: rect.height,
      width: rect.width,
    };
    // debugger;

    // observe
    const observer = new ResizeObserver((entries: any) => {
      for (const entry of entries) {
        if (entry.target === target && editData) {
          editData = {
            ...editData,
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          };
        }
      }
    });
    observer.observe(target);
    unobserve = () => observer.unobserve(target!);
  }

  const dispatch = createEventDispatcher<{
    change: FlexChildren;
  }>();

  const onSeekEnd = (ev: CustomEvent<FlexChildren>) => {
    dispatch("change", ev.detail);
  };
</script>

{#if editData}
  <div class="editable-flex-overlay">
    {#if editData.data.direction === "row"}
      <Seekbar
        type="horizontal"
        length={editData.height}
        children={editData.data.children}
        on:seekend={onSeekEnd}
      />
    {:else}
      <Seekbar
        type="vertical"
        length={editData.height}
        children={editData.data.children}
        on:seekend={onSeekEnd}
      />
    {/if}
  </div>
{:else}
  ...
{/if}

<style>
  .editable-flex-overlay {
    position: relative;
  }
</style>
