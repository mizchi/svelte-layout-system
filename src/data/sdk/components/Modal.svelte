<script lang="ts">
  import { createEventDispatcher, onDestroy } from "svelte";

  export let width: string = "auto";
  export let height: string = "auto";
  // export let position: string = "center";
  export let opened: boolean;
  export let fog: boolean = false;
  export let zIndex: number = 1000;

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  let modal: HTMLElement | null = null;

  const handle_keydown = (e: any) => {
    if (e.key === "Escape") {
      close();
      return;
    }
    if (e.key === "Tab" && modal) {
      // trap focus
      const nodes = modal.querySelectorAll("*");
      const tabbable = Array.from(nodes).filter(
        // @ts-ignore
        (n: HTMLElement) => n.tabIndex >= 0
      ) as HTMLElement[];

      let index = tabbable.indexOf(document.activeElement as HTMLElement);
      if (index === -1 && e.shiftKey) index = 0;

      index += tabbable.length + (e.shiftKey ? -1 : 1);
      index %= tabbable.length;

      tabbable[index].focus();
      e.preventDefault();
    }
  };

  const previously_focused =
    typeof document !== "undefined" && (document.activeElement as HTMLElement);

  if (previously_focused) {
    onDestroy(() => {
      previously_focused?.focus();
    });
  }
</script>

<svelte:window on:keydown={handle_keydown} />

{#if opened}
  {#if fog}
    <div class="modal-background" on:click={close} />
  {/if}

  <div
    class="modal"
    role="dialog"
    aria-modal="true"
    bind:this={modal}
    style="
width:{width};
height:{height};
z-index:{zIndex};
"
  >
    <slot />
    <!-- svelte-ignore a11y-autofocus -->
    <button autofocus on:click={close}> close modal </button>
  </div>
{/if}

<style>
  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
  }
  .modal {
    position: absolute;
    left: 50%;
    top: 50%;
    /* width: calc(100vw - 4em); */
    max-width: 32em;
    max-height: calc(100vh - 4em);
    overflow: auto;
    transform: translate(-50%, -50%);
    padding: 1em;
    border-radius: 0.2em;
    background: white;
  }
  button {
    display: block;
  }
</style>
