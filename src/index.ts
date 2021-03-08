import SeekApp from "./components/SeekApp.svelte";
// import SeekApp from "./components/App.svelte";

let app: any;
async function main() {
  app = new SeekApp({ target: document.body });
}

main().catch(console.error);

// @ts-ignore
if (import.meta.hot) {
  // @ts-ignore
  import.meta.hot.accept();
  // @ts-ignore
  import.meta.hot.dispose(() => {
    app?.$destroy();
  });
}
