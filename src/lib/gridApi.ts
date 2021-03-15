type UnitSuffix = "px" | "em" | "rem" | "%" | "fr" | "";
type Unit<Suffix extends UnitSuffix> = `${number}${Suffix}`;
export type FlexGrowValue = Unit<"">;
export type PixelValue = Unit<"px">;
export type EmValue = Unit<"em">;
export type RemValue = Unit<"rem">;
export type PercentValue = Unit<"%">;
export type FractionValue = Unit<"fr">;

type ConstantValue = PixelValue | EmValue | RemValue;
type ProportionConstantValue = ConstantValue | PercentValue;
export type ProportiolValue = FlexGrowValue | FractionValue;

export type FlexProportionExpr = Array<FlexGrowValue | ProportionConstantValue>;
export type GridProportionExpr = Array<FractionValue | ProportionConstantValue>;

export type ProportionExpr = Array<ProportiolValue | ProportionConstantValue>;

export type FlexData = {
  direction: "row" | "column";
  proportions: Array<FlexGrowValue | PixelValue>;
};

export type GridData = {
  fixedColumns?: (string | boolean)[];
  fixedRows?: (string | boolean)[];
  columns: string[];
  rows: string[];
  areas: string[][];
};

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
export function getGridAnchors(grid: GridData, w: number, h: number) {
  const columnsPixels = exprsToPixels(grid.columns, w, "grid");
  const rowsPixels = exprsToPixels(grid.rows, h, "grid");
  return {
    columnAnchors: makeAnchors(columnsPixels),
    rowsAnchors: makeAnchors(rowsPixels),
  };
}

