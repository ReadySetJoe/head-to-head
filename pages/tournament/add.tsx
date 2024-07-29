import { useLazyQuery, useMutation } from '@apollo/client';
import { Cancel } from '@mui/icons-material';
import {
  Button,
  Card,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import React, { useState } from 'react';
import {
  AddTournamentDocument,
  FetchStartGgTournamentDocument,
  Tournament,
} from '../../generated/graphql';

const AddTournamentPage: React.FC = () => {
  const [newTournamentUrl, setNewTournamentUrl] = useState('');
  const [tournament, setTournament] = useState<Tournament>();

  const [fetchTournament] = useLazyQuery(FetchStartGgTournamentDocument);
  const [addTournament] = useMutation(AddTournamentDocument);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTournamentUrl(e.target.value);

    const splitUrl = e.target.value.split('/');
    const slug = splitUrl[4];

    const res = await fetchTournament({
      variables: {
        slug,
      },
    });

    setTournament(res.data.fetchStartGGTournament);
  };

  const handleAddTournament = async () => {
    const res = await addTournament({
      variables: {
        input: {
          slug: tournament!.slug,
          eventIds: tournament!.events.map(event => event.id),
        },
      },
    });

    if (!res.errors) {
      alert('Tournament added successfully');
      setNewTournamentUrl('');
      setTournament(undefined);
    }
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="New Tournament URL"
        value={newTournamentUrl}
        onChange={onChange}
        disabled={!!tournament}
        InputProps={{
          endAdornment: tournament && (
            <IconButton
              onClick={() => {
                setNewTournamentUrl('');
                setTournament(undefined);
              }}
            >
              <Cancel />
            </IconButton>
          ),
        }}
      />

      {tournament && (
        <Card sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Stack spacing={2} direction="row" flex={1} alignItems="center">
              <img
                src={tournament.image}
                alt={tournament.name}
                width="100rem"
              />
              <Stack spacing={1}>
                <Typography variant="h6">{tournament.name}</Typography>
                <Typography>
                  {format(new Date(tournament.startAt), 'PPPP')}
                </Typography>
              </Stack>
            </Stack>
            <Typography>Select events:</Typography>
            <Stack spacing={2}>
              {tournament.events.map(event => (
                <Stack
                  key={event.id.toString()}
                  spacing={2}
                  direction="row"
                  flex={1}
                  alignItems="center"
                >
                  {/* TODO: Add checkbox to only select specific events */}
                  <img src={event.image} alt={event.name} width="50rem" />
                  <Typography>{event.name}</Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Card>
      )}
      <Button
        disabled={!tournament}
        variant="contained"
        onClick={handleAddTournament}
      >
        Add Tournament
      </Button>
      {/* Logic to list existing tournaments from the database */}
    </Stack>
  );
};

export default AddTournamentPage;
