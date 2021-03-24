<script lang="ts">
  import { onMount } from "svelte";
  import { makeExecutableSchema } from "@graphql-tools/schema";
  import { addMocksToSchema } from "@graphql-tools/mock";
  import "codemirror/lib/codemirror.css";
  import CodeMirror from "codemirror";
  import "codemirror/addon/hint/show-hint";
  import "codemirror/addon/lint/lint";
  import "codemirror-graphql/hint";
  import "codemirror-graphql/lint";
  import "codemirror-graphql/mode";

  // TODO: load
  const typeDefs = `
type Query {
  userData(q: UserDataQuery!): UserData!
  template(source: String!, args: [UserDataQuery!]!): ExpandedTemplate!
}

type ExpandedTemplate {
  result: String!
}

type UserData {
  key: String!
  result: String!
}

input UserDataQuery {
  key: String!
}
`;

  const schema = makeExecutableSchema({
    typeDefs,
  });

  // const mocks = {
  //   UserData: () => {
  //     return {
  //       key: "mocked",
  //       value: "mocked",
  //     };
  //   },
  //   String: () => "Hello",
  //   Query: () => {},
  //   Mutation: () => {},
  // };

  const schemaWithMocks = addMocksToSchema({
    schema,
    mocks: {},
  });
  // const schemaWithMocks = typeDefs as any;

  let element: HTMLTextAreaElement;

  onMount(() => {
    CodeMirror.fromTextArea(element, {
      mode: "graphql",
      lint: {
        // @ts-ignore
        schema: schemaWithMocks,
      },
      hintOptions: {
        schema: schemaWithMocks,
      },
    });
    // debugger;
  });
</script>

<textarea bind:this={element} />
