import { moveController, normalizeFlexValues } from "../src/lib/layout";
import type { FlexGrowValue, PixelValue } from "../src/types";

it("move right", () => {
  const values: Array<FlexGrowValue | PixelValue> = ["1", "1"];
  expect(moveController(values, 100, 1, 10)).toEqual(["60", "40"]);
});

it("move left", () => {
  const values: Array<FlexGrowValue | PixelValue> = ["1", "1"];
  expect(moveController(values, 100, 1, -10)).toEqual(["40", "60"]);
});

it("with static", () => {
  const values: Array<FlexGrowValue | PixelValue> = ["1", "1", "50px"];
  expect(moveController(values, 100, 0, 0)).toEqual(["25", "25", "50px"]);
});

it("move with static", () => {
  const values: Array<FlexGrowValue | PixelValue> = ["1", "1", "50px"];
  expect(moveController(values, 150, 1, 10)).toEqual(["60", "40", "50px"]);
});

it("move static between ratios", () => {
  const values: Array<FlexGrowValue | PixelValue> = ["1", "50px", "1"];
  expect(moveController(values, 150, 1, 10)).toEqual(["60", "50px", "40"]);
});

it("move static between ratios", () => {
  const values: Array<FlexGrowValue | PixelValue> = ["50px", "1", "50px", "1"];
  expect(moveController(values, 200, 2, -10)).toEqual([
    "50px",
    "40",
    "50px",
    "60",
  ]);
});

it("move point between ratios", () => {
  // normalizeFlexValues
  // 100 100  100
  // | - [|] - |
  //     <-
  const values: Array<FlexGrowValue | PixelValue> = normalizeFlexValues(
    ["1", "1", "1"],
    { parentSize: 300 }
  );
  expect(moveController(values, 300, 1, -10)).toEqual(["90", "110", "100"]);
});

it("move static between ratios", () => {
  // normalizeFlexValues
  const values: Array<FlexGrowValue | PixelValue> = normalizeFlexValues(
    ["1", "1", "1", "100px", "1", "1", "100px"],
    { parentSize: 700 }
  );

  expect(moveController(values, 700, 1, -10)).toEqual([
    "90",
    "110",
    "100",
    "100px",
    "100",
    "100",
    "100px",
  ]);
});
