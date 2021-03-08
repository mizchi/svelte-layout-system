<script context="module" lang="ts">
  import { writable } from "svelte/store";
  export const selectedNode = writable<null | ExtendedTemplateNode>(null);
</script>

<script lang="ts">
  import "./Tailwind.svelte";
  import ElementTree from "./elementTree/ElementTree.svelte";
  import type { ParsedSvelteAst } from "../lib/svelteHelpers";
  import {
    renderSvelteTemplate,
    parseSvelteTemplate,
  } from "../lib/svelteHelpers";
  import type { ExtendedTemplateNode } from "../nodes";
  import produce from "immer";
  import { onMount } from "svelte";
  import { bundleLocal } from "../lib/unirollApi";
  // import { sdk } from "../data/code";
  import sdk from "../data/files.json";
  import type { Ast } from "svelte/types/compiler/interfaces";
  import { editMode } from "./elementTree/ElementTree.svelte";

  let editingCode = sdk["/Main.svelte"];
  console.log("editing", editingCode);
  let parsed: ParsedSvelteAst = parseSvelteTemplate(editingCode);
  let rightPaneMode: "inspector" | "code" = "inspector";
  // todo: あとで実装する
  // let editMode: "property" | "layout" = "property";

  $: fragment = parsed.html.ast.html as ExtendedTemplateNode;

  let updateAst = (newAst: Ast["html"]) => {
    // debugger;
    // debugger;
    const newParsed = produce(parsed, (d) => {
      d.html.ast.html = newAst;
    });
    parsed = newParsed;
    editingCode = renderSvelteTemplate(newParsed);
    console.log("run preview debo");
    runPreviewDebounced(editingCode);
  };

  function onInputCode(ev: any) {
    const value = ev.target.value as string;
    editingCode = value;
    try {
      parsed = parseSvelteTemplate(editingCode);
    } catch (err) {
      console.warn(err);
    }
  }

  let timeoutId: any = null;

  function runPreviewDebounced(code: string) {
    console.log("run preview", timeoutId);
    timeoutId && clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
      await runPreview(code);
      timeoutId = null;
    }, 1000);
  }

  async function runPreview(code: string) {
    try {
      // debugger;
      const compiled = await bundleLocal({
        ...sdk,
        "/Main.svelte": code,
        "/index.tsx": `import Layout from "./Main.svelte";
          window.__run = (el: any) => new Layout({
            target: el
          });`,
      });
      console.log("build");
      // @ts-ignore
      window.__app?.$destroy?.();
      const encoded = btoa(unescape(encodeURIComponent(compiled)));
      await eval(`import("data:text/javascript;base64,${encoded}")`);
      const el = document.querySelector("#preview-root");
      // @ts-ignore
      window.__app = window.__run(el);
    } catch (err) {
      console.error(err);
    } finally {
      timeoutId = null;
    }
  }

  $: {
    runPreviewDebounced(editingCode);
  }

  onMount(() => {
    runPreview(editingCode);
  });

  // TODO: あとで移動
  let lastEl: null | Element = null;
  const onMove = (ev: MouseEvent) => {
    const parentBlock = (ev.target as HTMLElement).closest("[id]");
    if (parentBlock === lastEl) {
      return;
    }
    console.log(parentBlock?.id, parentBlock);
    lastEl = parentBlock;
  };
</script>

<svelte:window on:mousemove={onMove} />

<div class="flex w-full h-full">
  <div class="w-80 h-full">
    <div>
      <button on:click={() => editMode.set("prop")}>prop</button>
      |
      <button on:click={() => editMode.set("layout")}>layout</button>
      ( mode: {$editMode} )
    </div>
    <div class="w-full h-full">
      <ElementTree root={fragment} onUpdate={updateAst} />
    </div>
  </div>
  <div class="flex-1 h-full">
    <button
      class="bg-blue-400 text-white py-2 px-4 rounded"
      on:click={() => runPreview(editingCode)}>run</button
    >
    <div id="preview-root" />
  </div>
  <div class="w-96">
    <div>
      <button
        on:click={() => {
          rightPaneMode = "inspector";
        }}
      >
        inspector
      </button>
      |
      <button
        on:click={() => {
          rightPaneMode = "code";
        }}>code</button
      >
    </div>
    {#if rightPaneMode === "code"}
      <textarea
        class="h-full w-full resize rounded-md focus:border-none focus:outline-none"
        value={editingCode}
        on:input={onInputCode}
      />
    {:else if rightPaneMode === "inspector"}
      inspector
    {/if}
  </div>
</div>

<style>
  textarea:focus {
    outline: none;
    border: none;
  }
</style>
