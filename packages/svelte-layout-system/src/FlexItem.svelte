<script lang="ts">
  import { getFlexContext } from "./EditableFlex.svelte";
  import { hasSuffix } from "./lib/layout";
  export let length: `${number}px` | `${number}`;
  const flexContext = getFlexContext();

  let style: string;
  $: {
    let newStyle = "";
    if (hasSuffix(length, "px")) {
      if (flexContext.direction === "row") {
        newStyle = `width: ${length}; height: 100%;`;
      } else if (flexContext.direction === "column") {
        newStyle = `width: 100%; height: ${length};`;
      }
    } else {
      if (flexContext.direction === "row") {
        newStyle = `height: 100%; flex-grow: ${length}; flex-basis: 0;`;
      } else if (flexContext.direction === "column") {
        newStyle = `width: 100%; flex-grow: ${length}; flex-basis: 0;`;
      }
    }
    if (flexContext.editable) {
      newStyle += `outline: 1px dashed black`;
    }
    style = newStyle;
  }
</script>

<div class="flex-item" {style}>
  <div class="flex-item-inner">
    <slot />
  </div>
</div>

<style>
  .flex-item {
    max-width: 100%;
    max-height: 100%;
    position: relative;
    isolation: isolate;
  }
  .flex-item-inner {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    max-width: 100%;
    max-height: 100%;
    z-index: auto;
    isolation: isolate;
  }
</style>
