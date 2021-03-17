# svelte-layout-system

```
npm install svelte-layout-system --save
```

## Example

```
<script lang="ts">
  import type { FlexChildren } from "svelte-layout-system";
  import { Flex, FlexItem } from "svelte-layout-system";

  let values: FlexChlidren = ["1", "100px", "1", "1"];

  const onChangeFlex: any = (ev: CustomEvent<FlexChildren>) => {
    children = ev.detail;
  };
</script>

<Flex
  width="800px"
  height="400px"
  direction="column"
  on:change-flex="{onChangeFlex}"
>
  {#each values of v}
    <FlexItem length="{v}"> xxx </FlexItem>
  {/each}
</Flex>
```

## LICENSE

MIT
