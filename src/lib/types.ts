import type { ParsedSvelteTemplate } from "./svelteHelpers";

export type StringAttribute = {
  type: "string";
  value: string;
};

export type IdentifierAttribute = {
  type: "identifier";
  value: string;
};

export type OtherAttribute = {
  type: "other";
  value: string;
};

export type NodeAttribute =
  | StringAttribute
  | IdentifierAttribute
  | OtherAttribute;

export type InspectorData = {
  code: string;
  parsed: ParsedSvelteTemplate;
  attrs: {
    [key: string]: NodeAttribute;
  };
};
