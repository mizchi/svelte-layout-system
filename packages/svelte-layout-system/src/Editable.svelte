<script lang="ts" context="module">
  import { getContext, setContext } from "svelte";
  const MARKER = "svelte-layout-system:editable";
  export function isEditable() {
    return !!getContext<boolean>(MARKER);
  }
</script>

<script lang="ts">
  setContext(MARKER, true);
</script>

<slot />
