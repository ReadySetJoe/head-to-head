import { useLazyQuery, useMutation } from '@apollo/client';
import { Cancel } from '@mui/icons-material';
import {
  Button,
  Card,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import {
  AddTournamentDocument,
  FetchStartGgUserDocument,
} from '../../generated/graphql';

const AddPlayerPage: React.FC = () => {
  const [newEntrantUrl, setNewEntrantUrl] = useState('');
  const [entrantName, setEntrantName] = useState('');
  const [entrantImage, setEntrantImage] = useState('');
  const [tournaments, setTournaments] = useState([]);
  const [numCompleted, setNumCompleted] = useState(0);
  const [totalTournaments, setTotalTournaments] = useState(0);
  const [processing, setProcessing] = useState(false);

  const [fetchStartGGUser] = useLazyQuery(FetchStartGgUserDocument);
  const [addTournament, { loading }] = useMutation(AddTournamentDocument);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEntrantUrl(e.target.value);

    const splitUrl = e.target.value.split('/');
    console.log('splitUrl', splitUrl);
    const slug = splitUrl[4];

    const res = await fetchStartGGUser({
      variables: {
        slug,
      },
    });

    if (res.data) {
      const { name, image, tournaments } = res.data.fetchStartGGUser;
      setEntrantName(name);
      setEntrantImage(image);
      setTournaments(tournaments);
      setTotalTournaments(tournaments.length);
    }
  };

  const handleAddEntrant = async () => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    setNumCompleted(0);
    setProcessing(true);

    const successes = [];
    for (const t of tournaments) {
      try {
        const res = await addTournament({
          variables: {
            input: {
              slug: t.slug.replace('tournament/', ''),
            },
          },
        });

        successes.push(!res.errors);
      } catch (error) {
        successes.push(false);
      }
      setNumCompleted(prev => prev + 1);

      await delay(tournaments.length > 80 ? 750 : 0);
    }

    setNumCompleted(successes.filter(s => s === true).length);
    setProcessing(false);
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="New Player Profile URL"
        value={newEntrantUrl}
        onChange={onChange}
        disabled={!!entrantName}
        InputProps={{
          endAdornment: entrantName && (
            <IconButton
              onClick={() => {
                setNewEntrantUrl('');
                setEntrantName('');
                setEntrantImage('');
                setTournaments([]);
                setTotalTournaments(0);
                setNumCompleted(0);
                setProcessing(false);
              }}
            >
              <Cancel />
            </IconButton>
          ),
        }}
      />

      {entrantName && (
        <Card sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Stack spacing={2} direction="row" flex={1} alignItems="center">
              <img src={entrantImage} alt={entrantName} width="100rem" />
              <Stack spacing={1}>
                <Typography variant="h6">{entrantName}</Typography>
                <Typography variant="body2">
                  # of tournaments: {tournaments.length}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Card>
      )}
      <Button
        disabled={!entrantName || loading || processing}
        variant="contained"
        onClick={handleAddEntrant}
      >
        Add Player
      </Button>
      {entrantName && numCompleted !== 0 && (
        <>
          {processing && (
            <LinearProgress
              variant="determinate"
              value={(numCompleted / totalTournaments) * 100}
            />
          )}
          <Typography>
            {numCompleted} out of {totalTournaments} tournaments added
          </Typography>
          {!processing && (
            <Typography>
              {numCompleted === totalTournaments
                ? 'All tournaments added successfully'
                : `${
                    totalTournaments - numCompleted
                  } tournament(s) failed to add`}
            </Typography>
          )}
        </>
      )}
    </Stack>
  );
};

export default AddPlayerPage;
