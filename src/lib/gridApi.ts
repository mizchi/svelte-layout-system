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

type EditbalGridData = GridData & {
  controllers: Controllers;
};

// type WindowData = {
//   id: string;
//   displayName: string;
// };

// type LayoutData = {
//   grid: GridData;
//   panes: PaneData[];
//   windows: {
//     [key: string]: WindowData;
//   };
// };

// type PaneData = {
//   id: string;
//   displayName?: string;
//   selectedId?: string;
//   showTab?: boolean;
//   windowIds: string[];
// };

type Controllers = {
  verticals: [number, number][];
  horizontals: [number, number][];
  crosses: [number, number][];
  idxMap: { [key: string]: string };
};

function interpose<T>(
  list: T[],
  interposer: (a: T, b: T, aIndex: number, bIndex: number) => T
): T[] {
  const r: T[] = [];
  list.forEach((i, idx) => {
    r.push(i);
    if (idx !== list.length - 1) {
      r.push(interposer(list[idx], list[idx + 1], idx, idx + 1));
    }
  });
  return r;
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
// const sum = (nums: number[]): number => nums.reduce((s, n) => s + n, 0);
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

export function buildEditableGridData(
  original: GridData,
  spacerSize = 16
): EditbalGridData {
  const controllers: Controllers = {
    verticals: [],
    horizontals: [],
    crosses: [],
    idxMap: {},
  };

  // build idx to name

  original.areas.forEach((rows, i) => {
    rows.forEach((name, j) => {
      controllers.idxMap[`${i}-${j}`] = name;
    });
  });

  // rebuild rows
  const rows = interpose(original.rows, () => numberToPixel(spacerSize));

  // rebuild columns
  const columns = interpose(original.columns, () => numberToPixel(spacerSize));

  // rebuild areas
  const rowLength = original.areas[0].length;

  const areasRowUpdated = original.areas.map((rows, i) => {
    return interpose(rows, (a, b, j) => {
      if (a === b) {
        return a;
      } else {
        const t = `v-${i}-${j}`;
        controllers.verticals.push([i, j]);
        return t;
      }
    });
  });

  // TODO: connect with vertical
  const areas = interpose(areasRowUpdated, (_0, _1, i) => {
    const spaced = new Array(rowLength).fill(0).map((_, j) => {
      if (original.areas[i][j] === original.areas[i + 1][j]) {
        return original.areas[i][j];
      } else {
        const t = `h-${i}-${j}`;
        controllers.horizontals.push([i, j]);
        return t;
      }
    });

    return interpose(spaced, (a, _, j) => {
      if (
        original.areas[i][j] === original.areas[i + 1][j] &&
        original.areas[i][j] === original.areas[i][j + 1] &&
        original.areas[i][j] === original.areas[i + 1][j + 1]
      ) {
        return original.areas[i][j];
      }

      const t = `c-${i}-${j}`;
      controllers.crosses.push([i, j]);
      return t;
    });
  });
  return {
    rows,
    columns,
    fixedColumns: original.fixedColumns,
    fixedRows: original.fixedRows,
    areas,
    controllers,
  };
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

export function calcAnchors(
  proportions: Array<FlexGrowValue | PixelValue>,
  maxSize: number
): Array<PointAnchor | SizedAnchor> {
  let proportionSum = 0;
  let pixelSum = 0;
  for (const v of proportions) {
    if (hasSuffix(v, "px")) {
      const n = toNum(v, "px")!;
      pixelSum += n;
    } else {
      proportionSum += toNum(v, "")!;
    }
  }

  let anchors: Array<PointAnchor | SizedAnchor> = [];
  const restSize = maxSize - pixelSum;

  let progress = 0;
  for (let i = 0; i < proportions.length; i++) {
    const isFirst = i === 0;
    const isLast = i === proportions.length - 1;
    const isSizedFixed = isFirst || isLast;

    const v = proportions[i];
    const next = proportions[i + 1];
    const prev = proportions[i - 1];

    // skip: sized 1 sized
    if (
      hasSuffix(v, "") &&
      prev &&
      hasSuffix(prev, "px") &&
      next &&
      hasSuffix(next, "px")
    ) {
      const proportion = toNum(v, "")!;
      const px = (restSize * proportion) / proportionSum;
      progress += px;
      continue;
    }
    // const
    if (hasSuffix(v, "px")) {
      const px = toNum(v, "px")!;
      anchors.push({
        type: "sized",
        point: progress,
        length: px,
        fixed: isSizedFixed,
      });
      progress += px;
    } else {
      const proportion = toNum(v, "")!;
      const px = (restSize * proportion) / proportionSum;
      anchors.push({ type: "point", point: progress });
      progress += px;
    }
  }

  if (anchors[0].type === "point" && anchors[0].point === 0) {
    anchors = anchors.slice(1);
  }

  return anchors;
}

let proportions: Array<FlexGrowValue | PixelValue> = [
  "5", // 100
  "2", // 40
  "200px",
  "3", // 60
  "100px",
];

let expected = [
  { type: "point", point: 100 },
  { type: "sized", point: 140, length: 200, fixed: false },
  { type: "sized", point: 400, length: 100, fixed: true },
];

// let _proportions: Array<FlexGrowValue | PixelValue> = [
//   "5",
//   "2",
//   "80px",
//   "3",
//   "100px",
// ];

// const xxx = calcAnchors(proportions, 500);
// console.log(xxx);
