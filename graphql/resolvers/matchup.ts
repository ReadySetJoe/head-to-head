import { QueryResolvers } from '../../generated/resolvers-types';
import prisma from '../../lib/prisma';

type MatchupSetsQuery = {
  winnerId: { in: number[] };
  loserId: { in: number[] };
  Event?: { videogameId?: number; Tournament?: { startAt: { gte: string } } };
};

export const getMatchup: QueryResolvers['getMatchup'] = async (
  _parent,
  { input: { entrantId1, entrantId2, startAfter, videogameId } }
) => {
  const where: MatchupSetsQuery = {
    winnerId: { in: [entrantId1, entrantId2] },
    loserId: { in: [entrantId1, entrantId2] },
  };

  if (startAfter) {
    Object.assign(where, {
      event: {
        tournament: {
          startAt: { gte: new Date(startAfter).toISOString() },
        },
      },
    });
  }

  if (videogameId) {
    Object.assign(where, { event: { videogameId } });
  }

  const matches = await prisma.set.findMany({
    where,
  });

  return {
    entrantId1: entrantId1,
    entrantId2: entrantId2,
    score1: matches.filter(match => match.winnerId === entrantId1).length,
    score2: matches.filter(match => match.winnerId === entrantId2).length,
  };
};
