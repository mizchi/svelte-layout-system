<script lang="ts" context="module">
  import type { Writable } from "svelte/store";
  import { setContext, getContext } from "svelte";
  import { writable } from "svelte/store";

  type EditMode = "preview" | "block" | "layout";
  export type EditContext = {
    editMode: Writable<EditMode>;
    editLayers: Array<{
      type: "flex";
      direction: "row" | "column";
      proportions: Array<number>;
      x: number;
      y: number;
      width: number;
      height: number;
    }>;
  };
  const token = "edit-context";

  export function getEditContext(): EditContext {
    return getContext(token);
  }
</script>

<script lang="ts">
  const editMode: Writable<"block" | "layout"> = writable("block");
  setContext<EditContext>(token, {
    editMode,
    editLayers: [],
  });
</script>

<slot />
