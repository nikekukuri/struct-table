
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:8000/graphql",
  documents: "graphql/**/*.graphql",
  generates: {
    "./generated/": {
      preset: "client"
    },
    "./graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
