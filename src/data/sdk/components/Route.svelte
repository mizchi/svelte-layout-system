<script lang="ts">
  import { getRouterContext } from "./Router.svelte";
  export let path: string;
  const { currentPath } = getRouterContext();
</script>

{#if $currentPath === path}
  <slot />
{/if}
