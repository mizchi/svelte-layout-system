import { makeControllers, FlexGrowValue, PixelValue } from "../layout";

it("r", () => {
  expect(makeControllers(["1"], 100)).toEqual([
    {
      type: "point",
      point: 0,
      visible: false,
      index: 0,
    },
  ]);
});

it("s", () => {
  expect(makeControllers(["100px"], 100)).toEqual([
    {
      type: "sized",
      index: 0,
      point: 0,
      length: 100,
      fixed: true,
    },
  ]);
});

it("r | r", () => {
  expect(makeControllers(["3", "1"], 100)).toEqual([
    { type: "point", point: 0, index: 0, visible: false },
    { type: "point", point: 75, index: 1, visible: true },
  ]);
});

it("s | r", () => {
  expect(makeControllers(["100px", "1"], 150)).toEqual([
    { type: "sized", point: 0, length: 100, fixed: true, index: 0 },
    { type: "point", point: 100, index: 1, visible: false },
  ]);
});

it("r | s", () => {
  expect(makeControllers(["1", "100px"], 150)).toEqual([
    { type: "point", point: 0, index: 0, visible: false },
    { type: "sized", point: 50, index: 1, length: 100, fixed: true },
  ]);
});

it("s | r | r | s", () => {
  expect(makeControllers(["10px", "1", "1", "10px"], 100)).toEqual([
    { type: "sized", point: 0, length: 10, fixed: true, index: 0 },
    { type: "point", point: 10, index: 1, visible: false },
    { type: "point", point: 50, index: 2, visible: true },
    { type: "sized", point: 90, length: 10, fixed: true, index: 3 },
  ]);
});

it("r | s | r", () => {
  expect(makeControllers(["1", "10px", "1"], 100)).toEqual([
    { type: "point", point: 0, index: 0, visible: false },
    { type: "sized", point: 45, length: 10, index: 1, fixed: false },
    { type: "point", point: 55, index: 2, visible: false },
  ]);
});

it("s | r | r | r | s", () => {
  expect(makeControllers(["10px", "1", "1", "1", "10px"], 110)).toEqual([
    { type: "sized", point: 0, length: 10, fixed: true, index: 0 },
    { type: "point", point: 10, visible: false, index: 1 },
    { type: "point", point: 40, visible: true, index: 2 },
    { type: "point", point: 70, visible: true, index: 3 },
    { type: "sized", point: 100, length: 10, fixed: true, index: 4 },
  ]);
});

it("s | r | s | r | s", () => {
  expect(makeControllers(["10px", "1", "10px", "1", "10px"], 50)).toEqual([
    { type: "sized", point: 0, length: 10, fixed: true, index: 0 },
    { type: "point", point: 10, visible: false, index: 1 },
    { type: "sized", point: 20, length: 10, fixed: false, index: 2 },
    { type: "point", point: 30, visible: false, index: 3 },
    { type: "sized", point: 40, length: 10, fixed: true, index: 4 },
  ]);
});

it("s | r | r | s", () => {
  expect(makeControllers(["100px", "1", "1", "100px"], 300)).toEqual([
    { type: "sized", point: 0, length: 100, fixed: true, index: 0 },
    { type: "point", point: 100, index: 1, visible: false },
    { type: "point", point: 150, index: 2, visible: true },
    { type: "sized", point: 200, length: 100, fixed: true, index: 3 },
  ]);
});
