<script lang="ts">
  export let id: string = `box_${Math.random().toString(32).substring(2)}`;
  export let style: string = "";
</script>

<div class="text" {id} {style}>
  <slot />
</div>

<style>
  .text {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
  }
</style>
