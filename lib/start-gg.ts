import axois from 'axios';
import { fromUnixTime } from 'date-fns';

const headers = {
  Authorization: `Bearer ${process.env.START_GG_API_KEY}`,
  'Content-Type': 'application/json',
};

type StartGGTournamentData = {
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

type StartGGTournamentQueryResponse = {
  data: {
    data: {
      tournament: StartGGTournamentData;
    };
  };
};

export type StartGGTournamentDataForDb = {
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

type StartGGUserData = {
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

type StartGGUserQueryResponse = {
  data: {
    data: {
      user: StartGGUserData;
    };
  };
};

const getPlayerIdWithFewerSets = async (
  player1Id: number,
  player2Id: number
) => {
  const query = `
      query PlayerQuery($playerId: ID!) {
        player(id: $playerId) {
          id
          sets(perPage: 1) {
            pageInfo {
              total
            }
          }
        }
      }
    `;
  const totalSets1 = JSON.stringify({
    query,
    variables: { playerId: player1Id },
  });
  const totalSets2 = JSON.stringify({
    query,
    variables: { playerId: player2Id },
  });

  const res1 = await axois.post('https://api.smash.gg/gql/alpha', totalSets1, {
    headers,
  });
  const res2 = await axois.post('https://api.smash.gg/gql/alpha', totalSets2, {
    headers,
  });

  if (
    res1.data.data.player.sets.pageInfo.total >
    res2.data.data.player.sets.pageInfo.total
  ) {
    return player2Id;
  }

  return player1Id;
};

export const getStartGGTournament = async (
  slug: string
): Promise<StartGGTournamentData> => {
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

  const res = (await axois.post(
    'https://api.smash.gg/gql/alpha',
    tournamentBody,
    { headers }
  )) as StartGGTournamentQueryResponse;

  return res.data.data.tournament;
};

export const getStartGGTournamentForDb = async (slug: string) => {
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

  const res = await axois.post(
    'https://api.smash.gg/gql/alpha',
    tournamentBody,
    { headers }
  );

  return res.data.data.tournament as StartGGTournamentDataForDb;
};

export const getStartGGUser = async (slug: string) => {
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

  const res = (await axois.post('https://api.smash.gg/gql/alpha', userBody, {
    headers,
  })) as StartGGUserQueryResponse;

  return res.data.data.user;
};

export const getStartGGMatchupBySlugs = async (
  slug1: string,
  slug2: string,
  startAfter?: string,
  videogameId?: number
) => {
  const playersBody = JSON.stringify({
    query: `
      query PlayerWinningSetCounts($slug1: String!, $slug2: String!) {
        player1: user(slug: $slug1) {
          player { id }
        }
        player2: user(slug: $slug2) {
          player { id }
        }
      }
    `,
    variables: { slug1, slug2 },
  });

  const playersRes = await axois.post(
    'https://api.smash.gg/gql/alpha',
    playersBody,
    {
      headers,
    }
  );

  const player1Id = playersRes.data.data.player1.player.id;
  const player2Id = playersRes.data.data.player2.player.id;

  const player1Wins = [];
  const player2Wins = [];
  let page = 1;
  let hasNextPage = true;

  const playerIdForQuery = await getPlayerIdWithFewerSets(player1Id, player2Id);

  while (hasNextPage) {
    const matchupBody = JSON.stringify({
      query: `
        query MatchupQuery {
          player(id: "${playerIdForQuery}") {
            id
            sets(page: ${page}, perPage: 50) {
              pageInfo {
                perPage
              }
              nodes {
                id
                event {
                  videogame {
                    id
                  }
                  tournament {
                    startAt
                  }
                }
                winnerId
                slots {
                  entrant {
                    id
                    participants {
                      id
                      player {
                        id
                        gamerTag
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
    });

    const matchupRes = await axois.post(
      'https://api.smash.gg/gql/alpha',
      matchupBody,
      {
        headers,
      }
    );

    const { pageInfo, nodes } = matchupRes.data.data.player.sets;

    nodes.forEach(set => {
      // TODO: ignore doubles for now
      if (set.slots[0].entrant.participants.length > 1) {
        return;
      }

      if (videogameId && set.event.videogame.id !== videogameId) {
        return;
      }

      if (
        startAfter &&
        fromUnixTime(set.event.tournament.startAt).toISOString() < startAfter
      ) {
        return;
      }
      const slot1PlayerId = set.slots[0].entrant.participants[0].player.id;
      const slot1IsPlayer1 = slot1PlayerId === player1Id;
      const slot1IsPlayer2 = slot1PlayerId === player2Id;

      const slot2PlayerId = set.slots[1].entrant.participants[0].player.id;
      const slot2IsPlayer1 = slot2PlayerId === player1Id;
      const slot2IsPlayer2 = slot2PlayerId === player2Id;

      const setIsBetweenPlayers =
        (slot1IsPlayer1 && slot2IsPlayer2) ||
        (slot1IsPlayer2 && slot2IsPlayer1);

      if (setIsBetweenPlayers) {
        if (set.winnerId === set.slots[0].entrant.id) {
          if (slot1IsPlayer1) {
            player1Wins.push(set);
          } else {
            player2Wins.push(set);
          }
        } else if (set.winnerId === set.slots[1].entrant.id) {
          if (slot2IsPlayer1) {
            player1Wins.push(set);
          } else {
            player2Wins.push(set);
          }
        }
      }
    });

    hasNextPage = nodes.length === pageInfo.perPage;
    page++;
  }

  return { player1Wins, player2Wins };
};
