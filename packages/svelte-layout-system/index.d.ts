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

export type FlexProps = {
  direction?: "row" | "column";
  width?: PixelValue | PercentValue | "auto";
  height?: PixelValue | PercentValue | "auto";
};

export class Flex extends SvelteComponentTyped<
  FlexProps,
  {
    change: { children: FlexChildren };
  },
  { default: {} }
> {}
export class EditableFlex extends SvelteComponentTyped<
  FlexProps,
  {
    change: { children: FlexChildren };
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

export class Seekbar extends SvelteComponentTyped<{}, {}, { default: {} }> {}