export function getFlexAnchors(flex: FlexData, length: number) {
  const pixels = exprsToPixels(flex.proportions, length, "flex");
  console.log(pixels);
  return makeAnchors(pixels);
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

export function numberToPixel(expr: number): string {
  return `${expr}px`;
}

export function numberToFraction(expr: number): string {
  return `${expr}fr`;
}

function exprsToPixels(
  exprs: string[],
  maxSize: number,
  type: "flex" | "grid"
): number[] {
  const pxSum = exprs
    .filter((n) => n.endsWith("px"))
    .map(pixelToNumber)
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
  // .map(numberToPixel);
}

function pixelsToFractions(exprs: string[]): string[] {
  const values = exprs.map(pixelToNumber);
  const minVal = Math.min(...values);
  const fractionsRates = values.map((v) => {
    return Math.floor((v / minVal) * 100) / 100;
  });
  return fractionsRates.map(numberToFraction);
}

function debounce(fn: Function, interval: number = 16) {
  let timerId: number | any;
  return () => {
    clearTimeout(timerId);
    timerId = setTimeout(fn, interval);
  };
}

export function renderToStyle(grid: GridData) {
  const areas = grid.areas
    .map((row) => row.join(" "))
    .map((rowStr) => `'${rowStr}'`)
    .join("\n");
  return `
    display: grid;
    grid-template-rows: ${grid.rows.join(" ")};
    grid-template-columns: ${grid.columns.join(" ")};
    grid-template-areas: ${areas}
  `;
}

// export function buildEditableGridData(
//   original: GridData,
//   spacerSize = 16
// ): EditbalGridData {
//   const controllers: Controllers = {
//     verticals: [],
//     horizontals: [],
//     crosses: [],
//     idxMap: {},
//   };

//   // build idx to name

//   original.areas.forEach((rows, i) => {
//     rows.forEach((name, j) => {
//       controllers.idxMap[`${i}-${j}`] = name;
//     });
//   });

//   // rebuild rows
//   const rows = interpose(original.rows, () => numberToPixel(spacerSize));

//   // rebuild columns
//   const columns = interpose(original.columns, () => numberToPixel(spacerSize));

//   // rebuild areas
//   const rowLength = original.areas[0].length;

//   const areasRowUpdated = original.areas.map((rows, i) => {
//     return interpose(rows, (a, b, j) => {
//       if (a === b) {
//         return a;
//       } else {
//         const t = `v-${i}-${j}`;
//         controllers.verticals.push([i, j]);
//         return t;
//       }
//     });
//   });

//   // TODO: connect with vertical
//   const areas = interpose(areasRowUpdated, (_0, _1, i) => {
//     const spaced = new Array(rowLength).fill(0).map((_, j) => {
//       if (original.areas[i][j] === original.areas[i + 1][j]) {
//         return original.areas[i][j];
//       } else {
//         const t = `h-${i}-${j}`;
//         controllers.horizontals.push([i, j]);
//         return t;
//       }
//     });

//     return interpose(spaced, (a, _, j) => {
//       if (
//         original.areas[i][j] === original.areas[i + 1][j] &&
//         original.areas[i][j] === original.areas[i][j + 1] &&
//         original.areas[i][j] === original.areas[i + 1][j + 1]
//       ) {
//         return original.areas[i][j];
//       }

//       const t = `c-${i}-${j}`;
//       controllers.crosses.push([i, j]);
//       return t;
//     });
//   });
//   return {
//     rows,
//     columns,
//     fixedColumns: original.fixedColumns,
//     fixedRows: original.fixedRows,
//     areas,
//     controllers,
//   };
// }

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

type PointAnchor = {
  type: "point";
  point: number;
};

type SizedAnchor = {
  type: "sized";
  point: number;
  length: number;
  fixed: boolean;
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

type Value = ConstValue | RatioValue;
type ConstValue = {
  type: "static";
  value: number;
};

type RatioValue = {
  type: "ratio";
  value: number;
};

function toInternalValue(proportion: FlexGrowValue | PixelValue): Value {
  if (hasSuffix(proportion, "px")) {
    return {
      type: "static",
      value: toNum(proportion, "px"),
    };
  } else {
    return {
      type: "ratio",
      value: toNum(proportion, ""),
    };
  }
}

export function calcAnchors(
  rawProportions: Array<FlexGrowValue | PixelValue>,
  maxSize: number
): Array<PointAnchor | SizedAnchor> {
  const values = rawProportions.map(toInternalValue);

  let proportionSum = 0;
  let pixelSum = 0;
  for (const v of values) {
    if (v.type === "static") {
      pixelSum += v.value;
    } else {
      proportionSum += v.value;
    }
  }

  let anchors: Array<PointAnchor | SizedAnchor> = [];
  const restSize = maxSize - pixelSum;

  let progress = 0;
  for (let i = 0; i < values.length; i++) {
    const isFirst = i === 0;
    const isLast = i === values.length - 1;
    const isSizedFixed = isFirst || isLast;

    const next = values[i + 1];
    const cur = values[i]!;
    const prev = values[i - 1];

    // skip: 100px [1] 1
    if (
      prev?.type === "static" &&
      cur.type === "ratio" &&
      next?.type === "ratio"
    ) {
      const px = (restSize * cur.value) / proportionSum;
      progress += px;
      continue;
    }

    // skip: prev is static
    // skip: 100px [1] 1
    if (prev?.type === "static" && cur.type === "ratio") {
      continue;
    }
    // const
    if (cur?.type === "static") {
      anchors.push({
        type: "sized",
        point: progress,
        length: cur.value,
        fixed: isSizedFixed,
      });
      progress += cur.value;
    } else {
      const px = (restSize * cur.value) / proportionSum;
      anchors.push({ type: "point", point: progress });

      // if (prev?.type === "static") {
      //   if (anchors[anchors.length - 1]?.type === "sized") {
      //   }
      //   // if left is static, skip anchor
      //   // console.log("prev is static", prev);
      //   // throw "stop";
      // } else {
      //   // put anchor
      //   anchors.push({ type: "point", point: progress });
      // }

      progress += px;
    }
  }

  if (anchors[0]!.type === "point" && anchors[0]!.point === 0) {
    anchors = anchors.slice(1);
  }

  return anchors;
}
