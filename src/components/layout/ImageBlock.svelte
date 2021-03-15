<script lang="ts">
  export let src: string;
  export let width: string = "auto";
  export let height: string = "auto";
  export let round: boolean = false;
  export let id: string;
  export let style: string = "";

  $: showEdit = $editMode === "block";
  import { getEditContext } from "./EditContext.svelte";
  const { editMode } = getEditContext();

  $: radius = round ? "50%" : "0";
</script>

<div {id} class="container" {style}>
  {#if showEdit}
    <div style="position: absolute;">
      <div
        style="width: 100%; height: 100%; display: grid; place-items: center;"
      >
        <input bind:value={src} />
      </div>
    </div>
  {/if}
  <img
    class="image"
    {src}
    alt="this is xxx"
    loading="lazy"
    {width}
    {height}
    style="border-radius: {radius}"
  />
</div>

<style>
  .container {
    display: flex;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    justify-content: center;
    align-items: center;
  }
  .image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
</style>
