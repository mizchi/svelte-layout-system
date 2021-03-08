<script lang="ts">
  export let id: string;
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
