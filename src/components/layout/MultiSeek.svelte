<script lang="ts">
  import produce from "immer";
  import { createEventDispatcher } from "svelte";
  export let length: number;
  export let anchors: number[];
  export let type: "horizontal" | "vertical" = "horizontal";
  export let parent: Element;
  export let x: number;
  export let y: number;

  const dispatch = createEventDispatcher();

  const barWidth = 12;
  const barLength = 20;
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
</script>

<svelte:window
  on:mousemove={onMouseMoveOnBar}
  on:mouseup={onMouseUpOnBar}
  on:mousedown={onMouseDownOnBar}
/>

<g transform="translate({x}, {y})" style={holdAnchor ? "" : "cursor: grab"}>
  {#if type == "horizontal"}
    <line x1={0} y1={0} x2={length} y2={0} stroke="red" />
    {#each anchors as point, idx}
      <rect
        x={point - barWidth / 2}
        y={-barLength / 2}
        width={barWidth}
        height={barLength}
        fill="black"
        data-target={internalId}
        data-index={idx}
      />
    {/each}
  {:else if "vertical"}
    <line x1={0} y1={0} x2={0} y2={length} stroke="red" />
    {#each anchors as point, idx}
      <rect
        x={0}
        y={point - barWidth / 2}
        width={barLength}
        height={barWidth}
        fill="black"
        data-target={internalId}
        data-index={idx}
      />
    {/each}
  {/if}
</g>
