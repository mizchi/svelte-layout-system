<script lang="ts">
  import type { FlexChildren } from "../..";
  import { Flex, FlexItem } from "../..";

  import { getEditContext } from "./EditContext.svelte";
  import TextBlock from "./TextBlock.svelte";
  import ImageBlock from "./ImageBlock.svelte";

  let flexChildren1: any[] = ["1", "100px", "1", "1"] as FlexChildren;
  let flexChildren2: any[] = ["1", "150px", "2"] as FlexChildren;
  let flexChildren3 = [
    "50px",
    "2",
    "1",
    "70px",
    "1",
    "3",
    "120px",
  ] as FlexChildren;

  let onChangeFlex1: any = (ev: CustomEvent<FlexChildren>) => {
    flexChildren1 = ev.detail;
  };

  const onChangeFlex2: any = (ev: CustomEvent<FlexChildren>) => {
    flexChildren2 = ev.detail;
  };

  const onChangeFlex3: any = (ev: CustomEvent<FlexChildren>) => {
    flexChildren3 = ev.detail;
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
      on:change-flex={onChangeFlex1}
    >
      <FlexItem length={flexChildren1[0]}>
        <TextBlock text="header" />
      </FlexItem>
      <FlexItem length={flexChildren1[1]}>
        <Flex on:change-flex={onChangeFlex2}>
          <FlexItem length={flexChildren2[0]}>
            <ImageBlock src="https://i.imgur.com/nAnqC.jpg" id="xxx" />
          </FlexItem>
          <FlexItem length={flexChildren2[1]}>
            <TextBlock text="center" />
          </FlexItem>
          <FlexItem length={flexChildren2[2]}>
            <TextBlock text="right" />
          </FlexItem>
        </Flex>
      </FlexItem>
      <FlexItem length={flexChildren1[2]}>
        <ImageBlock src="https://i.imgur.com/nAnqC.jpg" id="xxx" />
      </FlexItem>
      <FlexItem length={flexChildren1[3]}>
        <Flex on:change-flex={onChangeFlex3}>
          {#each flexChildren3 as c, idx}
            {#if c.endsWith("px")}
              <FlexItem length={c}>
                <TextBlock text={idx.toString()} />
              </FlexItem>
            {:else}
              <FlexItem length={c}>
                <TextBlock text={idx.toString()} />
              </FlexItem>
            {/if}
          {/each}
        </Flex>
      </FlexItem>
    </Flex>
  </div>
</div>
