import type { Writable } from "svelte/store";
import { getContext } from "svelte";
import { writable } from "svelte/store";

export type RouterContext = {
  __symbol: string;
  currentPath: Writable<string>;
  push(path: string): void;
};

const SYMBOL = "router:" + Math.random().toString(16);
export const getRouterContext = () => getContext<RouterContext>(SYMBOL);
export const initMemoryRouter = (initialPath: string = "/") => {
  const currentPath = writable(initialPath);
  const ctx: RouterContext = {
    __symbol: SYMBOL,
    currentPath,
    push(path: string) {
      currentPath.set(path);
    },
  };
  return ctx;
};
