<script lang="ts">
  import { getFlexContext } from "./Flex.svelte";
  export let size: `${number}px` | `${number}%`;

  const parentDirection = getFlexContext();
  let style: string;
  const dev = true;

  $: {
    let newStyle = "";
    const isConstant = size.endsWith("px");
    if (isConstant) {
      if (parentDirection === "row") {
        newStyle = `width: ${size}; height: 100%;`;
      } else if (parentDirection === "column") {
        newStyle = `width: 100%; height: ${size};`;
      }
    } else {
      if (parentDirection === "row") {
        newStyle = `height: 100%; flex-grow: ${size}; flex-basis: 0;`;
      } else if (parentDirection === "column") {
        newStyle = `width: 100%; flex-grow: ${size}; flex-basis: 0;`;
      }
    }
    if (dev) {
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
    /* z-index: auto; */
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
