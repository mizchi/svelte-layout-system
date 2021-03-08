import { componentFiles, preAmple } from "./components";

const cardCode = `<script lang="ts">
${preAmple}
export let heading: string = "heading";
export let detail: string = "detail";
export let buttonLink: string = "link";
export let buttonText: string = "text";

const onClick = (link: string) => {
  send("message_click", { link });
  window.open(link);
};
const onClose = () => {
  console.log("click");
  close();
};
</script>

<div class="container">
<div class="card">
  <Flex id="Flex-0">
    <button class="closeButton" on:click={onClose}>
      <svg
        class="icon-close"
        width="16"
        height="16"
        viewBox="0 0 352 512"
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
          class="svelte-ufn9vv svelte-ufn9vv" />
      </svg>
    </button>
    <Image src="https://i.imgur.com/nAnqC.jpg" alt="spacecat" height="98" id="img.0" />
    <Text align="center" height="40px" id="Text-0">{heading}</Text>
    <Text align="start" id="Text-1">{detail}</Text>
    <Button on:click={onClick} id="Button-0">
      {buttonText}
    </Button>
  </Flex>
</div>
</div>
<style>
.closeButton {
  background: white;
  border: 0;
  margin: 0;
  padding: 0;
}
.card {
  position: relative;
  height: 100%;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.05), 0 8px 14px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow-y: auto;
  background: #fff no-repeat 50%;
  background-size: cover;
  color: #333;
}

.closeButton {
  /* position */
  position: absolute;
  top: 7px;
  right: 7px;
  padding: 6px;
  border: solid 1px transparent;
  background: 0;
  color: #999;
  cursor: pointer;
  /* animation */
  transition: 0.25s;
}
.closeButton:hover,
.closeButton:focus {
  opacity: 0.75;
  transform: rotate(90deg);
}
</style>
`;
