import type { SourceFile } from "typescript";
import type { Stylesheet } from "css";
import type { Ast } from "svelte/types/compiler/interfaces";
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

export type ParsedSvelteAst = {
  preparsed: Preparsed;
  script: SourceFile;
  style: Stylesheet;
  template: Ast;
};

export type Preparsed = {
  html: {
    raw: string;
  };
  module?: {
    attrs: string;
    raw: string;
  };
  script: {
    attrs: string;
    raw: string;
  };
  style: {
    attrs: string;
    raw: string;
  };
};
