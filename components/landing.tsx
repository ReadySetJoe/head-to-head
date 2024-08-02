import { useQuery } from '@apollo/client';
import { Box, Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { GetTournamentsDocument } from '../generated/graphql';

const Landing = () => {
  const { data, loading } = useQuery(GetTournamentsDocument);

  return (
    <Stack spacing={4} paddingTop={1}>
      <Typography variant="h4">Sup.</Typography>
      <Typography>
        This is a website for tracking head-to-head matchups between players in
        various tournaments.
      </Typography>
      <Stack direction={{ md: 'row' }} spacing={{ xs: 2 }} width="100%">
        <Button variant="contained" href="/head-to-head/by-url">
          Quick h2h by start.gg URL
        </Button>
        <Button variant="contained" href="/tournament/add">
          Add a tournament
        </Button>
        <Button variant="contained" href="/player/add">
          Add a player
        </Button>
        <Button variant="contained" href="/head-to-head">
          Full h2h (WIP)
        </Button>
      </Stack>
      <Typography variant="h4">Existing tournaments:</Typography>
      <Box>
        <Stack spacing={2}>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            data?.getTournaments.map(tournament => (
              <Link
                key={tournament.id.toString()}
                href={`https://www.start.gg/${tournament.slug}`}
                rel="noreferrer"
                target="_blank"
              >
                <Stack spacing={2} direction="row" flex={1} alignItems="center">
                  <img
                    src={tournament.image}
                    alt={tournament.name}
                    style={{ objectFit: 'cover', width: 50, height: 50 }}
                  />
                  <Typography>{tournament.name}</Typography>
                </Stack>
              </Link>
            ))
          )}
        </Stack>
      </Box>
    </Stack>
  );
};

export default Landing;
