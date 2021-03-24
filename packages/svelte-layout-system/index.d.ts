/* eslint-disable */
/// <reference types="svelte" />
import type { SvelteComponentTyped } from "svelte";

import type {
  PixelValue,
  FlexGrowValue,
  PercentValue,
  FlexChildren,
  FlexProps,
  FlexChange,
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
    change: FlexChange;
    seekend: FlexChange;
  },
  { default: {} }
> {}

export class EditableFlexItem extends SvelteComponentTyped<
  {
    length: PixelValue | FlexGrowValue;
  },
  {},
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
export class Editable extends SvelteComponentTyped<
  { editable?: boolean },
  {},
  { default: {} }
> {}
