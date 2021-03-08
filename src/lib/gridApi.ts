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
export function getAnchors(grid: GridData, w: number, h: number) {
  const columnsPixels = exprsToPixels(grid.columns, w);
  const rowsPixels = exprsToPixels(grid.rows, h);
  return {
    columnAnchors: makeAnchors(columnsPixels),
    rowsAnchors: makeAnchors(rowsPixels),
  };

  // const cAnchors: number[] = makeAnchors(columnsPixels);
  // let xIndex = cAnchors.find((v) => {
  //   return v - near / 2 < x && x < v + near / 2;
  // });

  // const rAnchors: number[] = [];
  // let rLast = 0;
  // rowsPixels.forEach((p, idx) => {
  //   if (rowsPixels.length - 1 === idx) return;
  //   rAnchors.push(rLast + p);
  //   rLast += p;
  // });
  // let yIndex: number | null = null;
  // rAnchors.forEach((v, idx) => {
  //   if (v - near / 2 < y && y < v + near / 2) {
  //     yIndex = idx;
  //     return;
  //   }
  // });

  // return {
  //   xIndex,
  //   yIndex,
  //   // columnsPixels,
  //   // rowsPixels,
  //   // cAnchors,
  //   // rAnchors,
  // };
}
function pixelToNumber(expr: string | number): number {
  if (typeof expr === "number") {
    return expr;
  } else {
    return Number(expr.replace(/px$/, ""));
  }
}

function fractionToNumber(expr: string | number): number {
  if (typeof expr === "number") {
    return expr;
  } else {
    return Number(expr.replace(/fr$/, ""));
  }
}

function numberToPixel(expr: number): string {
  return `${expr}px`;
}

function numberToFraction(expr: number): string {
  return `${expr}fr`;
}

function exprsToPixels(exprs: string[], maxSize: number): number[] {
  const pxSum = exprs
    .filter((n) => n.includes("px"))
    .map(pixelToNumber)
    .reduce((sum, i) => sum + i, 0);
  const frSum = exprs
    .filter((n) => n.includes("fr"))
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
