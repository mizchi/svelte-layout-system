type UnitSuffix = "px" | "em" | "rem" | "%" | "fr" | "";
type Unit<Suffix extends UnitSuffix> = `${number}${Suffix}`;
type FlexGrowValue = Unit<"">;
type PixelValue = Unit<"px">;
type EmValue = Unit<"em">;
type RemValue = Unit<"rem">;
type PercentValue = Unit<"%">;
type FractionValue = Unit<"fr">;

type ConstantValue = PixelValue | EmValue | RemValue;
type ProportionConstantValue = ConstantValue | PercentValue;
type ProportiolValue = FlexGrowValue | FractionValue;

type FlexProportionExpr = Array<FlexGrowValue | ProportionConstantValue>;
type GridProportionExpr = Array<FractionValue | ProportionConstantValue>;

function hasSuffix<Suffix extends UnitSuffix>(
  value: string,
  suffix: Suffix
): value is `${number}${Suffix}` {
  return new RegExp(`[0-9]${suffix}\$`).test(value);
}

function toNum<T extends UnitSuffix>(expr: Unit<T>, _suffix: T): number | null {
  const n = Number(expr.replace(/(\d+)(px|em|rem|\%|fr|)$/, "$1"));
  if (n === NaN) return null;
  return n;
}

export function calcInnerSizes(
  proportions: Array<ProportionConstantValue | ProportiolValue>,
  size: number,
  { emPixel, remPixel }: { emPixel: number; remPixel: number }
) {
  let proportionSum = 0;
  let pixelSum = 0;
  let pixelOrProportion: Array<PixelValue | ProportiolValue> = [];

  for (const v of proportions) {
    if (hasSuffix(v, "px")) {
      pixelOrProportion.push(v);
      const n = toNum(v, "px")!;
      pixelSum += n;
    } else if (hasSuffix(v, "rem")) {
      const n = toNum(v, "rem")! * remPixel;
      pixelOrProportion.push(`${n}px` as PixelValue);
      pixelSum += n;
    } else if (hasSuffix(v, "em")) {
      const n = toNum(v, "em")! * emPixel;
      pixelOrProportion.push(`${n}px` as PixelValue);
      pixelSum += n;
    } else if (hasSuffix(v, "%")) {
      const percent = toNum(v, "%")!;
      const n = (size * percent) / 100;
      pixelOrProportion.push(`${n}px` as PixelValue);
      pixelSum += n;
    } else {
      pixelOrProportion.push(v);
      if (hasSuffix(v, "fr")) {
        proportionSum += toNum(v, "fr")!;
      } else {
        proportionSum += toNum(v, "")!;
      }
    }
  }
  const restSize = size - pixelSum;
  return pixelOrProportion.map((v) => {
    if (hasSuffix(v, "px")) {
      return toNum(v, "px");
    } else {
      let num;
      if (hasSuffix(v, "fr")) {
        num = toNum(v, "fr")!;
      } else {
        num = toNum(v, "")!;
      }
      return (num * restSize) / proportionSum;
    }
  });
}

const sizes1 = calcInnerSizes(
  ["1", "100px", "10em", "20rem", "10%", "1"] as FlexProportionExpr,
  800,
  { emPixel: 16, remPixel: 16 }
);
console.log(sizes1);

const n = Math.random() > 0.5 ? "150px" : "30%";

if (hasSuffix(n, "px")) {
  const x: PixelValue = n;
  const y: PercentValue = n; // => 型エラー
} else {
  const z: PercentValue = n; // => 型エラー
}

const emOrPer = Math.random() > 0.5 ? "1em" : "1rem";

if (hasSuffix(emOrPer, "em")) {
  const a: EmValue = emOrPer; // => 型エラー
  const b: RemValue = emOrPer; // => 型エラー
}
