import { Resolvers } from '../../generated/resolvers-types';
import { addEntrant, getEntrants } from './entrant';
import { getMatchup } from './matchup';
import { fetchStartGGTournament, fetchStartGGUser } from './start-gg';
import { addTournament, getTournaments } from './tournament';
import { getVideogames } from './videogame';

const resolvers: Resolvers = {
  Query: {
    fetchStartGGTournament,
    fetchStartGGUser,
    getEntrants,
    getMatchup,
    getTournaments,
    getVideogames,
  },
  Mutation: {
    addEntrant,
    addTournament,
  },
};

export default resolvers;
