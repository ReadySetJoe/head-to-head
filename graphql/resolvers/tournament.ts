import {
  MutationResolvers,
  QueryResolvers,
} from '../../generated/resolvers-types';
import prisma from '../../lib/prisma';

type TournamentQueryResponse = {
  id: number;
  name: string;
  slug: string;
  images: {
    url: string;
  }[];
  events: {
    id: number;
    name: string;
    sets: {
      nodes: {
        id: number;
        winnerId: number;
        slots: {
          entrant: {
            id: number;
            participants: {
              id: number;
              player: {
                gamerTag: string;
              };
              user: {
                id: number;
                slug: string;
                images: {
                  url: string;
                }[];
              };
            }[];
          };
        }[];
      }[];
    };
    videogame: {
      id: number;
      name: string;
    };
  }[];
};

const headers = {
  Authorization: `Bearer ${process.env.START_GG_API_KEY}`,
  'Content-Type': 'application/json',
};

export const addTournamentToDb = async (
  tournamentData: TournamentQueryResponse
) => {
  const tournament = await prisma.tournament.upsert({
    where: { id: tournamentData.id },
    update: {
      id: tournamentData.id,
      name: tournamentData.name,
      slug: tournamentData.slug,
      image: tournamentData.images[0]?.url,
    },
    create: {
      id: tournamentData.id,
      slug: tournamentData.slug,
      name: tournamentData.name,
      image: tournamentData.images[0]?.url,
    },
  });

  await Promise.all(
    tournamentData.events.map(async event => {
      await prisma.videogame.upsert({
        where: { id: event.videogame.id },
        update: {
          name: event.videogame.name,
        },
        create: {
          id: event.videogame.id,
          name: event.videogame.name,
        },
      });

      const dbEvent = await prisma.event.upsert({
        where: { id: event.id },
        update: {
          name: event.name,
          tournamentId: tournamentData.id,
          videogameId: event.videogame.id,
        },
        create: {
          id: event.id,
          name: event.name,
          tournamentId: tournamentData.id,
          videogameId: event.videogame.id,
        },
      });

      await Promise.all(
        event.sets.nodes.map(async set => {
          if (!set.winnerId) {
            return;
          }
          // Ignore teams for now
          if (set.slots[0].entrant.participants.length > 1) {
            return;
          }

          const winner = set.slots.find(
            slot => slot.entrant.id === set.winnerId
          ).entrant.participants[0];
          const loser = set.slots.find(slot => slot.entrant.id !== set.winnerId)
            .entrant.participants[0];

          // Sometimes there's no user for some reason?
          if (!winner?.user?.id || !loser?.user?.id) {
            return;
          }

          console.log('winner', JSON.stringify(winner, null, 2));

          await prisma.entrant.upsert({
            where: { id: winner.user.id },
            update: {
              name: winner.player.gamerTag,
              image: winner.user.images[0]?.url,
            },
            create: {
              id: winner.user.id,
              name: winner.player.gamerTag,
              slug: winner.user.slug,
              image: winner.user.images[0]?.url,
            },
          });

          await prisma.entrant.upsert({
            where: { id: loser.user.id },
            update: {
              name: loser.player.gamerTag,
              image: loser.user.images[0]?.url,
            },
            create: {
              id: loser.user.id,
              name: loser.player.gamerTag,
              slug: loser.user.slug,
              image: loser.user.images[0]?.url,
            },
          });

          await prisma.set.upsert({
            where: { id: set.id },
            update: {},
            create: {
              id: set.id,
              eventId: event.id,
              winnerId: winner.user.id,
              loserId: loser.user.id,
            },
          });
        })
      );

      return dbEvent;
    })
  );

  return tournament;
};

export const addTournament: MutationResolvers['addTournament'] = async (
  _parent,
  { input: { slug, eventIds } }
) => {
  const tournamentBody = JSON.stringify({
    query: `
      query TournamentPageHead($slug: String!) {
        tournament(slug: $slug) {
          id
          slug
          name
          images {
            url
          }
          events${
            eventIds ? `(filter: { ids: [${eventIds.join(',')}] })` : ''
          } {
            id
            name
            sets {
              nodes {
                id
                winnerId
                slots {
                  entrant {
                    id
                    participants {
                      id
                      user {
                        id
                        slug
                        images {
                          url
                        }
                      }
                      player {
                        gamerTag
                      }
                    }
                  }
                }
              }
            }
            videogame {
              id
              name
            }
          }
        }
      }
    `,
    variables: { slug },
  });

  const tournamentRes = await fetch('https://api.start.gg/gql/alpha', {
    method: 'POST',
    headers,
    body: tournamentBody,
  });

  const tournamentData = (await tournamentRes.json()).data
    .tournament as TournamentQueryResponse;

  const tournament = await addTournamentToDb(tournamentData);

  return {
    id: tournament.id,
    slug: tournament.slug,
    name: tournament.name,
  };
};

export const getTournaments: QueryResolvers['getTournaments'] = async () => {
  const tournaments = await prisma.tournament.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
    },
  });

  return tournaments;
};
