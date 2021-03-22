export type UnitSuffix = "px" | "em" | "rem" | "%" | "fr" | "vw" | "vh" | "";
export type Unit<Suffix extends UnitSuffix> = `${number}${Suffix}`;

export type FlexGrowValue = Unit<"">;
export type PixelValue = Unit<"px">;
export type ViewportWidthValue = Unit<"vw">;
export type ViewportHeightValue = Unit<"vh">;

export type EmValue = Unit<"em">;
export type RemValue = Unit<"rem">;
export type PercentageValue = Unit<"%">;
export type FractionValue = Unit<"fr">;

export type FlexChange = {
  target: HTMLElement;
  children: FlexChildren;
};

export type FlexProps = {
  direction?: "row" | "column";
  width?: PixelValue | PercentageValue | "auto";
  height?: PixelValue | PercentageValue | "auto";
};

export type FlexChildren = Array<
  FlexGrowValue | PixelValue
  // | RemValue | PercentValue
>;

export type InputFlexChildren = Array<
  FlexGrowValue | PixelValue | RemValue | PercentageValue
>;

export type GridData = {
  columns: string[];
  rows: string[];
  areas: string[][];
};

export type FlexData = {
  direction: "row" | "column";
  children: FlexChildren;
};

export type PointController = {
  type: "point";
  point: number;
  visible: boolean;
  index: number;
  range: [number, number];
};

export type SizedController = {
  type: "sized";
  point: number;
  length: number;
  fixed: boolean;
  index: number;
  range: [number, number];
};

export type FlexContextData = {
  direction: "row" | "column";
};
