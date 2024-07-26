import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'graphql/schema.graphql',
  documents: ['graphql/queries/**/*.graphql', 'graphql/mutations/**/*.graphql'],
  generates: {
    'generated/': {
      preset: 'client',
      config: {
        useIndexSignature: true,
      },
    },
    'generated/resolvers-types.ts': {
      config: {
        useIndexSignature: true,
      },
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
};

export default config;
