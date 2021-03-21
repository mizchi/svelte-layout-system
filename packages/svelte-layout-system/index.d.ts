/* eslint-disable */
/// <reference types="svelte" />
import type { SvelteComponentTyped } from "svelte";

import type {
  PixelValue,
  FlexGrowValue,
  PercentValue,
  FlexChildren,
  FlexProps,
} from "./src/types";

export * from "./src/types";

export class Flex extends SvelteComponentTyped<
  FlexProps,
  {},
  { default: {} }
> {}
export class EditableFlex extends SvelteComponentTyped<
  FlexProps,
  {
    change: { target: HTMLElement; children: FlexChildren };
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
export class Editable extends SvelteComponentTyped<{}, {}, { default: {} }> {}
