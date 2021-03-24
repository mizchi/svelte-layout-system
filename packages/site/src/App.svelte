<script lang="ts">
  import Tailwind from "./Tailwind.svelte";
  import EditContext from "./EditContext.svelte";
  import SeekAppDemo from "./SeekAppDemo.svelte";
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
</script>

<Tailwind />
<!-- <Tabs>
  <Tab label="Tab label 1" />
  <Tab label="Tab label 2" />
  <Tab label="Tab label 3" />
  <div slot="content" style="display: relative;">
    <TabContent>
      <EditContext>
        <SeekAppDemo />
      </EditContext>
    </TabContent>
    <TabContent>Content 2</TabContent>
    <TabContent>Content 3</TabContent>
  </div>
</Tabs> -->
<EditContext>
  <SeekAppDemo />
</EditContext>
