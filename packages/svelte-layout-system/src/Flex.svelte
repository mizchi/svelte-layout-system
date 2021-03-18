<script lang="ts" context="module">
  import type { FlexContextData } from "./types";

  import { getContext, setContext } from "svelte";
  const ContextKey = "layout-system:flex";
  export function getFlexContext() {
    return getContext<FlexContextData>(ContextKey);
  }
</script>

<script lang="ts">
  export let direction: "column" | "row" = "row";
  export let width: `${number}px` | `${number}%` = "100%" as const;
  export let height: `${number}px` | `${number}%` = "100%" as const;
  setContext<FlexContextData>(ContextKey, {
    direction,
    editable: false,
  });
</script>

<div
  class="flex"
  style={`
  width: ${width};
  height: ${height};
  flex-direction: ${direction};
  `}
>
  <slot />
</div>

<style>
  .flex {
    display: flex;
    position: relative;
  }
</style>
