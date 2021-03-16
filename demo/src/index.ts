// @ts-ignore
import App from "./App.svelte";

let app: any;
async function main() {
  app = new App({ target: document.body });
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
