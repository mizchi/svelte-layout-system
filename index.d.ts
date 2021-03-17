/* eslint-disable */
/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

import type {
  PixelValue,
  FlexGrowValue,
  PercentValue,
  FlexChildren,
} from "./src/types";

export * from "./src/types";

export class Flex extends SvelteComponentTyped<
  {
    direction?: "row" | "column";
    width?: PixelValue | PercentValue | "auto";
    height?: PixelValue | PercentValue | "auto";
  },
  {
    "change-flex": { children: FlexChildren };
  },
  { default: {} }
> {}

export class FlexItem extends SvelteComponentTyped<
  {
    length: PixelValue | FlexGrowValue;
  },
  {},
  { default: {} }
> {}

export class MultiSeek extends SvelteComponentTyped<{}, {}, { default: {} }> {}
