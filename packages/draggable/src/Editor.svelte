<script lang="ts">
  import type monaco from "monaco-editor";
  import loader from "@monaco-editor/loader";
  import { onMount } from "svelte";

  export let value: string = "";

  let editorElement: HTMLElement;
  let editor: monaco.editor.IStandaloneCodeEditor;
  onMount(() => {
    let disposer: null | (() => void) = null;
    (async () => {
      const monaco = await loader.init();
      editor = monaco.editor.create(editorElement, {
        value,
        lineNumbers: "off",
        minimap: {
          enabled: false,
        },
      });
      editor.onDidChangeModelContent(() => {
        value = editor.getValue();
      });
      editor.layout();
      const obs = new ResizeObserver((entries) => {
        editor.layout();
      });
      obs.observe(editorElement);
      disposer = () => {
        editor.dispose();
        obs.disconnect();
      };
    })();
    return () => disposer?.();
  });
</script>

<div style="width:100%;height:100%" bind:this={editorElement} />
