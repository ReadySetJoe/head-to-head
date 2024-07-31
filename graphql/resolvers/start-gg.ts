import { fromUnixTime } from 'date-fns';
import { QueryResolvers } from '../../generated/resolvers-types';
import { getStartGGTournament, getStartGGUser } from '../../lib/start-gg';

export const fetchStartGGTournament: QueryResolvers['fetchStartGGTournament'] =
  async (_parent: any, { slug }: { slug: string }) => {
    const tournament = await getStartGGTournament(slug);

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
  const user = await getStartGGUser(slug);

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
