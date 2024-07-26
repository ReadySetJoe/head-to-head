import { MutationResolvers } from '../../generated/resolvers-types';

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
          events(filter: { ids: [${eventIds.join(',')}] }) {
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

  const tournament = await prisma.tournament.upsert({
    where: { id: tournamentData.id },
    update: {
      id: tournamentData.id,
      name: tournamentData.name,
      slug: tournamentData.slug,
      image: tournamentData.images[0].url,
    },
    create: {
      id: tournamentData.id,
      slug: tournamentData.slug,
      name: tournamentData.name,
      image: tournamentData.images[0].url,
    },
  });

  console.log('tournamentData', JSON.stringify(tournamentData, null, 2));

  await Promise.all(
    tournamentData.events.map(async event => {
      const videogame = await prisma.videogame.upsert({
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
          tournamentId: tournament.id,
          videogameId: videogame.id,
        },
        create: {
          id: event.id,
          name: event.name,
          tournamentId: tournament.id,
          videogameId: videogame.id,
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

          // TODO: add images from start.gg
          await prisma.entrant.upsert({
            where: { id: winner.user.id },
            update: {
              name: winner.player.gamerTag,
            },
            create: {
              id: winner.user.id,
              name: winner.player.gamerTag,
            },
          });

          await prisma.entrant.upsert({
            where: { id: loser.user.id },
            update: {
              name: loser.player.gamerTag,
            },
            create: {
              id: loser.user.id,
              name: loser.player.gamerTag,
            },
          });

          await prisma.set.upsert({
            where: { eventId: event.id, id: set.id },
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

  return {
    id: tournament.id,
    slug: tournament.slug,
    name: tournament.name,
  };
};

export const getTournaments = async () => {
  return await prisma.tournament.findMany();
};
