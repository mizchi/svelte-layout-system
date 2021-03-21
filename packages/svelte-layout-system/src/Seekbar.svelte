<script lang="ts">
  import type { FlexChildren, FlexGrowValue, PixelValue } from "./types";
  import { createEventDispatcher } from "svelte";
  import {
    makeControllers,
    moveController,
    recalcControllersRange,
  } from "./lib/layout";
  import { minmax } from "./lib/utils";

  export let type: "horizontal" | "vertical" = "horizontal";
  export let length: number;

  const dispatch = createEventDispatcher<{
    seekend: Array<PixelValue | FlexGrowValue>;
  }>();
  export let children: FlexChildren;

  let controllers = makeControllers(children, length);
  let holding: {
    index: number;
    initialPageX: number;
    initialPageY: number;
    firstValue: number;
  } | null = null;

  const internalId = Math.random().toString(32).substring(2);
  const onMouseDownOnBar = (ev: any) => {
    const { index, target } = ev.target.dataset ?? {};
    if (target == internalId && index) {
      const anchor = controllers[index]!;
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
    const current = controllers[holding.index]!;
    const delta =
      type === "horizontal"
        ? ev.pageX - holding.initialPageX
        : ev.pageY - holding.initialPageY;

    const next = holding.firstValue + delta;
    const [start, end] = current.range;
    const nextInRange = minmax(start, next, end);
    // let nextInRange = next < start ? start : next;

    const newController = controllers.slice();
    newController[holding!.index]!.point = nextInRange;
    controllers = newController;
  };

  const onMouseUpOnBar = (ev: any) => {
    if (holding == null) return;

    const delta =
      type === "horizontal"
        ? ev.pageX - holding.initialPageX
        : ev.pageY - holding.initialPageY;

    const next = holding.firstValue + delta;
    const currentAnchor = controllers[holding.index]!;
    const [start, end] = currentAnchor.range;
    const nextInRange = minmax(start, next, end);
    const fixedDelta = nextInRange - holding.firstValue;

    const moved = moveController(children, length, holding.index, fixedDelta);
    children = moved;
    dispatch("seekend", moved);

    controllers = recalcControllersRange(controllers, length);
    holding = null;
    window.document.body.style.cursor = "auto";
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

    {#each controllers as controller, idx}
      {#if controller.type === "point" && controller.visible}
        <div
          class="point-controller"
          data-target={internalId}
          data-index={idx}
          data-point={controller.point}
          style={`
            position: absolute;
            z-index: 2;
            left: ${controller.point}px;
            background: ${color};
            user-select: none;
            border: 1px solid white;
            border-radius: 50%;
            transform: translate(${-barLength / 2}px, ${-barLength / 2}px);
            ${holding ? "" : "cursor: grab;"}
          `}
        >
          ↔
        </div>
      {:else if controller.type === "sized"}
        <div
          data-target={internalId}
          data-index={idx}
          style={`
            position: absolute;
            left: ${controller.point}px;
            top: ${-barLength / 2}px;
            width: ${controller.length}px;
            height: ${barLength}px;
            box-sizing: border-box;
            background: ${color};
            display: grid;
            justify-content: center;
            align-items: center;
            font-size: 4px;
            user-select: none;
            color: white;
            z-index: 1;
            ${holding ? "" : "cursor: grab;"}
          `}
        >
          {controller.fixed ? "" : "↔"}
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

    {#each controllers as controller, idx}
      {#if controller.type === "point" && controller.visible}
        <div
          class="point-controller"
          data-target={internalId}
          data-index={idx}
          data-point={controller.point}
          style={`
          position: absolute;
          transform: translate(${-barLength / 2}px, ${-barLength / 2}px);
          top: ${controller.point}px;
          background: ${color};
          ${holding ? "" : "cursor: grab;"}
        `}
        >
          ↕
        </div>
      {:else if controller.type === "sized"}
        <div
          data-target={internalId}
          data-length="{controller.length}px"
          data-index={idx}
          style={`
          position: absolute;
          top: ${controller.point}px;
          left: ${-barLength / 2}px;
          height: ${controller.length}px;
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

  .point-controller {
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
