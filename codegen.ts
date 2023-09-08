import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'graphql/**/*.graphql',
  documents: ['**/*.tsx'],
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
