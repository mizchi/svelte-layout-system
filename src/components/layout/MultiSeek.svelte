<script lang="ts">
  import produce from "immer";
  import { createEventDispatcher } from "svelte";
  export let length: number;
  export let anchors: number[];
  export let type: "horizontal" | "vertical" = "horizontal";
  export let parent: Element;
  export let x: number;
  export let y: number;
  // import  from "svelte-icons/fa/FaResizeHorizontal.svelte"

  const dispatch = createEventDispatcher();

  const barLength = 16;
  let holdAnchor: {
    index: number;
    dx: number;
    dy: number;
    sx: number;
    sy: number;
  } | null = null;

  const internalId = Math.random().toString(32).substring(2);
  const onMouseMoveOnBar = (ev: any) => {
    if (holdAnchor) {
      const rect = parent.getBoundingClientRect();
      if (type === "horizontal") {
        const cx = ev.pageX - rect.left;
        const delta = cx - holdAnchor.sx;
        const newAnchors = produce(anchors, (d) => {
          d[holdAnchor!.index] = holdAnchor!.sx + delta;
        });
        anchors = newAnchors;
      } else if (type === "vertical") {
        const cy = ev.pageY - rect.top;
        const delta = cy - holdAnchor.sy;
        const newAnchors = produce(anchors, (d) => {
          d[holdAnchor!.index] = holdAnchor!.sy + delta;
        });
        anchors = newAnchors;
      }
    }
  };

  const onMouseUpOnBar = (ev: any) => {
    if (holdAnchor == null) return;
    const rates = [];
    anchors.forEach((x, i) => {
      if (i > 0) {
        rates.push(x - anchors[i - 1]);
      } else {
        rates.push(x);
      }
    });
    rates.push(length - anchors[anchors.length - 1]);
    const newRate = rates.map((x) => x / length);
    dispatch("seekend", newRate);
    holdAnchor = null;
    window.document.body.style.cursor = "auto";
  };

  const onMouseDownOnBar = (ev: any) => {
    const { index, target } = ev.target.dataset ?? {};

    console.log("mousedown", ev.target, index, target);
    if (target == internalId && index) {
      const rect = parent.getBoundingClientRect();
      const x = ev.pageX - rect.left;
      const y = ev.pageY - rect.top;
      holdAnchor = {
        index: Number(index),
        sx: x,
        sy: y,
        dx: 0,
        dy: 0,
      };

      window.document.body.style.cursor = "grabbing";

      dispatch("seekstart", {});
    }
  };
  const color = `rgb(${~~(Math.random() * 255)}, ${~~(
    Math.random() * 255
  )}, ${~~(Math.random() * 255)})`;
</script>

<svelte:window
  on:mousemove={onMouseMoveOnBar}
  on:mouseup={onMouseUpOnBar}
  on:mousedown={onMouseDownOnBar}
/>

<div
  style={`
  position: absolute;
  left: ${x}px;
  top: ${y}px;
`}
>
  {#if type == "horizontal"}
    <div
      style={`
      position: absolute;
      left: 0px;
      top: -1px;
      width: ${length}px;
      height: 2px;
      border: 2px solid ${color};
    `}
    />

    {#each anchors as point, idx}
      <div
        data-target={internalId}
        data-index={idx}
        style={`
        position: absolute;
        left: ${point - barLength / 2}px;
        top: ${-barLength / 2}px;
        width: ${barLength}px;
        height: ${barLength}px;
        border: ${1}px solid gray;
        background: ${color};
        border-radius: ${barLength / 2}px;
        display: grid;
        justify-content: center;
        align-items: center;
        font-size: 4px;
        color: white;
        ${holdAnchor ? "" : "cursor: grab;"}
      `}
      >
        ↔
      </div>
    {/each}
  {:else if "vertical"}
    <div
      style={`
      position: absolute;
      left: -1px;
      top: 0px;
      width: 2px;
      height: ${length}px;
      border: 1px solid ${color};
      pointer-events: none;
      `}
    />

    {#each anchors as point, idx}
      <div
        style={`
        position: absolute;
        left: ${-barLength / 2}px;
        top: ${point - barLength / 2}px;
        width: ${barLength}px;
        height: ${barLength}px;
        border: ${1}px solid gray;
        background: ${color};
        border-radius: ${barLength / 2}px;
        display: grid;
        justify-content: center;
        align-items: center;
        font-size: 3px;
        color: white;
        ${holdAnchor ? "" : "cursor: grab;"}
        `}
        data-target={internalId}
        data-index={idx}
      >
        ↕
      </div>
    {/each}
  {/if}
</div>
