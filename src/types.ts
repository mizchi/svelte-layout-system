export type UnitSuffix = "px" | "em" | "rem" | "%" | "fr" | "";
export type Unit<Suffix extends UnitSuffix> = `${number}${Suffix}`;

export type FlexGrowValue = Unit<"">;
export type PixelValue = Unit<"px">;
export type EmValue = Unit<"em">;
export type RemValue = Unit<"rem">;
export type PercentValue = Unit<"%">;
export type FractionValue = Unit<"fr">;

export type FlexChildren = Array<
  FlexGrowValue | PixelValue
  // | RemValue | PercentValue
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
};

export type SizedController = {
  type: "sized";
  point: number;
  length: number;
  fixed: boolean;
  index: number;
};
