<script lang="ts">
  // export let flex: number = string;
  // export let src: string;
  // export let width: string = "auto";
  // export let height: string = "auto";
  export let round: boolean = false;
  export let id: string;
  // export let style: string = "";
  $: radius = round ? "50%" : "0";
</script>

<div {id} style="flex: " />
