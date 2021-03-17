<script lang="ts">
  export let style: string = "";
</script>

<div class="root" {style}>
  <slot />
</div>

<style>
  .root {
    width: 100%;
    height: 100%;
  }
</style>
