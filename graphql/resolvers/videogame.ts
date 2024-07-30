import { QueryResolvers } from '../../generated/resolvers-types';

export const getVideogames: QueryResolvers['getVideogames'] = async (
  _parent,
  _args,
  { prisma }
) => {
  return prisma.videogame.findMany({ orderBy: { name: 'asc' } });
};
