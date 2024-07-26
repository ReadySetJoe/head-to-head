import { Resolvers } from '../../generated/resolvers-types';
import { getEntrants } from './entrant';
import { getMatchup } from './matchup';
import { fetchStartGGTournament } from './start-gg';
import { addTournament, getTournaments } from './tournament';

const resolvers: Resolvers = {
  Query: {
    fetchStartGGTournament,
    getEntrants,
    getMatchup,
    getTournaments,
  },
  Mutation: {
    addTournament,
  },
};

export default resolvers;
