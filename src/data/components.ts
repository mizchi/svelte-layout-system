const FlexBlock = `<script lang="ts">
  export let id: string;
  export let width: string = "100%";
  export let height: string = "100%";
  export let bg: string = "transparent";
</script>
<div {id} class="g" style="width:{width};height:{height}">
  <slot />
</div>
<style>
.g {
  display: flex;
  flex-direction:column;
}
</style>
`;

const GridBlock = `<script lang="ts">
  export let id: string;
  export let width: string = "100%";
  export let height: string = "100%";
  export let bg: string = "transparent";
  export let template: string;
  export let areas: string;
</script>
<div {id} class="g" style="grid-template:{template};grid-template-areas:{areas};width:{width};height:{height};background: {bg};">
  <slot />
</div>
<style>
.g {
  display: grid;
}
</style>
`;

const GridItem = `<script lang="ts">
  export let id: string;
  export let gridArea: string;
  export let width: string = "100%";
  export let height: string = "100%";
  export let bg: string = "transparent";
  export let display: string = "grid";
</script>
<div {id} style="grid-area:{gridArea}; width: {width}; height: {height}; background: {bg}; display: {display}; place-items: center;">
  <slot />
</div>
<style></style>
`;

const ButtonBlock = `<script lang="ts">
import { createEventDispatcher } from 'svelte';
export let id: string;

const dispatch = createEventDispatcher();
</script>
<div {id} class="container">
  <button
    class="link"
    on:click={() => dispatch("click")}
  >
    <slot />
  </button>
</div>

<style>
.container {
  text-align: left;
  font-size: 12px;
  line-height: 1.66667;
}
.link {
  box-sizing: border-box;
  display: inline-block;
  border-radius: 4px;
  padding: 13px 16px;
  background-color: #333;
  color: #eee;
  text-decoration: none;
  text-align: center;
  width: 100%;
  transition: 0.2s;
}
.link:hover,
.link:focus {
  opacity: 0.75;
}
</style>
`;

const TextBlock = `<script lang="ts">
export let id: string;
export let align: string = "center";
export let width: string = "100%";
export let height: string = "100%";
</script>
<div {id} class="g" style="text-align: {align}; width: {width}; height: {height}">
  <div class="inner" style="width: {width};">
    <slot />
  </div>
</div>
<style>
.g {
  justify-content: center;
  width: 100%;
  display: flex;
  font-family: mono;
}

</style>
`;

const ImageBlock = `<script lang="ts">
  export let id: string;
  export let src: string;
  export let width: string = "auto";
  export let height: string = "auto";
  export let round: boolean = false;
  $: radius = round ? "50%" : "0"
</script>
<div {id} class="container" style="height: {height}; width: {width};">
  <img class="g"
    {src}
    loading="lazy"
    width={width}
    height={height}
    style="border-radius: {radius}"
  />
</div>

<style>
.container {
  margin: 0 auto;
  text-align: center;
}
</style>
`;

export const componentFiles = {
  "/components/Flex.svelte": FlexBlock,
  "/components/Grid.svelte": GridBlock,
  "/components/GridItem.svelte": GridItem,
  "/components/Button.svelte": ButtonBlock,
  "/components/Text.svelte": TextBlock,
  "/components/Image.svelte": ImageBlock,
};

export const preAmple = `
import { SvelteComponent } from "svelte";
import Grid from "./components/Grid.svelte";
import GridItem from "./components/GridItem.svelte";
import Button from "./components/Button.svelte";
import Image from "./components/Image.svelte";
import Text from "./components/Text.svelte";
import Flex from "./components/Flex.svelte";
`;
