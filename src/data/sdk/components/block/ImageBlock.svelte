<script lang="ts">
  export let src: string;
  export let width: string = "auto";
  export let height: string = "auto";
  export let round: boolean = false;
  export let id: string;
  export let style: string = "";

  $: radius = round ? "50%" : "0";
</script>

<div {id} class="container" {style}>
  <div class="wrapper" style="width: {width}; height: {height};">
    <img
      class="g"
      {src}
      alt="image"
      loading="lazy"
      {width}
      {height}
      style="border-radius: {radius}"
    />
  </div>
</div>

<style>
  .container {
    width: 100%;
    height: 100%;
  }
  .wrapper {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
