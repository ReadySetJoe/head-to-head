import { QueryResolvers } from '../../generated/resolvers-types';
import prisma from '../../lib/prisma';

export const getVideogames: QueryResolvers['getVideogames'] = async (
  _parent,
  _args
) => {
  return prisma.videogame.findMany({ orderBy: { name: 'asc' } });
};
