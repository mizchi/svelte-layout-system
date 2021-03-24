<script lang="ts">
  import Tailwind from "./Tailwind.svelte";
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import Main from "./Main.svelte";
</script>

<Tailwind />

<div class="h-full w-full">
  <Tabs>
    <Tab label="Window System" />

    <div slot="content">
      <TabContent>
        <Main />
      </TabContent>
    </div>
  </Tabs>
</div>

<style global>
  body {
    width: 100vw;
    height: 100vh;
  }
</style>
