import type {
  UnitSuffix,
  Unit,
  FlexGrowValue,
  PixelValue,
  PointController,
  SizedController,
  GridData,
  FlexData,
  FlexChildren,
  RemValue,
  PercentageValue,
  InputFlexChildren,
} from "../types";

function hasSuffix<Suffix extends UnitSuffix>(
  value: string,
  suffix: Suffix
): value is `${number}${Suffix}` {
  return new RegExp(`[0-9]${suffix}$`).test(value);
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

type CalculationEnv = {
  remSize: number;
  parentSize: number;
};

/* 
  Make values to internal values
 */
function toHandleableValue(
  value: FlexGrowValue | PixelValue | RemValue | PercentageValue,
  env: CalculationEnv
): InternalValue {
  if (hasSuffix(value, "rem")) {
    return {
      type: "static",
      size: toNum(value, "rem") * env.remSize,
    };
  } else if (hasSuffix(value, "%")) {
    return {
      type: "static",
      size: (toNum(value, "%") / 100) * env.parentSize,
    };
  } else if (hasSuffix(value, "px")) {
    return {
      type: "static",
      size: toNum(value, "px"),
    };
  } else {
    return {
      type: "ratio",
      ratio: toNum(value, ""),
    };
  }
}

function toInternalValue(value: FlexGrowValue | PixelValue): InternalValue {
  if (hasSuffix(value, "px")) {
    return {
      type: "static",
      size: toNum(value, "px"),
    };
  } else {
    return {
      type: "ratio",
      ratio: toNum(value, ""),
    };
  }
}

export function normalizeFlexValues(
  rawValues: InputFlexChildren,
  env: {
    remSize?: number;
    parentSize: number;
  }
): FlexChildren {
  // pixel or rate
  const values = rawValues.map((v) =>
    toHandleableValue(v, {
      parentSize: env.parentSize,
      remSize: env.remSize ?? 16,
    })
  );

  const calculatedValues = calcRealSizes(values, env.parentSize);
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
  children: FlexChildren,
  maxSize: number,
  index: keyof typeof children,
  delta: number
): FlexChildren {
  const values = children.map(toInternalValue);
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
  rawValues: FlexChildren,
  maxSize: number
): Array<PointController | SizedController> {
  const controllers: Array<PointController | SizedController> = [];

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

      controllers.push({
        type: "point",
        point: progress,
        index: i,
        visible: !leftIsStatic && !isStartPoint && !isEndPoint,
      });

      progress += size;
    } else if (cur.type === "static") {
      const isSizedFixed = i === 0 || i === values.length - 1;
      controllers.push({
        type: "sized",
        point: progress,
        length: cur.size,
        fixed: isSizedFixed,
        index: i,
      });
      progress += cur.size;
    }
  }
  return controllers;
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
    children: flexes,
  };
}

export function getGridAnchors(
  grid: GridData,
  w: number,
  h: number
): {
  columnAnchors: number[];
  rowsAnchors: number[];
} {
  const columnsPixels = exprsToPixels(grid.columns, w, "grid");
  const rowsPixels = exprsToPixels(grid.rows, h, "grid");
  return {
    columnAnchors: makeAnchors(columnsPixels),
    rowsAnchors: makeAnchors(rowsPixels),
  };
}

function makeAnchors(nums: number[]) {
  const anchors: number[] = [];
  let last = 0;
  nums.forEach((p, idx) => {
    if (nums.length - 1 === idx) return;
    anchors.push(last + p);
    last += p;
  });
  return anchors;
}

function exprsToPixels(
  exprs: string[],
  maxSize: number,
  type: "flex" | "grid"
): number[] {
  const pxSum = exprs
    .filter((n) => hasSuffix(n, "px"))
    .map((n) => toNum(n as PixelValue, "px"))
    .reduce((sum, i) => sum + i, 0);

  const frSum = exprs
    .filter((n) => {
      if (type === "grid") {
        return n.endsWith("fr");
      } else {
        return !(n.endsWith("fr") || n.endsWith("px"));
      }
    })
    .map(fractionToNumber)
    .reduce((sum, i) => sum + i, 0);

  const fractionSize = (maxSize - pxSum) / frSum;
  return exprs.map((n) => {
    if (n.includes("px")) {
      return pixelToNumber(n);
    } else {
      const fr = fractionToNumber(n);
      return fractionSize * fr;
    }
  });
}

export function pixelToNumber(expr: string | number): number {
  if (typeof expr === "number") {
    return expr;
  } else {
    return Number(expr.replace(/px$/, ""));
  }
}

export function fractionToNumber(expr: string | number): number {
  if (typeof expr === "number") {
    return expr;
  } else {
    return Number(expr.replace(/fr$/, ""));
  }
}
