import { QueryResolvers } from '../../generated/resolvers-types';
import prisma from '../../lib/prisma';
import { addTournamentToDb } from './tournament';

const headers = {
  Authorization: `Bearer ${process.env.START_GG_API_KEY}`,
  'Content-Type': 'application/json',
};

export const getEntrants: QueryResolvers['getEntrants'] = async (
  _parent,
  { search }
) => {
  return prisma.entrant.findMany({
    where: {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    },
    orderBy: { name: 'asc' },
  });
};

export const addEntrant: QueryResolvers['addEntrant'] = async (
  _parent,
  { input: { slug } }
) => {
  const userBody = JSON.stringify({
    query: `
      query PlayerQuery($slug: String) {
        user(slug: $slug) {
          id
          slug
          images {
            url
          }
          player {
            gamerTag
          }
          tournaments(query: { perPage: 500 }) {
            nodes {
              id
              name
              images {
                url
              }
              events {
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
        }
      }
    `,
    variables: { slug },
  });

  const userRes = await fetch('https://api.start.gg/gql/alpha', {
    method: 'POST',
    headers,
    body: userBody,
  });

  const user = (await userRes.json()).data.user;

  const entrant = await prisma.entrant.upsert({
    where: { id: user.id },
    update: {
      name: user.player.gamerTag,
      image: user.images[0].url,
    },
    create: {
      id: user.id,
      slug: user.slug,
      name: user.player.gamerTag,
      image: user.images[0].url,
    },
  });

  await Promise.all(user.tournaments.nodes.map(addTournamentToDb));

  return entrant;
};
