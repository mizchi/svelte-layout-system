<script lang="ts" context="module">
  import type { FlexContextData, FlexChildren, FlexChange } from "./types";
  import { getContext, setContext } from "svelte";
  const ContextKey = "layout-system:flex";
  export function getFlexContext() {
    return getContext<FlexContextData>(ContextKey);
  }
</script>

<script lang="ts">
  import type { FlexData } from "./types";
  import EditableFlexOverlay from "./EditableFlexOverlay.svelte";
  import { onDestroy, createEventDispatcher } from "svelte";
  import { getFlexValuesFromChildren } from "./lib/layout";
  import { isEditable } from "./Editable.svelte";

  export let direction: "column" | "row" = "row";
  export let width: `${number}px` | `${number}%` = "100%" as const;
  export let height: `${number}px` | `${number}%` = "100%" as const;
  export let id: string | null = null;

  setContext<FlexContextData>(ContextKey, {
    direction,
    editable: true,
  });

  let flexRoot: HTMLElement;

  let editData: null | { width: number; height: number; data: FlexData } = null;

  let unobserve: any = null;

  const dispatch = createEventDispatcher<{ change: FlexChange }>();

  onDestroy(() => {
    unobserve?.();
  });

  let started = false;
  $: if (isEditable() && !started && flexRoot) {
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
  $: editorType =
    direction === "row" ? ("horizontal" as const) : ("vertical" as const);

  const onChangeFlex = (ev: CustomEvent<FlexChildren>) => {
    dispatch("change", {
      target: flexRoot,
      children: ev.detail,
    });
  };
</script>

<div
  bind:this={flexRoot}
  class="flex"
  style="width:{width};height:{height};flex-direction:{direction};user-select: none;"
  data-editable-id={id}
>
  {#if isEditable() && editData}
    <div class="flex-editable-overlay">
      <EditableFlexOverlay
        type={editorType}
        width={editData.width}
        height={editData.height}
        flexData={editData.data}
        on:change={onChangeFlex}
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
  }
  .flex-editable-overlay {
    position: absolute;
    z-index: 1;
  }
</style>
