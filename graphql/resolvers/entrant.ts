import { QueryResolvers } from '../../generated/resolvers-types';

export const getEntrants: QueryResolvers['getEntrants'] = async (
  _parent,
  _args
) => {
  return prisma.entrant.findMany();
};
