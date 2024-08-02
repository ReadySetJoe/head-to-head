import { Matchup } from '../../generated/graphql';
import { QueryResolvers } from '../../generated/resolvers-types';
import prisma from '../../lib/prisma';
import { getStartGGMatchupBySlugs, getStartGGUser } from '../../lib/start-gg';

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

export const getMatchupBySlugs: QueryResolvers['getMatchupBySlugs'] = async (
  _parent,
  { input: { entrantSlug1, entrantSlug2, startAfter, videogameId } }
) => {
  const { player1Wins, player2Wins } = await getStartGGMatchupBySlugs(
    entrantSlug1,
    entrantSlug2,
    startAfter,
    videogameId
  );

  return {
    score1: player1Wins.length,
    score2: player2Wins.length,
  };
};

export const getMatchupSpread: QueryResolvers['getMatchupSpread'] = async (
  _parent,
  { input: { entrantSlugs } }
) => {
  const matchups: Matchup[] = [];
  for (let i = 0; i < entrantSlugs.length; i++) {
    for (let j = i + 1; j < entrantSlugs.length; j++) {
      if (i === j) continue;
      const entrantSlug1 = entrantSlugs[i];
      const entrantSlug2 = entrantSlugs[j];
      const entrant1 = await getStartGGUser(entrantSlug1);
      const entrant2 = await getStartGGUser(entrantSlug2);
      const matchup = await getStartGGMatchupBySlugs(
        entrantSlug1,
        entrantSlug2
      );
      console.log('matchup', matchup);
      matchups.push({
        entrant1: {
          id: entrant1.id,
          name: entrant1.player.gamerTag,
          slug: entrantSlug1,
        },
        entrant2: {
          id: entrant2.id,
          name: entrant2.player.gamerTag,
          slug: entrantSlug2,
        },
        score1: matchup.player1Wins.length,
        score2: matchup.player2Wins.length,
      });
    }
  }
  return matchups;
};
