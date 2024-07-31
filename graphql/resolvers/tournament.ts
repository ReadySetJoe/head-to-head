import { fromUnixTime } from 'date-fns';
import {
  MutationResolvers,
  QueryResolvers,
} from '../../generated/resolvers-types';
import prisma from '../../lib/prisma';
import { getStartGGTournamentForDb } from '../../lib/start-gg';

interface TournamentData {
  id: number;
  name: string;
  slug: string;
  startAt: number;
  images: { url: string }[];
  events: EventData[];
}

interface EventData {
  id: number;
  name: string;
  videogame: VideogameData;
  sets: { nodes: SetData[] };
}

interface VideogameData {
  id: number;
  name: string;
}

interface SetData {
  id: number;
  winnerId: number | null;
  slots: { entrant: EntrantData | null }[];
}

interface EntrantData {
  id: number | null;
  participants: ParticipantData[];
}

interface ParticipantData {
  id: number;
  player: { gamerTag: string };
  user: { id: number; slug: string; images: { url: string }[] };
}

function createEntrantUpsert(entrant: EntrantData | null) {
  if (!entrant?.participants[0]?.user?.slug) {
    return null;
  }
  // TODO: account for doubles
  if (entrant.participants.length > 1) {
    return null;
  }
  const participant = entrant.participants[0]; // Assuming we use the first participant's data
  return {
    connectOrCreate: {
      where: { id: participant?.user?.id },
      create: {
        id: participant?.user?.id,
        name: participant?.player.gamerTag,
        slug: participant?.user?.slug,
        image: participant?.user?.images[0]?.url,
      },
    },
  };
}

function createSetUpsert(set: SetData) {
  if (typeof set?.id !== 'number') {
    return null;
  }
  const winnerEntrant =
    set.winnerId !== null
      ? set.slots.find(slot => slot.entrant?.id === set.winnerId)?.entrant
      : null;
  const loserEntrant = set.slots
    .filter(
      slot => slot.entrant?.id !== set.winnerId && slot.entrant?.id !== null
    )
    .map(slot => slot.entrant!)[0];

  const update: any = {};
  const create: any = { id: set.id };

  const winnerUpsert = winnerEntrant
    ? createEntrantUpsert(winnerEntrant)
    : null;
  if (winnerUpsert) {
    update.SetEntrantWinner = {
      upsert: {
        where: { setId: set.id },
        create: { entrant: winnerUpsert },
        update: { entrant: winnerUpsert },
      },
    };
    create.SetEntrantWinner = {
      create: { entrant: winnerUpsert },
    };
  }

  const loserUpsert = loserEntrant ? createEntrantUpsert(loserEntrant) : null;
  if (loserUpsert) {
    update.SetEntrantLoser = {
      upsert: {
        where: { setId: set.id },
        create: { entrant: loserUpsert },
        update: { entrant: loserUpsert },
      },
    };
    create.SetEntrantLoser = {
      create: { entrant: loserUpsert },
    };
  }

  // Only return the upsert object if there's something to update or create
  if (Object.keys(update).length > 0 || Object.keys(create).length > 1) {
    return {
      where: { id: set.id },
      update,
      create,
    };
  }

  return null;
}

function createEventUpsert(event: EventData) {
  return {
    where: { id: event.id },
    update: {
      name: event.name,
      videogame: {
        connectOrCreate: {
          where: { id: event.videogame.id },
          create: { id: event.videogame.id, name: event.videogame.name },
        },
      },
      sets: {
        upsert: event.sets.nodes
          .map(createSetUpsert)
          .filter(
            setUpsert =>
              !setUpsert ||
              Object.keys(setUpsert.update).length > 0 ||
              Object.keys(setUpsert.create).length > 1
          ),
      },
    },
    create: {
      id: event.id,
      name: event.name,
      videogame: {
        connectOrCreate: {
          where: { id: event.videogame.id },
          create: { id: event.videogame.id, name: event.videogame.name },
        },
      },
      sets: {
        create: event.sets.nodes
          .map(createSetUpsert)
          .filter(
            setUpsert => !setUpsert || Object.keys(setUpsert.create).length > 1
          )
          .map(setUpsert => setUpsert.create),
      },
    },
  };
}

export async function addTournamentToDb(tournamentData: TournamentData) {
  const startAtDate = fromUnixTime(tournamentData.startAt).toISOString();

  return await prisma.tournament.upsert({
    where: { id: tournamentData.id },
    update: {
      name: tournamentData.name,
      slug: tournamentData.slug,
      startAt: startAtDate,
      image: tournamentData.images[0]?.url,
      events: { upsert: tournamentData.events.map(createEventUpsert) },
    },
    create: {
      id: tournamentData.id,
      name: tournamentData.name,
      slug: tournamentData.slug,
      image: tournamentData.images[0]?.url,
      startAt: startAtDate,
      events: {
        create: tournamentData.events.map(
          event => createEventUpsert(event).create
        ),
      },
    },
  });
}

export const addTournament: MutationResolvers['addTournament'] = async (
  _parent,
  { input: { slug } }
) => {
  const existingTournament = await prisma.tournament.findFirst({
    where: { slug },
  });
  if (existingTournament) {
    return {
      ...existingTournament,
      startAt: existingTournament.startAt.toISOString(),
    };
  }
  const tournamentData = await getStartGGTournamentForDb(slug);
  const tournament = await addTournamentToDb(tournamentData);
  return {
    ...tournament,
    startAt: tournament.startAt.toISOString(),
  };
};

export const getTournaments: QueryResolvers['getTournaments'] = async (
  _parent,
  _args
) => {
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
