import { useLazyQuery, useQuery } from '@apollo/client';
import { Cancel } from '@mui/icons-material';
import {
  Avatar,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import {
  FetchStartGgUserDocument,
  GetMatchupBySlugsDocument,
} from '../../generated/graphql';

const getSlugFromUrl = (url: string) => {
  const splitUrl = url.split('/');
  return `${splitUrl[3]}/${splitUrl[4]}`;
};

const HeadToHead = () => {
  const [entrant1Url, setEntrant1Url] = useState('');
  const [entrant1Name, setEntrant1Name] = useState('');
  const [entrant1Image, setEntrant1Image] = useState('');
  const [entrant2Url, setEntrant2Url] = useState('');
  const [entrant2Name, setEntrant2Name] = useState('');
  const [entrant2Image, setEntrant2Image] = useState('');

  const [fetchStartGGUser] = useLazyQuery(FetchStartGgUserDocument);

  const { data, loading } = useQuery(GetMatchupBySlugsDocument, {
    skip: !entrant1Name || !entrant2Name,
    variables: {
      input: {
        entrantSlug1: getSlugFromUrl(entrant1Url),
        entrantSlug2: getSlugFromUrl(entrant2Url),
      },
    },
  });
  const matchup = data?.getMatchupBySlugs;

  const onChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    { setEntrantUrl, setEntrantName, setEntrantImage }
  ) => {
    setEntrantUrl(e.target.value);

    const res = await fetchStartGGUser({
      variables: {
        slug: getSlugFromUrl(e.target.value),
      },
    });

    if (res.data) {
      const { name, image } = res.data.fetchStartGGUser;
      setEntrantName(name);
      setEntrantImage(image);
    }
  };

  return (
    <Stack spacing={4} flex={1} alignItems="center">
      <Typography variant="h4">quick-h2h</Typography>
      <Typography>Compare two players by their smash.gg URLs</Typography>
      <Typography>
        (Note: these will not be entered into the database, and will disappear
        on refresh)
      </Typography>
      <Stack
        direction={{ md: 'row' }}
        width="100%"
        spacing={4}
        alignItems="center"
      >
        <Stack direction="column" alignItems="center" spacing={2} width="100%">
          <TextField
            label="Player 1 URL"
            value={entrant1Url}
            onChange={e =>
              onChange(e, {
                setEntrantUrl: setEntrant1Url,
                setEntrantName: setEntrant1Name,
                setEntrantImage: setEntrant1Image,
              })
            }
            disabled={!!entrant1Name}
            InputProps={{
              endAdornment: entrant1Name && (
                <IconButton
                  onClick={() => {
                    setEntrant1Url('');
                    setEntrant1Name('');
                    setEntrant1Image('');
                  }}
                >
                  <Cancel />
                </IconButton>
              ),
            }}
            fullWidth
          />
          <Typography variant="h5">{entrant1Name || ' '}</Typography>
        </Stack>
        <Typography variant="h3" p={4} fontWeight="bold">
          vs
        </Typography>
        <Stack direction="column" alignItems="center" spacing={2} width="100%">
          <TextField
            label="Player 2 URL"
            value={entrant2Url}
            onChange={e =>
              onChange(e, {
                setEntrantUrl: setEntrant2Url,
                setEntrantName: setEntrant2Name,
                setEntrantImage: setEntrant2Image,
              })
            }
            disabled={!!entrant2Name}
            InputProps={{
              endAdornment: entrant2Name && (
                <IconButton
                  onClick={() => {
                    setEntrant2Url('');
                    setEntrant2Name('');
                    setEntrant2Image('');
                  }}
                >
                  <Cancel />
                </IconButton>
              ),
            }}
            fullWidth
          />
          <Typography variant="h5">{entrant2Name || ' '}</Typography>
        </Stack>
      </Stack>
      {loading && <CircularProgress />}
      {matchup && (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              width: 75,
              height: 75,
            }}
            src={entrant1Image}
          />
          <Typography variant="h3">
            {matchup.score1} - {matchup.score2}
          </Typography>
          <Avatar
            sx={{
              width: 75,
              height: 75,
            }}
            src={entrant2Image}
          />
        </Stack>
      )}
      {/* <Autocomplete
        options={videogames}
        getOptionLabel={option => option.name}
        value={videogames.find(o => o.id === videogameId)}
        onChange={(_, value) => setVideogameId(value?.id)}
        renderInput={params => (
          <TextField {...params} label="Videogame (leave blank for all)" />
        )}
        fullWidth
      />
      <RadioGroup
        defaultValue={timeFilterOptions[0].value}
        onChange={e => setTimeFilter(e.target.value)}
      >
        {timeFilterOptions.map(option => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup> */}
    </Stack>
  );
};

export default HeadToHead;