<script context="module" lang="ts">
  import { writable } from "svelte/store";
  export const selectedNode = writable<null>(null);
</script>

<script lang="ts">
  import "./Tailwind.svelte";
  import Root from "./Root.svelte";
</script>

<Root />
