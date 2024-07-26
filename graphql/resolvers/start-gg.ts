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

type EventSetsQueryResponse = {
  id: number;
  name: string;
  sets: {
    pageInfo: {
      total: number;
    };
    nodes: {
      id: number;
      round: number;
      fullRoundText: string;
      winnerId: number;
      completedAt: number;
      displayScore: string;
      slots: {
        id: string;
        entrant: {
          id: number;
          name: string;
        };
      }[];
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

export const fetchStartGGEvent = async (
  _parent: any,
  { eventId, page, perPage }: { eventId: number; page: number; perPage: number }
) => {
  const eventSetsBody = JSON.stringify({
    query: `
      query EventSets($eventId: Int!, $page: Int!, $perPage: Int!) {
        event(id: $eventId) {
          id
          name
          sets(query: { page: $page, perPage: $perPage }) {
            pageInfo {
              total
            }
            nodes {
              id
              round
              fullRoundText
              winnerId
              completedAt
              displayScore
              slots {
                id
                entrant {
                  id
                  name
                }
              }
            }
          }
        }
      }
  `,
    variables: { eventId, page, perPage },
  });

  const eventSetsRes = await fetch('https://api.start.gg/gql/alpha', {
    method: 'POST',
    headers,
    body: eventSetsBody,
  });

  const event = (await eventSetsRes.json()).data
    .event as EventSetsQueryResponse;

  return { event };
};
