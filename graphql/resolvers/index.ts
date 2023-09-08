import { Resolvers } from '../../generated/resolvers-types';
import {
  helloWorldMutation,
  helloWorldQuery,
  printMessage,
} from './hello-world';

const resolvers: Resolvers = {
  Query: {
    helloWorldQuery,
    printMessage,
  },
  Mutation: {
    helloWorldMutation,
  },
};

export default resolvers;
