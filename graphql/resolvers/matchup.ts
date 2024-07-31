import { QueryResolvers } from '../../generated/resolvers-types';
import prisma from '../../lib/prisma';

export const getMatchup: QueryResolvers['getMatchup'] = async (
  _parent,
  { input: { entrantId1, entrantId2, startAfter, videogameId } }
) => {
  const sets = await prisma.set.findMany({
    where: {
      event: {
        videogameId: videogameId,
        tournament: {
          startAt: {
            gte: startAfter,
          },
        },
      },
      OR: [
        {
          SetEntrantWinner: {
            some: {
              entrantId: entrantId1,
            },
          },
          SetEntrantLoser: {
            some: {
              entrantId: entrantId2,
            },
          },
        },
        {
          SetEntrantWinner: {
            some: {
              entrantId: entrantId2,
            },
          },
          SetEntrantLoser: {
            some: {
              entrantId: entrantId1,
            },
          },
        },
      ],
    },
    include: {
      SetEntrantWinner: true,
      SetEntrantLoser: true,
    },
  });

  let score1 = 0;
  let score2 = 0;

  sets.forEach(set => {
    set.SetEntrantWinner.forEach(winner => {
      if (winner.entrantId === entrantId1) score1++;
      if (winner.entrantId === entrantId2) score2++;
    });
  });

  const entrant1 = await prisma.entrant.findUnique({
    where: {
      id: entrantId1,
    },
  });

  const entrant2 = await prisma.entrant.findUnique({
    where: {
      id: entrantId2,
    },
  });

  return {
    entrant1,
    entrant2,
    score1,
    score2,
  };
};
