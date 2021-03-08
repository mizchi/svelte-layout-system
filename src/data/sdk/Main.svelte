<script lang="ts">
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import {
    Router,
    Route,
    Modal,
    Flex,
    ParagraphBlock,
    TextButtonBlock,
    ImageBlock,
    initMemoryRouter,
  } from "./components/index";
  const router = initMemoryRouter("/");
  let opened = true;
  let close = () => {
    opened = false;
  };
  onMount(() => {});
</script>

<Router {router}>
  <Route path="/">
    <Modal {opened} on:close={close} fog={false}>
      <Flex direction="column" width="300px" height="300px">
        <Flex height="32px">
          <TextButtonBlock id="top-left" on:click={() => router.push("/")}
            >Here</TextButtonBlock
          >
          <TextButtonBlock id="top-right" on:click={() => router.push("/about")}
            >About</TextButtonBlock
          >
        </Flex>
        <Flex flex="1" height="150px">
          <ImageBlock
            id="image"
            height="150px"
            src="https://i.imgur.com/nAnqC.jpg"
          />
        </Flex>
        <Flex flex="1">
          <Flex flex="1">
            <ParagraphBlock id="left">XXX</ParagraphBlock>
          </Flex>
          <Flex flex="1">
            <ParagraphBlock id="right">YYY</ParagraphBlock>
          </Flex>
        </Flex>
        <Flex style="height: 50px; background: #ccc">
          <TextButtonBlock id="bottom-button">WIP</TextButtonBlock>
        </Flex>
      </Flex>
    </Modal>
  </Route>
  <Route path="/about">
    <Modal {opened} on:close={close} fog={true}>
      <div transition:fade>
        <Flex direction="column" width="300px" height="300px">
          <Flex flex="1">
            <TextButtonBlock id="top-left" on:click={() => router.push("/")}>
              Back
            </TextButtonBlock>
          </Flex>
        </Flex>
      </div>
    </Modal>
  </Route>
</Router>
