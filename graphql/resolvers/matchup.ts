import { QueryResolvers } from '../../generated/resolvers-types';

export const getMatchup: QueryResolvers['getMatchup'] = async (
  _parent,
  { input: { entrantId1, entrantId2, eventIds } }
) => {
  const query = {
    where: {
      AND: [
        {
          OR: [
            { winnerId: entrantId1, loserId: entrantId2 },
            { winnerId: entrantId2, loserId: entrantId1 },
          ],
        },
      ],
    },
  };

  if (eventIds) {
    query.where.AND.push({ eventId: { in: eventIds } });
  }
  const matches = await prisma.set.findMany(query);

  return {
    entrantId1: entrantId1,
    entrantId2: entrantId2,
    score1: matches.filter(match => match.winnerId === entrantId1).length,
    score2: matches.filter(match => match.winnerId === entrantId2).length,
  };
};
