<script lang="ts">
  export let style: string = "";
  export let direction: "column" | "row" = "row";
  export let display: "inline-flex" | "flex" = "flex";
  export let width: string = "100%";
  export let height: string = "auto";
  export let flex: string = "0 1 auto";

  // export let maxWidth: string = '100%';

  const id = `box_${Math.random().toString(32).substring(2)}`;
</script>

<div
  {id}
  style={`display:${display};
flex-direction: ${direction};
width: ${width};
height: ${height};
flex: ${flex};
${style}
`}
>
  <slot />
</div>
