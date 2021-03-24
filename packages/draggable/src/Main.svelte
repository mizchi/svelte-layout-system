<script lang="ts">
  import Window from "./Window.svelte";
  import Editor from "./Editor.svelte";
  import GraphqlEditor from "./GraphqlEditor.svelte";
  import type monaco from "monaco-editor";
  import loader from "@monaco-editor/loader";
  import { onMount } from "svelte";

  let editorElement: HTMLElement;
  let editor: monaco.editor.IStandaloneCodeEditor;

  type WindowData = {
    x: number;
    y: number;
    w: number;
    h: number;

    name: string;
    value: string;
    order: number;
    id: string;
  };
  let windowStack: WindowData[] = [
    {
      name: "a",
      value: "xxx",
      order: 0,
      id: "a",
      x: 0,
      y: 0,
      w: 100,
      h: 100,
    },
    {
      name: "b",
      value: "yyy",
      order: 0,
      id: "b",
      x: 300,
      y: 200,
      w: 200,
      h: 50,
    },
  ];
  onMount(async () => {
    const monaco = await loader.init();
    editor = monaco.editor.create(editorElement, {
      value: "test",
      lineNumbers: "off",
      minimap: {
        enabled: false,
      },
    });
    editor.layout();
  });

  function onDragStart(ev: CustomEvent<{ id: string }>) {
    const maxOrder = Math.max(...windowStack.map((w) => w.order));
    windowStack = windowStack.map((w) => {
      if (w.id === ev.detail.id) {
        return { ...w, order: maxOrder + 1 };
      } else {
        return w;
      }
    });
  }
</script>

<div class="root">
  {#each windowStack as win}
    <Window
      name={win.name}
      id={win.id}
      bind:x={win.x}
      bind:y={win.y}
      bind:w={win.w}
      bind:h={win.h}
      zIndex={win.order}
      on:dragstart={onDragStart}
    >
      <!-- <Editor value={win.value} /> -->
      <GraphqlEditor />
    </Window>
  {/each}
</div>

<style>
  .root {
    position: relative;
    width: 100vw;
    height: 100vh;
  }
</style>
