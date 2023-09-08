import { useQuery } from '@apollo/client';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { PrintMessageDocument } from '../generated/graphql';

const Landing = () => {
  const { data: session } = useSession();
  const { data, loading } = useQuery(PrintMessageDocument, {
    variables: {
      message: 'Hello world!',
    },
  });

  return (
    <Stack spacing={5} paddingTop={5}>
      <Typography variant="h3">Welcome!</Typography>
      <Box sx={{ width: 'fit-content' }}>
        <Button
          variant="contained"
          href="/api/auth/signin"
          disabled={!!session}
        >
          {!!session ? 'Signed in!' : 'Sign in'}
        </Button>
      </Box>
      <Button>
        Called the backend and print the response:{' '}
        {loading ? '...' : data?.printMessage}
      </Button>
    </Stack>
  );
};

export default Landing;
