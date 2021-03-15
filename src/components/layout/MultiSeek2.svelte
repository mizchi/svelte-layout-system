<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import produce from "immer";
  import type { FlexGrowValue, PixelValue } from "../../lib/layout";
  import {
    makeControllers,
    moveController,
    normalizeFlexValues,
  } from "../../lib/layout";

  export let type: "horizontal" | "vertical" = "horizontal";
  export let x: number;
  export let y: number;

  let length: number = 800;

  const barLength = 18;

  const dispatch = createEventDispatcher();

  let values: Array<FlexGrowValue | PixelValue> = normalizeFlexValues(
    ["1", "1", "1", "100px", "1", "1", "100px"],
    length
  );
  // let values: Array<FlexGrowValue | PixelValue> = normalizeFlexValues(
  //   ["1", "1", "1"],
  //   length
  // );

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
    const delta = ev.pageX - holding.initialPageX;
    const moved = moveController(values, length, holding.index, delta);
    console.log("moved", moved, "index", holding.index, "delta", delta);
    values = moved;
    // dispatch("seekend", moved);
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
    const delta = ev.pageX - holding.initialPageX;
    const nx = holding.firstValue + delta;
    anchors = produce(anchors, (draftAnchors) => {
      if (currentAnchor!.type === "point") {
        draftAnchors[holding!.index]!.point = nx;
      } else if (currentAnchor.type === "sized") {
        draftAnchors[holding!.index]!.point = nx;
      }
    });
  };
  // const color = `rgb(${~~(Math.random() * 255)}, ${~~(
  //   Math.random() * 255
  // )}, ${~~(Math.random() * 255)})`;
  const color = `#333`;
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
    <!-- left -->
    <div
      style={`
        position: absolute;
        left: 0px;
        top: -12px;
        width: 4px;
        height: 24px;
        background: ${color};
      `}
    />

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
          data-target={internalId}
          data-index={idx}
          style={`
            position: absolute;
            left: ${anchor.point - barLength / 2}px;
            top: ${-barLength / 2}px;
            width: ${barLength}px;
            height: ${barLength}px;
            background: ${color};
            border-radius: ${barLength / 2}px;
            display: grid;
            justify-content: center;
            align-items: center;
            font-size: 4px;
            color: white;
            user-select: none;
            ${holding ? "" : "cursor: grab;"}
          `}
        >
          {idx}
        </div>
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
            border: ${1}px solid gray;
            background: ${anchor.fixed ? "#ccc" : color};
            display: grid;
            justify-content: center;
            align-items: center;
            font-size: 4px;
            user-select: none;
            color: white;
            ${holding ? "" : "cursor: grab;"}
          `}
        >
          {anchor.length}px
        </div>
      {/if}
    {/each}

    <!-- right -->
    <div
      style={`
        position: absolute;
        left: ${length - 4}px;
        top: -12px;
        width: 4px;
        height: 24px;
        background: ${color};
      `}
    />
  {/if}
</div>

<hr />

<div style="width: {length}px; display: flex; margin-left: -10px;">
  {#each values as prop}
    {#if prop.endsWith("px")}
      <div style="width: {prop}; border: 1px dashed black;">
        {~~prop}px
      </div>
    {:else}
      <div style="flex-grow: {prop}; border: 1px dashed black">
        {~~prop}
      </div>
    {/if}
  {/each}
</div>
