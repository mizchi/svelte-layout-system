<script lang="ts" context="module">
  import type { FlexContextData, FlexChildren, FlexChange } from "./types";
  import { getContext, setContext } from "svelte";
  const ContextKey = "layout-system:flex";
  export function getFlexContext() {
    return getContext<FlexContextData>(ContextKey);
  }
</script>

<script lang="ts">
  import EditableFlexOverlay from "./EditableFlexOverlay.svelte";
  import { isEditable } from "./Editable.svelte";

  export let direction: "column" | "row" = "row";
  export let width: `${number}px` | `${number}%` = "100%" as const;
  export let height: `${number}px` | `${number}%` = "100%" as const;
  export let id: string | undefined = undefined;

  setContext<FlexContextData>(ContextKey, {
    direction,
  });

  let flexElement: HTMLElement;
</script>

{#if isEditable()}
  <div class="flex-editable-overlay">
    <EditableFlexOverlay target={flexElement} on:change on:seekend />
  </div>
{/if}

<div
  bind:this={flexElement}
  class="flex"
  style="width:{width};height:{height};flex-direction:{direction};user-select: none;"
  {id}
>
  <slot />
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
