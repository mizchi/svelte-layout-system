<script lang="ts" context="module">
  import { getContext, setContext } from "svelte";
  const ContextKey = "layout:flex";
  export function getFlexContext() {
    return getContext<"row" | "column">(ContextKey);
  }
</script>

<script lang="ts">
  import type { FlexData } from "./types";
  import FlexEdit from "./FlexEdit.svelte";
  import { onDestroy } from "svelte";
  import { getFlexValuesFromChildren } from "./lib/layout";

  export let direction: "column" | "row" = "row";
  export let width: `${number}px` | `${number}%` = "100%" as const;
  export let height: `${number}px` | `${number}%` = "100%" as const;

  setContext(ContextKey, direction);

  let flexRoot: HTMLElement | null = null;
  const dev = true;

  let editData: null | { width: number; height: number; data: FlexData } = null;
  let unobserve: any = null;
  onDestroy(() => {
    unobserve?.();
  });

  let started = false;
  $: {
    console.log("changed");
    if (!started && dev && flexRoot) {
      started = true;
      const observer = new ResizeObserver((entries: any) => {
        for (const entry of entries) {
          if (entry.target === flexRoot && editData) {
            editData = {
              ...editData,
              width: entry.contentRect.width,
              height: entry.contentRect.height,
            };
          }
        }
      });
      const flexData = getFlexValuesFromChildren(flexRoot);
      const rect = flexRoot.getBoundingClientRect();
      editData = {
        data: flexData,
        height: rect.height,
        width: rect.width,
      };
      observer.observe(flexRoot);
      unobserve = () => observer.unobserve(flexRoot!);
    }
  }
  $: editorType =
    direction === "row" ? ("horizontal" as const) : ("vertical" as const);
</script>

<div
  bind:this={flexRoot}
  class="flex"
  style={`
  width: ${width};
  height: ${height};
  flex-direction: ${direction};
  ${dev && "user-select: none;"}
  `}
>
  {#if editData}
    <div style="position:absolute; z-index: 1;">
      <FlexEdit
        type={editorType}
        width={editData.width}
        height={editData.height}
        flexData={editData.data}
        on:change-flex
      />
    </div>
    <slot />
  {:else}
    <slot />
  {/if}
</div>

<style>
  .flex {
    display: flex;
    position: relative;
  }
</style>
