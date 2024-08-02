
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  //schema: "http://localhost:8000/graphql",
  schema: "http://localhost:8000/graphql",
  //documents: "src/**/*.tsx",
  documents: "graphql/**/*.graphql",
  generates: {
    "src/gql/": {
      preset: "client",
      //plugins: ["typescript", "typescript-operations", "typescript-react-apollo"]
      plugins: []
    },
    "./graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
