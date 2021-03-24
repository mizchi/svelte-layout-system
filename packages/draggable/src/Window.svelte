<script lang="ts">
  import { createEventDispatcher } from "svelte";
  export let name = "";
  export let x: number;
  export let y: number;
  export let w: number;
  export let h: number;

  export let id: string;
  export let zIndex = 0;

  let header: HTMLElement;
  let resizer: HTMLElement;

  const dispatch = createEventDispatcher<{ dragstart: { id: string } }>();

  let holdingHeader: null | {
    originalX: number;
    originalY: number;
    startX: number;
    startY: number;
  } = null;

  let holdingResizer: null | {
    originalW: number;
    originalH: number;
    startX: number;
    startY: number;
  } = null;

  const onMouseDown = (ev: MouseEvent) => {
    if (ev.target === header) {
      holdingHeader = {
        originalX: x,
        originalY: y,
        startX: ev.pageX,
        startY: ev.pageY,
      };
      dispatch("dragstart", { id });
      window.document.body.style.cursor = "grabbing";
    } else if (ev.target === resizer) {
      holdingResizer = {
        originalW: w,
        originalH: h,
        startX: ev.pageX,
        startY: ev.pageY,
      };
      window.document.body.style.cursor = "grabbing";
    }
  };
  const onMouseMove = (ev: MouseEvent) => {
    if (holdingHeader) {
      const deltaX = ev.pageX - holdingHeader.startX;
      const deltaY = ev.pageY - holdingHeader.startY;
      x = holdingHeader.originalX + deltaX;
      y = holdingHeader.originalY + deltaY;
      console.log("mousemove: ", x, y);
    }
    if (holdingResizer) {
      const deltaX = ev.pageX - holdingResizer.startX;
      const deltaY = ev.pageY - holdingResizer.startY;
      w = holdingResizer.originalW + deltaX;
      h = holdingResizer.originalH + deltaY;
      console.log("mousemove: ", x, y);
    }
  };
  const onMouseUp = (ev: MouseEvent) => {
    // if (holdingHeader) {
    //   const deltaX = ev.pageX - holdingHeader.startX;
    //   const deltaY = ev.pageY - holdingHeader.startY;
    //   console.log("mouseup: delta", deltaX, deltaY);
    // }
    holdingHeader = null;
    holdingResizer = null;
    window.document.body.style.cursor = "auto";
  };
</script>

<svelte:window
  on:mousedown={onMouseDown}
  on:mousemove={onMouseMove}
  on:mouseup={onMouseUp}
/>

<div
  class="win"
  style="left: {x}px; top: {y}px; width:{w}px;height:{h}px; z-index: {zIndex};"
>
  <div
    class="corner"
    bind:this={resizer}
    style={holdingResizer ? "" : "cursor: grab;"}
  />
  <div
    class="win-header"
    bind:this={header}
    style={holdingHeader ? "" : "cursor: grab;"}
  >
    {name}
  </div>
  <div class="win-content">
    <slot />
  </div>
</div>

<style>
  .win {
    position: relative;
    box-sizing: border-box;
    border: 1px solid black;
    position: absolute;
    background: wheat;
  }
  .win-header {
    width: 100%;
    height: 24px;
    background: #ddd;
    user-select: none;
    display: grid;
    place-items: center;
  }

  .win-content {
    width: 100%;
    height: calc(100% - 24px);
  }
  .corner {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 20px;
    height: 20px;
    background: gray;
    z-index: 10;
  }
</style>
