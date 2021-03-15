<script lang="ts">
  import type { FlexData, FlexGrowValue, PixelValue } from "../lib/gridApi";
  import Flex from "./layout/Flex.svelte";
  import FlexItem from "./layout/FlexItem.svelte";
  import TextBlock from "./layout/TextBlock.svelte";
  import ImageBlock from "./layout/ImageBlock.svelte";

  import { getEditContext } from "./layout/EditContext.svelte";

  let flexChildren1: any[] = ["1", "100px", "1", "1"];
  let flexChildren2: any[] = ["1", "150px", "2"];
  let flexChildren3: any[] = ["50px", "2", "1", "70px", "1", "3", "120px"];

  let onChangeFlex1 = (ev: CustomEvent<FlexData>) => {
    flexChildren1 = ev.detail.proportions;
  };

  const onChangeFlex2 = (ev: CustomEvent<FlexData>) => {
    flexChildren2 = ev.detail.proportions;
  };

  const onChangeFlex3 = (ev: CustomEvent<FlexData>) => {
    flexChildren3 = ev.detail.proportions;
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

<div class="h-full w-full">
  <div class="p-4">
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
  <div class="p-4">
    <Flex
      width="800px"
      height="400px"
      direction="column"
      zIndex={10}
      on:change-flex={onChangeFlex1}
    >
      <FlexItem size={flexChildren1[0]}>
        <TextBlock text="header" />
      </FlexItem>
      <FlexItem size={flexChildren1[1]}>
        <Flex on:change-flex={onChangeFlex2} zIndex={3}>
          <FlexItem size={flexChildren2[0]}>
            <!-- <TextBlock text="left" /> -->
            <ImageBlock src="https://i.imgur.com/nAnqC.jpg" id="xxx" />
          </FlexItem>
          <FlexItem size={flexChildren2[1]}>
            <TextBlock text="center" />
          </FlexItem>
          <FlexItem size={flexChildren2[2]}>
            <TextBlock text="right" />
          </FlexItem>
        </Flex>
      </FlexItem>
      <FlexItem size={flexChildren1[2]}>
        <!-- <TextBlock text="footer" /> -->
        <ImageBlock src="https://i.imgur.com/nAnqC.jpg" id="xxx" />
      </FlexItem>
      <FlexItem size={flexChildren1[3]}>
        <Flex on:change-flex={onChangeFlex3}>
          {#each flexChildren3 as c, idx}
            {#if c.endsWith(c, "px")}
              <FlexItem size={c}>
                <TextBlock text={idx.toString()} />
              </FlexItem>
            {:else}
              <FlexItem size={c}>
                <TextBlock text={idx.toString()} />
              </FlexItem>
            {/if}
          {/each}
        </Flex>
      </FlexItem>
    </Flex>
  </div>
</div>
