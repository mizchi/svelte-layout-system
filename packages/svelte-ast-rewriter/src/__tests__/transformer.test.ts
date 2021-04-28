import { parse } from "../parser";
import { transform } from "../transformer";
import { print } from "../printer";
import * as b from "../builder";

const expected1 = `<script></script>

<Flex id="root">
  <FlexItem length="3">a</FlexItem>
  <FlexItem length="2">b</FlexItem>
</Flex>

<style></style>
`;

const expected2 = `<script></script>

<Flex id="root">
  <FlexItem length="1">a</FlexItem>
  <FlexItem length="1">
    <Flex id="nested">
      <FlexItem length="3">a</FlexItem>
      <FlexItem length="2">b</FlexItem>
    </Flex>
  </FlexItem>
</Flex>

<style></style>
`;

it("transform nested flex item length", () => {
  const code = `
  <Flex id="root">
    <FlexItem length="1">a</FlexItem>
    <FlexItem length="1">b</FlexItem>
  </Flex>
  `;

  const parsed = parse(code);
  const rewrote = transform(parsed, {
    type: "flex-children",
    children: ["3", "2"],
    id: "root",
  });

  const transformed = print(rewrote);
  expect(transformed).toBe(expected1);
});

it("transform multi target", () => {
  const code = `
<Flex id="a">
  <FlexItem length="1" />
  <FlexItem length="1" />
</Flex>

<Flex id="b">
  <FlexItem length="1" />
  <FlexItem length="1" />
</Flex>
`;
  const parsed = parse(code);
  const rewrote = transform(parsed, {
    type: "flex-children",
    children: ["3", "2"],
    id: "b",
  });

  const transformed = print(rewrote);
  expect(transformed).toBe(`<script></script>

<Flex id="a">
  <FlexItem length="1" />
  <FlexItem length="1" />
</Flex>

<Flex id="b">
  <FlexItem length="3" />
  <FlexItem length="2" />
</Flex>

<style></style>
`);
});

it("transform flex item length", () => {
  const code = `
  <Flex id="root">
    <FlexItem length="1">a</FlexItem>
    <FlexItem length="1">
      <Flex id="nested">
        <FlexItem length="1">a</FlexItem>
        <FlexItem length="1">b</FlexItem>
      </Flex>
    </FlexItem>
  </Flex>
  `;

  const parsed = parse(code);
  const rewrote = transform(parsed, {
    type: "flex-children",
    children: ["3", "2"],
    id: "nested",
  });
  const transformed = print(rewrote);
  expect(transformed).toBe(expected2);
});

it("transform nested flex item length", () => {
  const code = `
  <Flex id="root">
    <FlexItem length="1">a</FlexItem>
    <FlexItem length="1">b</FlexItem>
  </Flex>
  `;

  const parsed = parse(code);
  const rewrote = transform(parsed, {
    type: "flex-children",
    children: ["3", "2"],
    id: "root",
  });

  const transformed = print(rewrote);
  expect(transformed).toBe(expected1);
});

it("transform insertChild", () => {
  const code = `
  <Flex id="root">
    <FlexItem id="x" length="1" />
  </Flex>
  `;

  const parsed = parse(code);
  const rewrote = transform(parsed, {
    type: "insert-child",
    id: "x",
    newNode: b.inlineComponent("Hoge"),
  });
  const transformed = print(rewrote);
  expect(transformed).toBe(`<script></script>

<Flex id="root">
  <FlexItem id="x" length="1"><Hoge /></FlexItem>
</Flex>

<style></style>
`);
});

it("transform insertChild with attributes", () => {
  const code = `
  <Flex id="root">
    <FlexItem id="x" length="1" />
  </Flex>
  `;

  const parsed = parse(code);
  // const rewrote = transform(code, )
  const rewrote = transform(parsed, {
    type: "insert-child",
    id: "x",
    newNode: b.inlineComponent("Hoge", [b.attribute("foo", [b.text("bar")])]),
  });
  const transformed = print(rewrote);
  expect(transformed).toBe(`<script></script>

<Flex id="root">
  <FlexItem id="x" length="1"><Hoge foo="bar" /></FlexItem>
</Flex>

<style></style>
`);
});

it("transform updateAttribute", () => {
  const code = `<Flex id="root" v="1" />`;

  const parsed = parse(code);
  // const rewrote = transform(code, )
  const rewrote = transform(parsed, {
    type: "update-attribute",
    id: "root",
    attributeName: "v",
    value: [b.text("2")],
  });
  const transformed = print(rewrote);
  expect(transformed).toBe(`<script></script>

<Flex id="root" v="2" />

<style></style>
`);
});

it("transform updateAttribute with create", () => {
  const code = `<Flex id="root" />`;

  const parsed = parse(code);
  const rewrote = transform(parsed, {
    type: "update-attribute",
    id: "root",
    attributeName: "v",
    value: [b.text("99")],
  });
  const transformed = print(rewrote);
  expect(transformed).toBe(`<script></script>

<Flex id="root" v="99" />

<style></style>
`);
});

it("transform deleteNode", () => {
  const code = `<Flex id="root">
  <FlexItem id="a" xxx="1" />
  <FlexItem id="b" yyy="1" />
</Flex>
`;

  const parsed = parse(code);
  // const rewrote = transform(code, )
  const rewrote = transform(parsed, {
    type: "delete-node",
    id: "b",
  });
  const transformed = print(rewrote);
  expect(transformed).toBe(`<script></script>

<Flex id="root"><FlexItem id="a" xxx="1" /></Flex>

<style></style>
`);
});
