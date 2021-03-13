<script lang="ts">
  import type { FlexData, FlexGrowValue, PixelValue } from "../lib/gridApi";
  import GridSeekExample from "./GridSeekExample.svelte";
  import FlexSeekExample from "./FlexSeekExample.svelte";
  import Flex from "./layout/Flex.svelte";
  import FlexItem from "./layout/FlexItem.svelte";
  import Block from "./layout/Block.svelte";
  import TextBlock from "./layout/TextBlock.svelte";
  import { getEditContext } from "./layout/EditContext.svelte";

  // const proportions = ["1fr", "100px", "2fr"];
  let flexProportions: any = [1, 2, 1];
  let flexProportions2: any = [1, 2];

  const onChangeFlex = (ev: CustomEvent<FlexData>) => {
    console.log("top", ev);
    flexProportions = ev.detail.proportions;
  };

  const onChangeFlex2 = (ev: CustomEvent<FlexData>) => {
    flexProportions2 = ev.detail.proportions;
  };

  const { editMode } = getEditContext();

  const onClickPreview = () => {
    editMode.set("preview");
  };

  const onClickBlock = () => {
    editMode.set("block");
  };
  const onClickLayout = () => {
    editMode.set("layout");
  };
</script>

<div class="h-full w-full p-4">
  <div>
    {#if $editMode === "preview"}
      <button>[preview]</button>
    {:else}
      <button on:click={onClickPreview}>preview</button>
    {/if}
    |
    {#if $editMode === "block"}
      <button>[block]</button>
    {:else}
      <button on:click={onClickBlock}>block</button>
    {/if}
    |
    {#if $editMode === "layout"}
      <button>[layout]</button>
    {:else}
      <button on:click={onClickLayout}>layout</button>
    {/if}
  </div>
  <Flex
    width="600px"
    height="400px"
    direction="column"
    on:change-flex={onChangeFlex}
  >
    <FlexItem grow={flexProportions[0]}>
      <TextBlock text="helll" />
    </FlexItem>
    <FlexItem grow={flexProportions[1]}>
      <Flex on:change-flex={onChangeFlex2}>
        <FlexItem grow={flexProportions2[0]}>
          <TextBlock text="left" />
        </FlexItem>
        <FlexItem grow={flexProportions2[1]}>
          <TextBlock text="right" />
        </FlexItem>
      </Flex>
    </FlexItem>
    <FlexItem grow={flexProportions[2]}>
      <TextBlock text="footer" />
    </FlexItem>
  </Flex>

  <!-- <GridSeekExample />
  <FlexSeekExample /> -->
</div>
