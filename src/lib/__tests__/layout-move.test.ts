import {
  FlexGrowValue,
  PixelValue,
  moveController,
  normalizeFlexValues,
} from "../layout";

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
  let values: Array<FlexGrowValue | PixelValue> = normalizeFlexValues(
    ["1", "1", "1"],
    300
  );
  const next = moveController(values, 300, 1, -10);
  console.log(next);
  expect(moveController(values, 300, 1, -10)).toEqual(["90", "110", "100"]);
});

it.skip("move static between ratios", () => {
  // normalizeFlexValues
  let values: Array<FlexGrowValue | PixelValue> = normalizeFlexValues(
    ["1", "1", "1", "100px", "1", "1", "100px"],
    700
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

// it("r | r", async () => {
//   expect(makeControllers(["3", "1"], 100)).toEqual([
//     { type: "point", point: 75 },
//   ]);
// });

// it("s | r", async () => {
//   expect(makeControllers(["100px", "1"], 150)).toEqual([
//     { type: "sized", point: 0, length: 100, fixed: true },
//   ]);
// });

// it("r | s", async () => {
//   expect(makeControllers(["1", "100px"], 150)).toEqual([
//     { type: "sized", point: 50, length: 100, fixed: true },
//   ]);
// });

// it("s | r | r | s", async () => {
//   expect(makeControllers(["10px", "1", "1", "10px"], 100)).toEqual([
//     { type: "sized", point: 0, length: 10, fixed: true },
//     { type: "point", point: 50 },
//     { type: "sized", point: 90, length: 10, fixed: true },
//   ]);
// });

// it("r | s | r", async () => {
//   expect(makeControllers(["1", "10px", "1"], 100)).toEqual([
//     { type: "sized", point: 45, length: 10, fixed: false },
//   ]);
// });

// it("s | r | r | r | s", async () => {
//   expect(makeControllers(["10px", "1", "1", "1", "10px"], 110)).toEqual([
//     { type: "sized", point: 0, length: 10, fixed: true },
//     { type: "point", point: 40 },
//     { type: "point", point: 70 },
//     { type: "sized", point: 100, length: 10, fixed: true },
//   ]);
// });

// it("s | r | s | r | s", async () => {
//   expect(makeControllers(["10px", "1", "10px", "1", "10px"], 50)).toEqual([
//     { type: "sized", point: 0, length: 10, fixed: true },
//     { type: "sized", point: 20, length: 10, fixed: false },
//     { type: "sized", point: 40, length: 10, fixed: true },
//   ]);
// });

// it("s | r | r | s", async () => {
//   expect(makeControllers(["100px", "1", "1", "100px"], 300)).toEqual([
//     { type: "sized", point: 0, length: 100, fixed: true },
//     { type: "point", point: 150 },
//     { type: "sized", point: 200, length: 100, fixed: true },
//   ]);
// });
