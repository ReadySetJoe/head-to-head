import { fromUnixTime } from 'date-fns';
import { QueryResolvers } from '../../generated/resolvers-types';

type TournamentQueryResponse = {
  id: number;
  name: string;
  slug: string;
  images: {
    url: string;
  }[];
  startAt: number;
  events: {
    id: number;
    name: string;
    videogame: {
      images: {
        url: string;
      }[];
    };
  }[];
};

type UserQueryResponse = {
  id: number;
  slug: string;
  player: {
    gamerTag: string;
  };
  images: {
    url: string;
  }[];
  tournaments: {
    nodes: {
      id: number;
      name: string;
      slug: string;
    }[];
  };
};

const headers = {
  Authorization: `Bearer ${process.env.START_GG_API_KEY}`,
  'Content-Type': 'application/json',
};

export const fetchStartGGTournament: QueryResolvers['fetchStartGGTournament'] =
  async (_parent: any, { slug }: { slug: string }) => {
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
          startAt
          events {
            id
            name
            videogame {
              images {
                url
              }
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

    const tournament = (await tournamentRes.json()).data
      .tournament as TournamentQueryResponse;

    return {
      id: tournament.id,
      slug: tournament.slug,
      name: tournament.name,
      image: tournament.images[0].url,
      startAt: fromUnixTime(tournament.startAt).toISOString(),
      events: tournament.events.map(event => ({
        id: event.id,
        name: event.name,
        image: event.videogame.images[0].url,
      })),
    };
  };

export const fetchStartGGUser: QueryResolvers['fetchStartGGUser'] = async (
  _parent,
  { slug }
) => {
  const userBody = JSON.stringify({
    query: `
      query PlayerQuery($slug: String) {
        user(slug: $slug) {
          id
          slug
          player {
            gamerTag
          }
          images {
            url
          }
          tournaments(query: { perPage: 500 }) {
            nodes {
              id
              name
              slug
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

  const user = (await userRes.json()).data.user as UserQueryResponse;

  return {
    id: user.id,
    slug: user.slug,
    name: user.player.gamerTag,
    image: user.images[0].url,
    tournaments: user.tournaments.nodes.map(node => ({
      id: node.id,
      name: node.name,
      slug: node.slug,
    })),
  };
};
