<script lang="ts">
  import type { FlexChildren, FlexGrowValue, PixelValue } from "./types";
  import { createEventDispatcher } from "svelte";
  import { makeControllers, moveController } from "./lib/layout";

  export let type: "horizontal" | "vertical" = "horizontal";
  export let length: number;

  const dispatch = createEventDispatcher<{
    seekend: Array<PixelValue | FlexGrowValue>;
  }>();
  export let values: FlexChildren;

  let anchors = makeControllers(values, length);
  let holding: {
    index: number;
    initialPageX: number;
    initialPageY: number;
    firstValue: number;
  } | null = null;

  const internalId = Math.random().toString(32).substring(2);

  const onMouseUpOnBar = (ev: any) => {
    if (holding == null) return;

    const delta =
      type === "horizontal"
        ? ev.pageX - holding.initialPageX
        : ev.pageY - holding.initialPageY;

    const moved = moveController(values, length, holding.index, delta);
    values = moved;
    dispatch("seekend", moved);
    holding = null;
    window.document.body.style.cursor = "auto";
  };

  const onMouseDownOnBar = (ev: any) => {
    const { index, target } = ev.target.dataset ?? {};
    if (target == internalId && index) {
      const anchor = anchors[index]!;
      if (anchor.type === "sized" && anchor.fixed) {
        return;
      }
      holding = {
        initialPageX: ev.pageX as number,
        initialPageY: ev.pageY as number,
        index: Number(index),
        firstValue: anchor.point,
      };
      window.document.body.style.cursor = "grabbing";
    }
  };

  const onMouseMoveOnBar = (ev: any) => {
    if (holding == null) return;
    const currentAnchor = anchors[holding.index]!;
    const delta =
      type === "horizontal"
        ? ev.pageX - holding.initialPageX
        : ev.pageY - holding.initialPageY;

    const nx = holding.firstValue + delta;
    const newAnchors = anchors.slice();
    if (currentAnchor!.type === "point") {
      newAnchors[holding!.index]!.point = nx;
    } else if (currentAnchor.type === "sized") {
      newAnchors[holding!.index]!.point = nx;
    }
    anchors = newAnchors;
  };
  const color = `rgb(${~~(Math.random() * 128)}, ${~~(
    Math.random() * 128
  )}, ${~~(Math.random() * 128)})`;
  // const color = `#333`;
  const barLength = 18;
</script>

<svelte:window
  on:mousemove={onMouseMoveOnBar}
  on:mouseup={onMouseUpOnBar}
  on:mousedown={onMouseDownOnBar}
/>
<div
  style={`
  position: absolute;
`}
>
  {#if type == "horizontal"}
    <!-- line -->
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

    {#each anchors as anchor, idx}
      {#if anchor.type === "point" && anchor.visible}
        <div
          class="point-anchor"
          data-target={internalId}
          data-index={idx}
          data-point={anchor.point}
          style={`
            position: absolute;
            left: ${anchor.point}px;
            background: ${color};
            user-select: none;
            transform: translate(${-barLength / 2}px, ${-barLength / 2}px);
            ${holding ? "" : "cursor: grab;"}
          `}
        />
      {:else if anchor.type === "sized"}
        <div
          data-target={internalId}
          data-index={idx}
          style={`
            position: absolute;
            left: ${anchor.point}px;
            top: ${-barLength / 2}px;
            width: ${anchor.length}px;
            height: ${barLength}px;
            box-sizing: border-box;
            background: ${color};
            display: grid;
            justify-content: center;
            align-items: center;
            font-size: 4px;
            user-select: none;
            color: white;
            ${holding ? "" : "cursor: grab;"}
          `}
        >
          {anchor.fixed ? "" : "↔"}
        </div>
      {/if}
    {/each}
  {/if}

  {#if type == "vertical"}
    <!-- line -->
    <div
      style={`
    position: absolute;
    left: -1px;
    top: 0px;
    width: 2px;
    height: ${length}px;
    border: 2px solid ${color};
  `}
    />

    {#each anchors as anchor, idx}
      {#if anchor.type === "point" && anchor.visible}
        <div
          class="point-anchor"
          data-target={internalId}
          data-index={idx}
          data-point={anchor.point}
          style={`
          position: absolute;
          transform: translate(${-barLength / 2}px, ${-barLength / 2}px);
          top: ${anchor.point}px;
          background: ${color};
          ${holding ? "" : "cursor: grab;"}
        `}
        >
          ↕
        </div>
      {:else if anchor.type === "sized"}
        <div
          data-target={internalId}
          data-length="{anchor.length}px"
          data-index={idx}
          style={`
          position: absolute;
          top: ${anchor.point}px;
          left: ${-barLength / 2}px;
          height: ${anchor.length}px;
          width: ${barLength}px;
          box-sizing: border-box;
          background: ${color};
          display: grid;
          justify-content: center;
          align-items: center;
          font-size: 4px;
          user-select: none;
          color: white;
          ${holding ? "" : "cursor: grab;"}
        `}
        />
      {/if}
    {/each}
  {/if}
</div>

<style>
  :root {
    --barLength: 18px;
  }

  .point-anchor {
    display: grid;
    justify-content: center;
    align-items: center;
    font-size: 4px;
    color: white;
    user-select: none;
    width: var(--barLength);
    height: var(--barLength);
    border-radius: calc(var(--barLength) / 2);
  }
</style>
