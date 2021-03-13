<script lang="ts" context="module">
  import { getContext, setContext } from "svelte";
  const ContextKey = "layout:flex";
  export function getFlexContext() {
    return getContext<"row" | "column">(ContextKey);
  }
</script>

<script lang="ts" {flexRoot}>
  import type { FlexData } from "../../lib/gridApi";

  import FlexEditorLayer from "./FlexEdit.svelte";
  import { onDestroy, createEventDispatcher } from "svelte";
  import { getEditContext } from "./EditContext.svelte";
  import { getFlexValuesFromChildren } from "../../lib/gridApi";

  export let direction: "column" | "row" = "row";
  export let width: `${number}px` | `${number}%` = "100%" as const;
  export let height: `${number}px` | `${number}%` = "100%" as const;
  export let hideForce: boolean = false;
  export let zIndex: number = 0;

  const { editMode } = getEditContext();

  setContext(ContextKey, direction);

  let flexRoot: HTMLElement | null = null;
  const dev = true;

  $: showEdit = flexRoot && $editMode === "layout";

  let editData: null | { width: number; height: number; data: FlexData } = null;
  let unobserve: any = null;
  onDestroy(() => {
    unobserve?.();
  });

  let started = false;
  $: {
    if (!started && dev && flexRoot) {
      started = true;
      const observer = new ResizeObserver((entries) => {
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
  {#if editData && showEdit && !hideForce}
    <div style="position:absolute; z-index: 1;">
      <FlexEditorLayer
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
