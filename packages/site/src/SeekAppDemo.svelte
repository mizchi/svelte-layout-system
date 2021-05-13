<script lang="ts">
  import type { FlexChildren, FlexChange } from "svelte-layout-system";
  import {
    Flex as RawFlex,
    EditableFlexItem as FlexItem,
    EditableFlex,
  } from "svelte-layout-system";
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

  let onChangeFlex1: any = (ev: CustomEvent<FlexChange>) => {
    flexChildren1 = ev.detail.children;
  };

  const onChangeFlex2: any = (ev: CustomEvent<FlexChange>) => {
    flexChildren2 = ev.detail.children;
  };

  const onChangeFlex3: any = (ev: CustomEvent<FlexChange>) => {
    flexChildren3 = ev.detail.children;
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

  $: Flex = $editMode === "layout" ? EditableFlex : RawFlex;
  // $: Flex = RawFlex;
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
    <svelte:component
      this={Flex}
      width="400px"
      height="400px"
      direction="column"
      id="root"
      on:change={onChangeFlex1}
    >
      <FlexItem length={flexChildren1[0]}>
        <TextBlock text="header" />
      </FlexItem>
      <FlexItem length={flexChildren1[1]}>
        <svelte:component this={Flex} on:change={onChangeFlex2}>
          <FlexItem length={flexChildren2[0]}>
            <ImageBlock src="https://i.imgur.com/nAnqC.jpg" id="xxx" />
          </FlexItem>
          <FlexItem length={flexChildren2[1]}>
            <TextBlock text="center" />
          </FlexItem>
          <FlexItem length={flexChildren2[2]}>
            <TextBlock text="right" />
          </FlexItem>
        </svelte:component>
      </FlexItem>
      <FlexItem length={flexChildren1[2]}>
        <ImageBlock src="https://i.imgur.com/nAnqC.jpg" id="xxx" />
      </FlexItem>
      <FlexItem length={flexChildren1[3]}>
        <svelte:component this={Flex} on:change={onChangeFlex3}>
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
        </svelte:component>
      </FlexItem>
    </svelte:component>
  </div>
</div>
