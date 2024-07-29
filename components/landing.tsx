import { useQuery } from '@apollo/client';
import { Box, Button, Stack, Typography } from '@mui/material';
import { GetTournamentsDocument } from '../generated/graphql';

const Landing = () => {
  const { data, loading } = useQuery(GetTournamentsDocument);

  return (
    <Stack spacing={5} paddingTop={5}>
      <Typography variant="h3">Welcome!</Typography>
      <Button variant="contained" color="primary" href="/tournaments/add">
        Add a tournament
      </Button>
      <Typography variant="h4">Existing tournaments:</Typography>
      <Box>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          data?.getTournaments.map(tournament => (
            <Stack
              key={tournament.id.toString()}
              spacing={2}
              direction="row"
              flex={1}
              alignItems="center"
            >
              <img src={tournament.image} alt={tournament.name} width="50rem" />
              <Typography>{tournament.name}</Typography>
            </Stack>
          ))
        )}
      </Box>
    </Stack>
  );
};

export default Landing;
