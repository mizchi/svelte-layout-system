<script lang="ts">
  export let style: string = "";

  import { getEditContext } from "./EditContext.svelte";

  const { editMode } = getEditContext();

  export let text: string;

  let inputElement: null | HTMLInputElement = null;
  let editingValue = text;
  let onComposition = false;

  const onCompositionStart = () => (onComposition = true);
  const onCompositionEnd = () => (onComposition = false);

  $: showEdit = $editMode === "block";

  const onKeydown = (_ev: any) => {
    if (onComposition) return;
  };

  $: inputStyle = `width:${editingValue!.length * 0.6}em`;
</script>

<div class="text-block" {style}>
  {#if showEdit}
    <input
      bind:this={inputElement}
      bind:value={editingValue}
      on:keydown={onKeydown}
      on:compositionstart={onCompositionStart}
      on:compositionend={onCompositionEnd}
      style={inputStyle}
    />
  {:else}
    {editingValue}
  {/if}

  <!-- <slot /> -->
</div>

<style>
  .text-block {
    width: 100%;
    max-width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }
  input {
    background: #ded;
    outline: none;
    max-width: 100%;
    min-width: 1em;
    text-align: center;
  }
</style>
