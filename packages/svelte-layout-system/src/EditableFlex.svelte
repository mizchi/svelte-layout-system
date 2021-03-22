<script lang="ts" context="module">
  import type { FlexContextData, FlexChildren, FlexChange } from "./types";
  import { getContext, setContext } from "svelte";
  const ContextKey = "layout-system:flex";
  export function getFlexContext() {
    return getContext<FlexContextData>(ContextKey);
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { isEditable } from "./Editable.svelte";
  import EditableFlexOverlay from "./EditableFlexOverlay.svelte";

  // props
  export let direction: "column" | "row" = "row";
  export let width: `${number}px` | `${number}%` = "100%" as const;
  export let height: `${number}px` | `${number}%` = "100%" as const;
  export let id: string | null = null;
  // events
  const dispatch = createEventDispatcher<{ change: FlexChange }>();

  setContext<FlexContextData>(ContextKey, {
    direction,
  });

  let flexElement: HTMLElement;

  const onChangeFlex = (ev: CustomEvent<FlexChildren>) => {
    dispatch("change", {
      target: flexElement,
      children: ev.detail,
    });
  };
</script>

<div
  bind:this={flexElement}
  class="flex"
  style="width:{width};height:{height};flex-direction:{direction};user-select: none;"
  data-editable-id={id}
>
  {#if isEditable()}
    <div class="flex-editable-overlay">
      <EditableFlexOverlay target={flexElement} on:change={onChangeFlex} />
    </div>
  {/if}
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
