type UnitSuffix = "px" | "em" | "rem" | "%" | "fr" | "";
type Unit<Suffix extends UnitSuffix> = `${number}${Suffix}`;

export type FlexGrowValue = Unit<"">;
export type PixelValue = Unit<"px">;
export type EmValue = Unit<"em">;
export type RemValue = Unit<"rem">;
export type PercentValue = Unit<"%">;
export type FractionValue = Unit<"fr">;

export type FlexData = {
  direction: "row" | "column";
  proportions: Array<FlexGrowValue | PixelValue>;
};

type PointAnchor = {
  type: "point";
  point: number;
  visible: boolean;
  index: number;
};

type SizedAnchor = {
  type: "sized";
  point: number;
  length: number;
  fixed: boolean;
  index: number;
};

function hasSuffix<Suffix extends UnitSuffix>(
  value: string,
  suffix: Suffix
): value is `${number}${Suffix}` {
  return new RegExp(`[0-9]${suffix}\$`).test(value);
}

function toNum<T extends UnitSuffix>(expr: Unit<T>, suffix: T): number {
  const raw = expr.replace(new RegExp(`${suffix}$`, ""), "");
  return Number(raw);
}

type InternalValue = ConstValue | RatioValue;
type ConstValue = {
  type: "static";
  size: number;
};

type RatioValue = {
  type: "ratio";
  ratio: number;
};

function toInternalValue(
  proportion: FlexGrowValue | PixelValue
): InternalValue {
  if (hasSuffix(proportion, "px")) {
    return {
      type: "static",
      size: toNum(proportion, "px"),
    };
  } else {
    return {
      type: "ratio",
      ratio: toNum(proportion, ""),
    };
  }
}

export function normalizeFlexValues(
  rawValues: Array<FlexGrowValue | PixelValue>,
  maxSize: number
): Array<FlexGrowValue | PixelValue> {
  const values = rawValues.map(toInternalValue);
  const calculatedValues = calcRealSizes(values, maxSize);
  return values.map((v, idx) => {
    if (v.type === "ratio") {
      const calculatedVar = calculatedValues[idx]!;
      return `${Math.floor(calculatedVar)}` as const;
    } else {
      return `${v.size}px` as const;
    }
  });
}

function calcRealSizes(values: Array<InternalValue>, maxSize: number) {
  let ratioSum = 0;
  let pixelSum = 0;
  for (const v of values) {
    if (v.type === "static") {
      pixelSum += v.size;
    } else {
      ratioSum += v.ratio;
    }
  }
  const restSize = maxSize - pixelSum;
  return values.map((v) => {
    if (v.type === "ratio") {
      return (restSize * v.ratio) / ratioSum;
    } else {
      return v.size;
    }
  });
}

export function moveController(
  rawValues: Array<FlexGrowValue | PixelValue>,
  maxSize: number,
  index: keyof typeof rawValues,
  delta: number
): Array<FlexGrowValue | PixelValue> {
  const values = rawValues.map(toInternalValue);
  const realValues = calcRealSizes(values, maxSize);
  const currentController = values[index] as InternalValue;

  let shifted: number[];
  if (currentController.type === "static") {
    shifted = values.map((_v, idx) => {
      const real = realValues[idx]!;
      if (idx + 1 === index) {
        return real + delta;
      } else if (idx - 1 === index) {
        return real - delta;
      } else {
        return real;
      }
    });
  } else {
    shifted = values.map((v, idx) => {
      const real = realValues[idx]!;
      if (v.type === "ratio") {
        if (idx === index) {
          // current move
          return real - delta;
        } else if (idx + 1 === index) {
          // prev move
          return real + delta;
        } else {
          return real;
        }
      }
      return real;
    });
  }
  return shifted.map((sv, i) => {
    if (values[i]?.type === "ratio") {
      return `${sv}` as const;
    } else {
      return `${sv}px` as PixelValue;
    }
  });
}

export function makeControllers(
  rawValues: Array<FlexGrowValue | PixelValue>,
  maxSize: number
): Array<PointAnchor | SizedAnchor> {
  const values = rawValues.map(toInternalValue);
  let ratioSum = 0;
  let pixelSum = 0;
  for (const v of values) {
    if (v.type === "static") {
      pixelSum += v.size;
    } else {
      ratioSum += v.ratio;
    }
  }

  let anchors: Array<PointAnchor | SizedAnchor> = [];

  const restSize = maxSize - pixelSum;

  let progress = 0;
  for (let i = 0; i < values.length; i++) {
    const cur = values[i]!;
    const prev = values[i - 1];
    if (cur.type === "ratio") {
      const size = (restSize * cur.ratio) / ratioSum;
      const leftIsStatic = prev == null || prev?.type === "static";
      const isStartPoint = size === 0 && progress === 0;
      const isEndPoint = size === 0 && progress >= progress + size;

      anchors.push({
        type: "point",
        point: progress,
        index: i,
        visible: !leftIsStatic && !isStartPoint && !isEndPoint,
      });

      progress += size;
    } else if (cur.type === "static") {
      const isSizedFixed = i === 0 || i === values.length - 1;
      anchors.push({
        type: "sized",
        point: progress,
        length: cur.size,
        fixed: isSizedFixed,
        index: i,
      });
      progress += cur.size;
    }
  }
  return anchors;
}

export function getFlexValuesFromChildren(target: HTMLElement): FlexData {
  const style = getComputedStyle(target);
  const flexDirection = style.flexDirection;
  const flexes: Array<PixelValue | FlexGrowValue> = [];

  for (const child of Array.from(target.children)) {
    const childStyle = getComputedStyle(child);
    const flexGrow = Number(childStyle.flexGrow);
    if (flexGrow > 0) {
      flexes.push(flexGrow.toString() as FlexGrowValue);
    } else {
      if (flexDirection === "row") {
        flexes.push(childStyle.width as PixelValue);
      } else {
        flexes.push(childStyle.height as PixelValue);
      }
    }
  }
  return {
    direction: flexDirection as "row" | "column",
    proportions: flexes,
  };
}
