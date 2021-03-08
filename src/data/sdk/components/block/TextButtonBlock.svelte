<script lang="ts">
  import { createEventDispatcher } from "svelte";
  export let id: string;
  export let style: string = "";

  const dispatch = createEventDispatcher();
</script>

<div {id} class="container" {style}>
  <button class="inner" on:click={() => dispatch("click")}>
    <slot />
  </button>
</div>

<style>
  .container {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    line-height: 1.66667;
    padding: 3px;
  }
  .inner {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    display: inline-block;
    border-radius: 4px;
    background-color: #333;
    color: #eee;
    text-decoration: none;
    text-align: center;
  }
  .inner:hover,
  .inner:focus {
    opacity: 0.75;
  }
</style>
