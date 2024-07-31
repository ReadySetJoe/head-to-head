import axois from 'axios';

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
