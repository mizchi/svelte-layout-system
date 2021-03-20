import { parseSvelteTemplate } from "../parser";
import { transform } from "../transformer";
import { renderSvelteTemplate } from "../printer";

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

  const parsed = parseSvelteTemplate(code);
  const rewrote = transform(parsed, {
    type: "flex-children",
    children: ["3", "2"],
    nodeId: "root",
  });

  const transformed = renderSvelteTemplate(rewrote);
  expect(transformed).toBe(expected1);
});

it("transform flex item length", () => {
  const code = `
  <Flex id="root">
    <FlexItem length="1">a</FlexItem>
    <FlexItem length="1">
      <Flex id="nested">
        <FlexItem length="3">a</FlexItem>
        <FlexItem length="2">b</FlexItem>
      </Flex>
    </FlexItem>
  </Flex>
  `;

  const parsed = parseSvelteTemplate(code);
  const rewrote = transform(parsed, {
    type: "flex-children",
    children: ["3", "2"],
    nodeId: "nested",
  });
  const transformed = renderSvelteTemplate(rewrote);
  expect(transformed).toBe(expected2);
});
